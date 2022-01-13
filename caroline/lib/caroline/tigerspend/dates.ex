defmodule Caroline.Tigerspend.Dates do
  # number of months of history to fetch from tigerspend.rit.edu 
  @selection_size_months 6

  # tigerspend.rit.edu expects dates in the form of "yyyy-mm-dd"
  defp format_date(date) do
    [date.year, date.month, date.day]
    |> Enum.map(&to_string/1)
    |> Enum.map(&String.pad_leading(&1, 2, "0"))
    |> Enum.join("-")
  end

  defp get_end_date do
    DateTime.utc_now()
    |> format_date
  end

  defp get_start_date do
    DateTime.utc_now()
    |> Date.add(-1 * 30 * @selection_size_months)
    |> format_date
  end

  def get_dates, do: {get_start_date(), get_end_date()}

  # build a DateTime struct from a string in the format of "MM/DD/YYYY hh:mmXX"
  def parse_date(datetime_str) do
    [date_str, time_str] = datetime_str |> String.split(" ")

    [month, day, year] =
      date_str
      |> String.split("/")
      |> Enum.map(&Integer.parse/1)
      |> Enum.map(fn {num, _remainder} -> num end)

    [hour, min, meridiem] =
      time_str
      |> String.codepoints()
      |> Enum.filter(&(&1 != ":"))
      |> Enum.chunk_every(2)
      |> Enum.map(&Enum.join/1)

    %DateTime{
      year: year,
      month: month,
      day: day,
      zone_abbr: "EST",
      # hour "12:XXPM" is still only hour 12 in 24hr form
      hour:
        (hour |> Integer.parse() |> elem(0)) + if(meridiem == "PM", do: 12, else: 0) +
          if(hour == "12", do: -12, else: 0),
      minute: min |> Integer.parse() |> elem(0),
      second: 0,
      microsecond: {0, 0},
      utc_offset: -18000,
      std_offset: 0,
      time_zone: "Eastern"
    }
  end
end
