defmodule Caroline.Tigerspend do
  import Caroline.Tigerspend.Dates

  defmacro __using__(_opts) do
    quote do
      :ssl.start()
      :inets.start()

      def tigerspend_fetch(opts) do
        :httpc.request(
          :get,
          {to_charlist(
             'https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=' <>
               skey <>
               '&startdate=' <>
               startdate <> '&enddate=' <> enddate <> '&acct=' <> @acct <> 'format=csv'
           ), []},
          [],
          []
        )
      end
    end
  end
end