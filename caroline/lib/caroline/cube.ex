defmodule Plug.Cube do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts), do: put_resp_header(conn, "x-powered-by", "your companion cube <3")
end

defmodule Plug.Cookies do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts), do: fetch_cookies(conn)
end

defmodule Plug.UrlParams do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts), do: fetch_query_params(conn)
end

defmodule Plug.Cors do
    import Plug.Conn

    def init([]), do: false
    def call(conn, _opts), do: put_resp_header(conn, "access-control-allow-origin", "*")
end
