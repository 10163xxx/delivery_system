#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

SETUP_FRONTEND="${SETUP_FRONTEND:-1}"
SETUP_DATABASE="${SETUP_DATABASE:-1}"

run_frontend_setup() {
  echo "[setup-dev] Installing frontend dependencies"
  "$FRONTEND_DIR/scripts/setup-frontend.sh"
}

run_database_setup() {
  echo "[setup-dev] Initializing PostgreSQL for backend"
  "$BACKEND_DIR/scripts/setup-postgres.sh"
}

print_next_steps() {
  cat <<EOF
[setup-dev] Setup finished.

Recommended next commands:
  cd "$FRONTEND_DIR" && npm run dev
  cd "$BACKEND_DIR" && ./sbtw run

Optional environment overrides:
  NPM_REGISTRY=https://registry.npmmirror.com
  DB_HOST=127.0.0.1
  DB_PORT=5432
  DB_NAME=$(basename "$BACKEND_DIR" | tr '-' '_')
  DB_USER=db
  DB_PASSWORD=root
EOF
}

if [[ "$SETUP_FRONTEND" == "1" ]]; then
  run_frontend_setup
fi

if [[ "$SETUP_DATABASE" == "1" ]]; then
  run_database_setup
fi

print_next_steps
