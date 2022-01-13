defmodule Caroline.Tigerspend do
  import Caroline.Tigerspend.Dates
  import Caroline.Tigerspend.Parsing

  @acct_tgrbkx 1
  @acct_dd_std 4
  @acct_dd_volun 24
  @acct_dd_rlovr 29

  defp build_tigerspend_link({{startdate, enddate}, skey}, acct) do
    to_charlist(
      "http://tigerspend.rit.edu/statementdetail.php?cid=105&skey=" <>
        skey <>
        "&startdate=" <>
        startdate <> "&enddate=" <> enddate <> "&acct=" <> to_string(acct) <> "&format=csv"
    )
  end

  def fetch_acct_pub(skey, acct), do: fetch_acct({:ok, [], skey}, acct)

  defp fetch_acct({:ok, prev_data}, skey, acct) when is_list(prev_data) do
    with {:ok, {_, headers, body}} <-
           :httpc.request(
             :get,
             {build_tigerspend_link({get_dates(), skey}, acct), []},
             [],
             []
           ) do
      unless Enum.member?(headers, {'x-server', 'shib02a.rit.edu'}),
        do: {:ok, Enum.concat(prev_data, parse_csv(body, acct)), skey},
        else: {:error, :invalid_skey}
    else
      # generic, unforseen error if tigerspend.rit.edu isn't responsive
      _ -> {:error, nil}
    end
  end

  defp fetch_acct({:ok, prev_data, skey}, acct) when is_number(acct) when is_list(prev_data),
    do: fetch_acct({:ok, prev_data}, skey, acct)

  defp fetch_acct({:error, err}, _acct), do: {:error, err}
  defp fetch_acct(invalid_prev_data, _skey, _acct), do: {:error, nil}

  defp process_data({:ok, data}), do: {:ok, map_list_to_json(data)}
  defp process_data({:error, msg}), do: {:error, msg}

  def fetch(skey) do
    {:ok, [], skey}
    |> fetch_acct(@acct_tgrbkx)
    |> fetch_acct(@acct_dd_std)
    |> fetch_acct(@acct_dd_volun)
    |> fetch_acct(@acct_dd_rlovr)
    |> (fn
          {:ok, data, skey} -> {:ok, data |> sort_map_list_chrono |> map_list_to_json}
          {:error, msg} -> {:error, msg}
          _ -> raise "unexpected output from fetch pipe"
        end).()
  end
end
