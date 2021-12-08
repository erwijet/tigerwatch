#!/bin/bash

mix deps.get
mix compile
mix run --no-halt
