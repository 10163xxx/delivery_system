#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLASSES_DIR="$PROJECT_DIR/manual-classes"
COURSIER_ROOT="${COURSIER_ROOT:-/home/shi81xu77/.cache/coursier/v1/https/repo1.maven.org/maven2}"

if [[ ! -d "$CLASSES_DIR" ]]; then
  echo "Missing compiled classes in $CLASSES_DIR" >&2
  echo "Run scripts/manual-build.sh first." >&2
  exit 1
fi

CLASSPATH="$(
  find "$COURSIER_ROOT" -type f -name '*.jar' \
    | rg -v '_2\.12-|/scala-library/2\.12|/scala-compiler/2\.12|/scala-reflect/2\.12|/org/scala-sbt/|/io/get-coursier/' \
    | paste -sd: -
)"

exec java -cp "$CLASSES_DIR:$CLASSPATH" Main
