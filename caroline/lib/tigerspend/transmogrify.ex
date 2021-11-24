# trans * mog * ri * fy
## verb
## to transform in a surprising or magical manner.

defmodule Caroline.Tigerspend.Transmogrify do
    defp load_config do
        "./config/locations.json"
        |> File.read!()
        |> Poison.decode!()
    end
end