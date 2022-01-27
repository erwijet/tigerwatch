defmodule Caroline.Tigerspend do
  import Caroline.Tigerspend.Dates
  import Caroline.Tigerspend.Parsing
  import Caroline.Tigerspend.AAN

  defp build_tigerspend_link({{startdate, enddate}, skey}, acct) do
    to_charlist(
      "http://tigerspend.rit.edu/statementdetail.php?cid=105&skey=" <>
        skey <>
        "&startdate=" <>
        startdate <> "&enddate=" <> enddate <> "&acct=" <> to_string(acct) <> "&format=csv"
    )
  end

  defp process_data(data) do
    with {:ok, transactions, _skey} <- data do
      {:ok, transactions |> sort_map_list_chrono |> map_list_to_json}
    else
      {:error, msg} -> {:error, msg}
      # I cannot forsee a way this could be matched
      _ -> raise "invalid output from fetch pipe"
    end
  end

  @doc """

  if we encounter an error we would return the :halt atom to tell the reducer to stop reducing, 
  as well as the :error atom to indicate that the reason the reducer stopped was because of an error.

  We do this for readability, as well as the fact that the :cont/:halt atoms are not part of the returned
  reduced data, so if we halt halfway through we still need to specify a status for the result of the request,
  not just a resulting value

  """

  defp fetch_reducer(acct, {:ok, prev_data, skey}) do
    with {:ok, {_, headers, body}} <-
           :httpc.request(
             :get,
             {build_tigerspend_link({get_dates(), skey}, acct), []},
             [],
             []
           ) do
      unless Enum.member?(headers, {'x-server', 'shib02a.rit.edu'}),
        do: {:cont, {:ok, Enum.concat(prev_data, parse_csv(body, acct)), skey}},
        else: {:halt, {:error, :invalid_skey}}
    else
      # generic, unforseen error if tigerspend.rit.edu isn't responsive
      _ -> {:halt, {:error, nil}}
    end
  end

  def fetch(skey, aan) when is_binary(aan) do
    with {:error} <- Integer.parse(aan) do
      {:error, :invalid_aan}
    else
      {parsed_aan, _} -> fetch(skey, parsed_aan)
    end
  end

  def fetch(skey, aan) when is_number(aan) do
    aan
    |> decode_aan
    |> Enum.map(fn {_k, v} -> v end)
    |> Enum.reduce_while({:ok, [], skey}, &fetch_reducer(&1, &2))
    |> process_data
  end
end
