defmodule Caroline.Tigerspend do
  alias Caroline.Tigerspend.Dates

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
    with {:ok, transactions, _target_dates, _skey} <- data do
      {:ok, transactions |> sort_map_list_chrono |> map_list_to_json}
    else
      {:error, msg} -> {:error, msg}
      # I cannot forsee a way this could be matched
      _ -> raise "invalid output from fetch pipe: " <> IO.inspect data
    end
  end

  @doc """

  if we encounter an error we would return the :halt atom to tell the reducer to stop reducing, 
  as well as the :error atom to indicate that the reason the reducer stopped was because of an error.

  We do this for readability, as well as the fact that the :cont/:halt atoms are not part of the returned
  reduced data, so if we halt halfway through we still need to specify a status for the result of the request,
  not just a resulting value

  """

  defp fetch_reducer(acct, {:ok, prev_data, target_dates, skey}) do

    with {:ok, {_, headers, body}} <-
           :httpc.request(
             :get,
             {build_tigerspend_link({target_dates, skey}, acct), []},
             [],
             []
           ) do
      unless Enum.member?(headers, {'x-server', 'shib02a.rit.edu'}),
        do: {:cont, {:ok, Enum.concat(prev_data, parse_csv(body, acct)), target_dates, skey}},
        else: {:halt, {:error, :invalid_skey}}
    else
      # generic, unforseen error if tigerspend.rit.edu isn't responsive
      _ -> {:halt, {:error, nil}}
    end
  end

  def fetch(skey, aan), do: fetch(skey, { nil, nil }, aan)

  def fetch(skey, target_dates, aan) when is_binary(aan) do
    with {:error} <- Integer.parse(aan) do
      {:error, :invalid_aan}
    else
      {parsed_aan, _} -> fetch(skey, target_dates, parsed_aan)
    end
  end

  def fetch(skey, { nil, nil }, aan) when is_number(aan), do: fetch(skey, get_dates(), aan)

  def fetch(skey, { nil, end_date }, aan) when is_number(aan) when is_binary(end_date) do
    { start_date, _ } = get_dates() 
    fetch(skey, { start_date, end_date }, aan)
  end

  def fetch(skey, { start_date, nil }, aan) when is_number(aan) when is_binary(start_date) do
    { _, end_date } = get_dates()
    fetch(skey, { start_date, end_date }, aan)
  end

  def fetch(skey, target_dates, aan) when is_number(aan) do
    IO.inspect target_dates
    # validate dates--
    # we do this before the reducer because dates only need to be verified once, not for each account
    unless (target_dates |> Tuple.to_list |> Enum.map(&Dates.validate(&1)) |> Enum.filter(& &1) |> Enum.count) != 2 do
      aan
      |> decode_aan
      |> Enum.map(fn {_k, v} -> v end)
      |> Enum.reduce_while({:ok, [], target_dates, skey}, &fetch_reducer(&1, &2))
      |> process_data
    else
      {:error, :invalid_date}
    end
  end
end
