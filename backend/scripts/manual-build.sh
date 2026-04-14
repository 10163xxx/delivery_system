#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLASSES_DIR="$PROJECT_DIR/manual-classes"
COURSIER_ROOT="${COURSIER_ROOT:-/home/shi81xu77/.cache/coursier/v1/https/repo1.maven.org/maven2}"

if [[ ! -d "$COURSIER_ROOT" ]]; then
  echo "Missing coursier cache: $COURSIER_ROOT" >&2
  exit 1
fi

CLASSPATH="$(
  find "$COURSIER_ROOT" -type f -name '*.jar' \
    | rg -v '_2\.12-|/scala-library/2\.12|/scala-compiler/2\.12|/scala-reflect/2\.12|/org/scala-sbt/|/io/get-coursier/' \
    | paste -sd: -
)"

mkdir -p "$CLASSES_DIR"
find "$CLASSES_DIR" -type f -name '*.class' -delete

java -cp "$CLASSPATH" dotty.tools.dotc.Main \
  -classpath "$CLASSPATH" \
  -d "$CLASSES_DIR" \
  $(find "$PROJECT_DIR/src/main/scala" -type f -name '*.scala' | sort)
