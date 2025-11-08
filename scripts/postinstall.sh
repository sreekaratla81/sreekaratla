#!/bin/sh

set -e

if command -v husky >/dev/null 2>&1; then
  pnpm husky install 2>/dev/null || npx --yes husky install 2>/dev/null || true
fi
