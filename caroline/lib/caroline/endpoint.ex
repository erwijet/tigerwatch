defmodule Caroline.Endpoint do
    alias Caroline.Tigerspend
    use Plug.Router

    plug Plug.Cube
    plug Plug.Cookies
    plug Plug.Cors
    plug Plug.UrlParams
    plug Plug.Logger
    plug :match
    plug :dispatch

    get "/" do
        send_resp(conn, 200, "yuh")
    end

    get "/data" do
        conn
        |> put_resp_header("location", "/data/" <> (Map.get(conn.cookies, "skey") || "nil"))
        |> send_resp(302, "")
    end

    get "/data/:skey" do
        case Tigerspend.fetch(skey) do
            {:ok, json} -> 
                conn 
                |> put_resp_content_type("application/json") 
                |> send_resp(200, json)
            {:error, :invalid_skey} -> 
                conn
                |> put_resp_content_type("application/json") 
                |> send_resp(401, "Unauthorized skey value.\nskey: " <> skey)
            {:error, _} -> send_fatal_resp(conn, "request to tigerspend.rit.edu responded with a non-:ok status")
        end
    end

    get "/auth" do
        conn
        |> put_resp_header("location", "https://tigerspend.rit.edu/login.php?wason=https://api.tigerwatch.app/callback")
        |> send_resp(302, "")
    end

    get "/callback" do
        skey = Map.get(conn.query_params, "skey")

        unless skey == nil do
            conn
            |> put_resp_cookie("skey", skey, domain: ".tigerwatch.app", http_only: false)
            |> put_resp_header("location", "https://tigerwatch.app")
            |> send_resp(302, "")
        else
            conn |> send_resp(400, "bad request")
        end
    end

    get "/dev/auth" do
        conn
        |> put_resp_header("location", "https://tigerspend.rit.edu/login.php?wason=http://localhost:8000/cb")
        |> send_resp(302, "")
    end
    
    match _ do
        send_resp(conn, 404, "not found, but i'm still alive")
    end

    defp send_fatal_resp(conn, data) do
        send_resp(conn, 500, "Yikes! Something's not right here\nSend an email to tyler@tigerwatch.app if ths issue persists.\n\n" <> to_string(data))
        IO.inspect {:blackbox_dump, conn}   # presenve connection state for future debugging
        raise "fatal response sent"
    end
end
