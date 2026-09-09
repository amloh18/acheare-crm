#!/bin/bash
# =============================================================================
# ACHEARE CRM — local development stack stopper
# Usage:  bash scripts/acheare-down.sh [--all]
#   (default) stops the ACHEARE server + front only; PostgreSQL/Redis keep running
#   --all     also stops PostgreSQL 16 and Redis
# =============================================================================
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "== Stopping ACHEARE server/front (screen sessions) =="
for s in acheare-server acheare-front; do
  if screen -ls 2>/dev/null | grep -q "\.$s\b"; then
    screen -S "$s" -X quit && echo "   $s stopped"
  else
    echo "   $s not running"
  fi
done

if [ "${1:-}" = "--all" ]; then
  echo "== Stopping PostgreSQL 16 =="
  /opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 stop && echo "   stopped"
  echo "== Stopping Redis =="
  redis-cli shutdown nosave && echo "   stopped"
fi

echo "Done."
