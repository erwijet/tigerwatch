defmodule Caroline.Tigerspend.Parsing do
  alias NimbleCSV.RFC4180, as: CSV
  import Caroline.Tigerspend.Dates

  # load on-campus dining locations from config folder
  def load_config do
    "priv/config/locations.json"
    |> File.read!()
    |> Poison.decode!()
  end

  # accepts in some csv multiline data and returns a parsed JSON string
  # def csv_to_clean_json(csv, acct) do
  #   csv
  #   |> to_string
  #   |> CSV.parse_string()
  #   # take our list of lists and create a list of maps
  #   |> Enum.map(&csv_transaction_to_map/1)
  #   # apply formatting to data (and replace with nil if we don't match it)
  #   |> Enum.map(&clean_transaction_map/1)
  #   # drop nil values (since nil is falsy and the only other value is a map, we drop all falsy values here) 
  #   |> Enum.filter(& &1)
  #   # add account code
  #   |> Enum.map(fn transaction -> transaction |> Map.put(:acct, acct) end)
  #   # to JSON
  #   |> Poison.encode!()
  # end

  def parse_csv(csv, acct) do
    IO.inspect(csv)

    if csv == "No transaction history found for this date range",
      do: [],
      else:
        csv
        |> to_string
        |> CSV.parse_string()
        |> Enum.map(&csv_transaction_to_map(&1, acct))
  end

  def sort_map_list_chrono(list) when is_list(list) do
    Enum.map(list, &Map.get(&1, :date)) |> IO.inspect()
    Enum.sort(list, &(DateTime.compare(Map.get(&2, :date), Map.get(&1, :date)) != :gt))
  end

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
