defmodule Caroline.Tigerspend.Parsing do
    alias NimbleCSV.RFC4180, as: CSV

    # load on-campus dining locations from config folder
    def load_config do
        "priv/config/locations.json"
        |> File.read!()
        |> Poison.decode!()
    end

    # accepts in some csv multiline data and returns a parsed JSON string
    def csv_to_clean_json(csv) do
        csv
        |> to_string
        |> CSV.parse_string
        |> Enum.map(&csv_transaction_to_map/1)  # take our list of lists and create a list of maps
        |> Enum.map(&clean_transaction_map/1)   # apply formatting to data (and replace with nil if we don't match it)
        |> Enum.filter(& &1)                    # drop nil values (since nil is falsy and the only other value is a map, we drop all falsy values here) 
        |> Poison.encode!                       # to JSON
    end

    # accepts a list of 4 elements and returns a map pointing to each of those elements
    defp csv_transaction_to_map(csv_transaction) do
        with [ date, description, amount, balance ] <- csv_transaction do
            %{
                date: date,
                description: description,
                amount: amount,
                balance: balance
            }
        else
            _ -> raise "malformed csv_transaction list"
        end
    end

    defp clean_transaction_map(transaction_map) do
        load_config()
        |> Enum.map(fn config -> %{ config | "regex" => Regex.compile(Map.get(config, "regex")) } end)
        |> Enum.filter(fn %{"regex" => {:ok, regex}} -> Regex.match?(regex, Map.get(transaction_map, :description)) end)
        |> Enum.at(0)
        |> (fn
                nil -> nil # if nil (we didnt match anything in call above) then we can't pipe to Map.drop/3 so just pass along nil
                map -> Map.drop(map, ["regex"])
        end).()
        |> (fn
                nil -> nil # same here, except we just return the nil so the entry gets dropped (often the case with deposits, admin tasks, etc) 
                location -> transaction_map |> Map.drop([:description]) |> Map.put(:location, location)
        end).()
    end
end