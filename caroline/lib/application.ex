defmodule Caroline.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {
        Plug.Cowboy, 
        scheme: :https, 
        port: 443,
        plug: Caroline.Endpoint, 
        options: [
          otp_app: :caroline,
          certfile: "priv/certs/fullchain.pem", 
          keyfile: "priv/certs/privkey.pem", 
        ]
      }
    ]

    opts = [strategy: :one_for_one, name: Caroline.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
