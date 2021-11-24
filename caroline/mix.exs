defmodule Caroline.MixProject do
  use Mix.Project

  def project do
    [
      app: :caroline,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:inets, :logger, :plug_cowboy],
      mod: {Caroline.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:poison, "~> 5.0"}
    ]
  end
end
