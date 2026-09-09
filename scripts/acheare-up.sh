#!/bin/bash
# =============================================================================
# ACHEARE CRM — local development stack starter
# Starts: PostgreSQL 16, Redis, ACHEARE server (port 3000), ACHEARE front (port 3001)
# Usage:  bash scripts/acheare-up.sh
# Stop:   bash scripts/acheare-down.sh
# Logs:   .acheare-dev-logs/server.log, .acheare-dev-logs/front.log
# =============================================================================
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS="$ROOT/.acheare-dev-logs"
mkdir -p "$LOGS"

PG_BIN="/opt/homebrew/opt/postgresql@16/bin"
PG_DATA="/opt/homebrew/var/postgresql@16"
PG_LOG="/tmp/acheare-pg16.log"

echo "== [1/4] PostgreSQL 16 =="
if "$PG_BIN/pg_isready" -q; then
  echo "   already running: $("$PG_BIN/pg_isready")"
else
  LC_ALL="en_US.UTF-8" LANG="en_US.UTF-8" "$PG_BIN/pg_ctl" -D "$PG_DATA" -l "$PG_LOG" start
  for i in $(seq 1 20); do "$PG_BIN/pg_isready" -q && break; sleep 1; done
  "$PG_BIN/pg_isready"
fi

echo "== [2/4] Redis =="
if redis-cli ping 2>/dev/null | grep -q PONG; then
  echo "   already running"
else
  redis-server --daemonize yes
  sleep 1
  redis-cli ping
fi

echo "== [3/4] ACHEARE server (screen: acheare-server, port 3000) =="
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "   already listening on 3000"
else
  screen -dmS acheare-server /bin/bash "$ROOT/scripts/acheare-local-server.sh"
  echo "   started"
fi

echo "== [4/4] ACHEARE front (screen: acheare-front, port 3001) =="
if lsof -nP -iTCP:3001 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "   already listening on 3001"
else
  screen -dmS acheare-front /bin/bash "$ROOT/scripts/acheare-local-front.sh"
  echo "   started"
fi

echo "== Waiting for services =="
for i in $(seq 1 60); do
  SRV=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/healthz 2>/dev/null)
  FRONT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null)
  if [ "$SRV" = "200" ] && [ "$FRONT" = "200" ]; then break; fi
  sleep 2
done
echo "   server /healthz : $SRV"
echo "   front /         : $FRONT"
echo ""
echo "ACHEARE CRM:"
echo "  UI   -> http://localhost:3001"
echo "  API  -> http://localhost:3000"
echo "  logs -> $LOGS/server.log, $LOGS/front.log"
echo "  sessions: $(screen -ls 2>/dev/null | grep -c acheare) screen(s) active"
