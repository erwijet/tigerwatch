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

  defp fetch_acct({:ok, prev_data, skey}, acct) when is_number(acct) when is_list(prev_data) do
    fetch_acct({:ok, prev_data}, skey, acct)
  end

  defp fetch_acct({:error, err}, _acct), do: {:error, err}
  defp fetch_acct(_invalid_prev_data, _skey, _acct), do: {:error, nil}

  defp process_data(data) do
    with {:ok, transactions, _skey} <- data do
      {:ok, transactions |> sort_map_list_chrono |> map_list_to_json}
    else
      {:error, msg} -> {:error, msg}
      # I cannot forsee a way this could be matched
      _ -> raise "invalid output from fetch pipe"
    end
  end

  def fetch(skey) do
    {:ok, [], skey}
    |> fetch_acct(@acct_tgrbkx)
    |> fetch_acct(@acct_dd_std)
    |> fetch_acct(@acct_dd_volun)
    |> fetch_acct(@acct_dd_rlovr)
    |> process_data
  end
end
