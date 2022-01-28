defmodule Caroline.Tigerspend.Parsing do
  alias NimbleCSV.RFC4180, as: CSV
  import Caroline.Tigerspend.Dates

  # load on-campus dining locations from config folder
  def load_config do
    "priv/config/locations.json"
    |> File.read!()
    |> Poison.decode!()
  end

  # take a string of RAW csv (bitstring) from http repsonse and parse it into a list of maps
  # we pass the account code here to flag each transaction with it so we know where they come from
  # when it comes times to merge all transactions together and sort by date
  def parse_csv(csv, acct) do
    if csv |> to_string =~ "No transaction history found for this date range",
      do: [],
      else:
        csv
        |> to_string
        |> CSV.parse_string()
        |> Enum.map(&csv_transaction_to_map(&1, acct))
  end

  # accepts a list of maps and sorts them chonologicaly by :date from newest to oldest
  def sort_map_list_chrono(list) when is_list(list),
    do: list |> Enum.sort(&(DateTime.compare(Map.get(&2, :date), Map.get(&1, :date)) != :gt))

  # parse a list of maps into a JSON string representation
  # this function also "cleans" the data. This means attaching additional information 
  # about the transactions as specified in config/locations.json as well as dropping non-included transactions,
  # such as various admin_tasks
  def map_list_to_json(list) when is_list(list) do
    list
    |> Enum.map(&clean_transaction_map/1)
    |> Enum.filter(& &1)
    |> Poison.encode!()
  end

  # accepts a list of 4 elements and an account code and returns a map pointing to each of those elements
  defp csv_transaction_to_map(csv_transaction, acct) do
    with [date, description, amount, balance] <- csv_transaction do
      %{
        date: parse_date(date),
        description: description,
        amount: amount,
        balance: balance,
        acct: acct
      }
    else
      _ -> raise "malformed csv_transaction list"
    end
  end

  # "clean" a transaction map. This entails pulling from config/locations.json to add information such as
  # location category, common name, icon, and whether to even include it in the final list or not. This step
  defp clean_transaction_map(transaction_map) when is_map(transaction_map) do
    load_config()
    # compile each regular expression
    |> Enum.map(fn config -> %{config | "regex" => Regex.compile(Map.get(config, "regex"))} end)
    # drop all values who's regex doesn't match :description on transaction_map
    |> Enum.filter(fn %{"regex" => {:ok, regex}} ->
      Regex.match?(regex, Map.get(transaction_map, :description))
    end)
    |> Enum.at(0)
    |> (fn
          # if nil (we didnt match anything in call above) then we can't pipe to Map.drop/3 so just pass along nil
          nil -> nil
          map -> Map.drop(map, ["regex"])
        end).()
    |> (fn
          # same here, except we just return the nil so the entry gets dropped (often the case with deposits, admin tasks, etc) 
          nil -> nil
          location -> transaction_map |> Map.drop([:description]) |> Map.put(:location, location)
        end).()
  end
end
