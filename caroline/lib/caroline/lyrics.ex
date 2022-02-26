defmodule Caroline.Lyrics do
  def get do
    File.read("priv/config/lyrics.txt")
  end
end
