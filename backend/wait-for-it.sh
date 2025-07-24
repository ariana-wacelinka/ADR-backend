#!/usr/bin/env bash
set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

usage() {
  echo "Usage: $0 host:port [-t timeout]"
  exit 1
}

# parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    *:* )
      HOST="${1%%:*}"
      PORT="${1##*:}"
      shift
      ;;
    -t)
      TIMEOUT="$2"; shift 2
      ;;
    -q)
      QUIET=1; shift
      ;;
    *)
      usage
      ;;
  esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
  usage
fi

start_ts=$(date +%s)
while :
do
  if nc -z "$HOST" "$PORT" >/dev/null 2>&1; then
    (( QUIET )) || echo "⏳ $HOST:$PORT is available"
    break
  fi
  now_ts=$(date +%s)
  if (( now_ts - start_ts >= TIMEOUT )); then
    echo "❌ Timeout after ${TIMEOUT}s waiting for $HOST:$PORT"
    exit 1
  fi
  sleep 1
done
