#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

REGISTRY="${NPM_REGISTRY:-}"
FETCH_RETRIES="${NPM_FETCH_RETRIES:-5}"
FETCH_RETRY_MINTIMEOUT="${NPM_FETCH_RETRY_MINTIMEOUT:-20000}"
FETCH_RETRY_MAXTIMEOUT="${NPM_FETCH_RETRY_MAXTIMEOUT:-120000}"

if [[ -n "$REGISTRY" ]]; then
  echo "Using npm registry: $REGISTRY"
fi

rm -rf node_modules

NPM_ARGS=(
  --prefer-offline
  --no-audit
  --fund=false
  --fetch-retries "$FETCH_RETRIES"
  --fetch-retry-mintimeout "$FETCH_RETRY_MINTIMEOUT"
  --fetch-retry-maxtimeout "$FETCH_RETRY_MAXTIMEOUT"
)

if [[ -n "$REGISTRY" ]]; then
  NPM_ARGS+=(--registry "$REGISTRY")
fi

npm ci "${NPM_ARGS[@]}"

echo "Frontend dependencies installed."
