defmodule CarolineTest do
  use ExUnit.Case
  doctest Caroline

  test "greets the world" do
    assert Caroline.hello() == :world
  end
end
