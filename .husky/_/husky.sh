#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exit $?
fi

if [ -n "$HUSKY" ]; then
  path="$HUSKY"/husky.sh
else
  path="$(dirname "$0")/husky.sh"
fi

if [ -f "$path" ]; then
  . "$path"
fi
