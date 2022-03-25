FROM elixir:1.11
WORKDIR /app
COPY . /app

RUN mix local.hex --force \
	&& mix local.rebar --force \
	&& mix deps.get \
	&& mix format \
	&& mix release \
	&& find _build -executable -exec chmod a+x {} \;

CMD _build/dev/rel/caroline/bin/caroline start
