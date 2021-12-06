#!/bin/fish

mix deps.get
mix compile

_build/dev/rel/caroline/bin/caroline daemon
