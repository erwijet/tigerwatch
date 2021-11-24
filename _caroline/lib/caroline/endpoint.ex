defmodule Caroline.Endpoint do
  use Plug.Router

  # display incoming requests
  plug Plug.Logger
  # dispatch responses
  plug :dispatch
  # match routes
  plug :match

  get "/" do
    send_resp(conn, 200, "hello, world")
  end

  get "/data" do
    skey = conn.req_cookies["skey"] || "nil"

    conn
    |> put_resp_header("location", "/data/#{skey}")
    |> resp(302, "")
    |> send_resp
  end

  match _ do
    send_resp(conn, 404, "not found")
  end
end
