#!/bin/sh

# there is no assertion that the script is currently running, so hide the error is the command fails
_build/dev/rel/caroline/bin/caroline stop 2> /dev/null

mix deps.get
mix release

_build/dev/rel/caroline/bin/caroline daemon
