defmodule Caroline.Tigerspend do
    import Caroline.Tigerspend.Dates

    @acct   4  # account 4 references "Dining Dollars" on tigerspend.rit.edu

    def build_tigerspend_link({{startdate, enddate}, skey}) do
        to_charlist("http://tigerspend.rit.edu/statementdetail.php?cid=105&skey=" <> skey <> "&startdate=" <> startdate <> "&enddate=" <> enddate <> "&acct=" <> to_string(@acct) <> "&format=csv")
    end  

    def fetch(skey) do
        with {:ok, {_, headers, body}} <- :httpc.request(:get, {build_tigerspend_link({get_dates(), skey}), []}, [], []) do
            unless Enum.member?(headers, {'x-server', 'shib02a.rit.edu'}), do: {:ok, body}, else: {:error, :invalid_skey}
        else 
            _ -> {:error, nil} # generic, unforseen error if tigerspend.rit.edu isn't responsive
        end
    end
end