#!/usr/bin/env fish

_build/dev/rel/caroline/bin/caroline stop

mix deps.get
mix release

_build/dev/rel/caroline/bin/caroline daemon
