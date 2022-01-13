defmodule Plug.Cube do
  import Plug.Conn

  def init([]), do: false

  def call(conn, _opts) do
    conn
    |> put_resp_header("x-powered-by", "your companion cube <3")
    |> put_resp_header("access-control-allow-origin", "*")
    |> fetch_cookies
    |> fetch_query_params
  end
end
