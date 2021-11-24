defmodule Plug.Cube do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts), do: put_resp_header(conn, "x-powered-by", "your companion cube <3")
end

defmodule Plug.Cookies do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts) do
        conn = fetch_cookies(conn)
    end
end