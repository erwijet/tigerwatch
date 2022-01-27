defmodule Caroline.Tigerspend.AAN do
  use Bitwise

  @acct_virtual_sum -1

  def get_acct_decls,
    do: [
      {:tiger_bucks, 1},
      {:standard_dining_dollars, 4},
      {:voluntary_dining_dollars, 24},
      {:rollover_dining_dollars, 29}
    ]

  def decode_aan(@acct_virtual_sum), do: get_acct_decls()

  def decode_aan(aan) when is_number(aan) do
    get_acct_decls
    |> Enum.filter(fn {_k, v} -> (aan &&& 1 <<< v) != 0 end)
  end
end
