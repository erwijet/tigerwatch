defmodule Caroline.Endpoint do
  alias Caroline.Tigerspend
  use Plug.Router

  # ✌
  plug(Plug.Cube)
  plug(Plug.Logger)
  plug(:match)
  plug(:dispatch)

  get "/" do
    send_resp(conn, 200, "yuh")
  end

  get "/data" do
    conn
    |> put_resp_header("location", "/data/" <> (Map.get(conn.cookies, "skey") || "nil"))
    |> send_resp(302, "")
  end

  get "/dev/data" do
    conn
    |> put_resp_header(
      "location",
      "https://tigerspend.rit.edu/login.php?wason=https://tigerwatch-api.csh.rit.edu/dev/cb"
    )
    |> send_resp(302, "")
  end

  get "/dev/cb" do
    skey = Map.get(conn.query_params, "skey")

    unless skey == nil do
      conn
      |> put_resp_header("location", "https://tigerwatch-api.csh.rit.edu/data/" <> skey)
      |> send_resp(302, "")
    else
      conn |> send_resp(400, "bad request")
    end
  end

  get "/data/:skey" do
    conn
    |> put_resp_header("location", "/aan/" <> skey <> "/-1")
    |> send_resp(302, "")
  end

  get "/aan/-/:aan" do
    conn
    |> put_resp_header(
      "location",
      "/aan/" <> (Map.get(conn.cookies, "skey") || "nil") <> "/" <> aan
    )
    |> send_resp(302, "")
  end

  get "/aan/:skey/:aan" do
    # oldest date
    start_date = Map.get(conn.query_params, "o")
    # earliest date
    end_date = Map.get(conn.query_params, "e")

    IO.inspect({start_date, end_date})

    case Tigerspend.fetch(skey, {start_date, end_date}, aan) do
      {:ok, json} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, json)

      {:error, :invalid_skey} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(401, "Unauthorized skey value.\nskey: " <> skey)

      {:error, :invalid_aan} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(400, "Malformated aan number.\naan: " <> aan)

      {:error, :invalid_date} ->
        conn
        |> send_resp(
          400,
          "Malformatted date.\nDates should be of the form: YYYY-MM-DD and shoud not be a date in the future"
        )

      {:error, _} ->
        send_fatal_resp(conn, "request to tigerspend.rit.edu responded with a non-:ok status")
    end
  end

  get "/auth" do
    conn
    |> put_resp_header(
      "location",
      "https://tigerspend.rit.edu/login.php?wason=https://tigerwatch-api.csh.rit.edu/callback"
    )
    |> send_resp(302, "")
  end

  get "/dev/auth" do
    conn
    |> put_resp_header(
      "location",
      "https://tigerspend.rit.edu/login.php?wason=http://localhost:8000/cb"
    )
    |> send_resp(302, "")
  end

  get "/callback" do
    skey = Map.get(conn.query_params, "skey")

    unless skey == nil do
      conn
      |> put_resp_cookie("skey", skey, domain: ".csh.rit.edu", http_only: false)
      |> put_resp_header("location", "https://tigerwatch.csh.rit.edu")
      |> send_resp(302, "")
    else
      conn |> send_resp(400, "bad request")
    end
  end

  match _ do
    Caroline.Lyrics.get()
    |> (fn
          {:ok, lyrics} ->
            send_resp(conn, 404, "not found, but i'm still alive \n\n" <> lyrics)

          _ ->
            send_fatal_resp(
              conn,
              "It's a 404 but we have bigger fish to fry-- we couldn't read the lyrics!"
            )
        end).()
  end

  defp send_fatal_resp(conn, data) do
    send_resp(
      conn,
      500,
      "Yikes! Something's not right here\nSend an email to tyler@tigerwatch.app if ths issue persists.\n\n" <>
        to_string(data)
    )

    # presenve connection state for future debugging
    IO.inspect({:blackbox_dump, conn})
    raise "fatal response sent"
  end
end
