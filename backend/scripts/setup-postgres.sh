#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-$(basename "$PROJECT_DIR" | tr '-' '_')}"
DB_USER="${DB_USER:-db}"
DB_PASSWORD="${DB_PASSWORD:-root}"
POSTGRES_SUPERUSER="${POSTGRES_SUPERUSER:-postgres}"
POSTGRES_SYSTEM_SERVICE="${POSTGRES_SYSTEM_SERVICE:-postgresql}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing command: $1" >&2
    exit 1
  fi
}

ensure_postgres_server() {
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; then
    return 0
  fi

  if command -v systemctl >/dev/null 2>&1; then
    echo "Starting PostgreSQL service: $POSTGRES_SYSTEM_SERVICE"
    sudo systemctl start "$POSTGRES_SYSTEM_SERVICE"
  elif command -v service >/dev/null 2>&1; then
    echo "Starting PostgreSQL service: $POSTGRES_SYSTEM_SERVICE"
    sudo service "$POSTGRES_SYSTEM_SERVICE" start
  else
    echo "PostgreSQL is not running and no supported service manager was found." >&2
    exit 1
  fi

  pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1 || {
    echo "PostgreSQL did not become ready on $DB_HOST:$DB_PORT" >&2
    exit 1
  }
}

install_postgres_if_missing() {
  if command -v psql >/dev/null 2>&1; then
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    echo "Installing PostgreSQL via apt-get"
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-client
    return 0
  fi

  echo "psql is not installed and this script only auto-installs PostgreSQL on apt-based systems." >&2
  exit 1
}

create_role_and_db() {
  sudo -u "$POSTGRES_SUPERUSER" psql postgres <<SQL
do \$\$
begin
  if not exists (select 1 from pg_roles where rolname = '${DB_USER}') then
    create role ${DB_USER} login password '${DB_PASSWORD}';
  else
    alter role ${DB_USER} with login password '${DB_PASSWORD}';
  end if;
end
\$\$;

select 'create database ${DB_NAME} owner ${DB_USER}'
where not exists (select 1 from pg_database where datname = '${DB_NAME}')
\gexec
SQL
}

init_schema() {
  PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f "$SCRIPT_DIR/init-demo-notes.sql"
}

print_env_hint() {
  cat <<EOF
PostgreSQL is ready.
Export these variables if you want explicit backend config:
  export DB_HOST=$DB_HOST
  export DB_PORT=$DB_PORT
  export DB_NAME=$DB_NAME
  export DB_USER=$DB_USER
  export DB_PASSWORD=$DB_PASSWORD
EOF
}

require_cmd basename
require_cmd tr
require_cmd pg_isready

install_postgres_if_missing
ensure_postgres_server
create_role_and_db
init_schema
print_env_hint
