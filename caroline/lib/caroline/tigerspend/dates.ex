defmodule Caroline.Tigerspend.Dates do
    @selection_size_months  6 # number of months of history to fetch from tigerspend.rit.edu 

    # tigerspend.rit.edu expects dates in the form of "yyyy-mm-dd"
    defp format_date(date) do
        [date.year, date.month, date.day]
        |> Enum.map(&(to_string/1))
        |> Enum.map(&String.pad_leading(&1, 2, "0"))
        |> Enum.join("-")
    end

    defp get_end_date do
        DateTime.utc_now
        |> format_date
    end

    defp get_start_date do 
        DateTime.utc_now
        |> Date.add(-1 * 30 * @selection_size_months)
        |> format_date
    end
    
    def get_dates, do: { get_start_date(), get_end_date() }
end
