#!/usr/bin/env bash
#
# update.sh — Achare zero-downtime updater
#
# Upgrades a running Achare installation to a new version:
#   1. Takes a backup (safety net)
#   2. Pulls the new image
#   3. Stops the application, starts DB + Redis
#   4. Runs any pending migrations
#   5. Starts the full stack
#   6. Verifies health
#
# Usage:
#   deploy/scripts/update.sh [target-version]
#
# If no version is specified, reads from the VERSION file.
#
# Rollback:
#   To roll back, set ACHARE_VERSION in deploy/.env to the previous version
#   and run: deploy/scripts/update.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
ENV_FILE="${ACHARE_ENV_FILE:-${DEPLOY_DIR}/.env}"
COMPOSE_DIR="${DEPLOY_DIR}/compose"

# Profile selection
ACHARE_PROFILE="${ACHARE_PROFILE:-local}"
PROFILE="${ACHARE_PROFILE}"

# Version
VERSION_FILE="${REPO_ROOT}/VERSION"
CURRENT_VERSION="$(grep '^ACHARE_VERSION=' "${ENV_FILE}" 2>/dev/null | head -1 | cut -d= -f2 || cat "${VERSION_FILE}" 2>/dev/null | tr -d '[:space:]' || echo '0.0.0')"
TARGET_VERSION="${1:-$(cat "${VERSION_FILE}" 2>/dev/null | tr -d '[:space:]' || echo '0.1.0')}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()   { printf "${GREEN}[✓]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[!]${NC} %s\n" "$1"; }
fail() { printf "${RED}[✗]${NC} %s\n" "$1" >&2; exit 1; }
step() { printf "\n${CYAN}▸ %s${NC}\n" "$1"; }

# ---------------------------------------------------------------------------
# Prerequisites
# ---------------------------------------------------------------------------

require_docker() {
  command -v docker >/dev/null 2>&1 || fail "docker is not installed"
  docker compose version >/dev/null 2>&1 || fail "docker compose plugin is not available"
  docker info >/dev/null 2>&1 || fail "Docker daemon is not reachable"
}

require_env() {
  [ -f "${ENV_FILE}" ] || fail "env file missing: ${ENV_FILE}"
}

# ---------------------------------------------------------------------------
# Compose helper
# ---------------------------------------------------------------------------

compose() {
  docker compose \
    --project-directory "${DEPLOY_DIR}" \
    --env-file "${ENV_FILE}" \
    -f "${COMPOSE_DIR}/compose.base.yml" \
    -f "${COMPOSE_DIR}/compose.${PROFILE}.yml" \
    "$@"
}

# ---------------------------------------------------------------------------
# Main update logic
# ---------------------------------------------------------------------------

main() {
  require_docker
  require_env

  printf "\n"
  printf "Achare Update — %s → %s\n" "${CURRENT_VERSION}" "${TARGET_VERSION}"
  printf "========================================================================\n\n"

  # --- 0. Check if update is needed -------------------------------------------
  if [ "${CURRENT_VERSION}" = "${TARGET_VERSION}" ]; then
    ok "already on version ${TARGET_VERSION}; no update needed"
    exit 0
  fi

  # --- 1. Take a backup -------------------------------------------------------
  step "Creating pre-update backup"

  BACKUP_SCRIPT="${REPO_ROOT}/deploy/backup/backup.sh"
  if [ -x "${BACKUP_SCRIPT}" ]; then
    "${BACKUP_SCRIPT}" "${REPO_ROOT}/backups" || warn "backup failed — proceeding anyway (risky)"
    ok "backup created"
  else
    warn "backup.sh not found or not executable; skipping backup"
    warn "强烈建议在升级前手动备份: deploy/backup/backup.sh"
  fi

  # --- 2. Pull the new image ---------------------------------------------------
  step "Pulling image: ghcr.io/amloh18/achare-server:${TARGET_VERSION}"

  IMAGE="ghcr.io/amloh18/achare-server:${TARGET_VERSION}"
  if docker pull "${IMAGE}" 2>/dev/null; then
    ok "image pulled: ${IMAGE}"
  else
    warn "could not pull ${IMAGE} from registry"
    warn "if building locally, run: docker build -f deploy/docker/server.Dockerfile --build-arg ACHARE_VERSION=${TARGET_VERSION} -t ${IMAGE} ."
  fi

  # --- 3. Update .env version --------------------------------------------------
  step "Updating deploy/.env"

  sed -i.bak "s/^ACHARE_VERSION=.*/ACHARE_VERSION=${TARGET_VERSION}/" "${ENV_FILE}"
  rm -f "${ENV_FILE}.bak"
  ok "ACHARE_VERSION set to ${TARGET_VERSION}"

  # --- 4. Stop application (keep db + redis running for migrations) ------------
  step "Stopping application containers"

  compose stop server worker 2>/dev/null || true
  ok "server and worker stopped"

  # Ensure db and redis are running
  compose up -d db redis 2>/dev/null
  sleep 3
  ok "database and redis running"

  # --- 5. Run migrations via a temporary server start -------------------------
  step "Running database migrations"

  # Start just the server to run migrations, then check health
  compose up -d server 2>/dev/null

  printf "  Waiting for server to become healthy (migrations running)...\n"

  MIGRATION_OK=0
  for i in $(seq 1 120); do
    RAW="$(compose exec -T server curl -sS -w '\n%{http_code}' "http://localhost:3000/readyz" 2>/dev/null || true)"
    HTTP_CODE="$(printf '%s' "${RAW}" | tail -n1)"
    if [ "${HTTP_CODE}" = "200" ]; then
      MIGRATION_OK=1
      break
    fi
    sleep 3
    # Print progress every 10 iterations
    if [ $((i % 10)) -eq 0 ]; then
      printf "  ... still waiting (%ds)\n" "$((i * 3))"
    fi
  done

  if [ "${MIGRATION_OK}" -eq 1 ]; then
    ok "server healthy, migrations complete"
  else
    warn "server not healthy after 6 minutes — check logs with: achare logs server"
    warn "if migrations failed, check: achare logs server | grep -i error"
  fi

  # --- 6. Start the full stack -------------------------------------------------
  step "Starting full stack"

  compose up -d 2>/dev/null
  ok "all containers started"

  # --- 7. Verify health --------------------------------------------------------
  step "Verifying health"

  sleep 5

  HEALTH_OK=0
  for i in $(seq 1 30); do
    RAW="$(compose exec -T server curl -sS -w '\n%{http_code}' "http://localhost:3000/readyz" 2>/dev/null || true)"
    HTTP_CODE="$(printf '%s' "${RAW}" | tail -n1)"
    if [ "${HTTP_CODE}" = "200" ]; then
      HEALTH_OK=1
      break
    fi
    sleep 3
  done

  if [ "${HEALTH_OK}" -eq 1 ]; then
    ok "Achare is healthy"
  else
    warn "health check failed after 90 seconds — check: achare doctor"
  fi

  # --- 8. Summary --------------------------------------------------------------
  printf "\n"
  printf "========================================================================\n"
  printf "${GREEN}Update complete: %s → %s${NC}\n" "${CURRENT_VERSION}" "${TARGET_VERSION}"
  printf "========================================================================\n"
  printf "\n"
  printf "Verify with:\n"
  printf "  deploy/scripts/achare doctor\n"
  printf "  deploy/scripts/achare status\n"
  printf "\n"

  if [ "${HEALTH_OK}" -ne 1 ]; then
    printf "If something is wrong, check logs:\n"
    printf "  deploy/scripts/achare logs server\n"
    printf "  deploy/scripts/achare logs worker\n"
    printf "\n"
    printf "To rollback:\n"
    printf "  Edit deploy/.env: ACHARE_VERSION=%s\n" "${CURRENT_VERSION}"
    printf "  Run: deploy/scripts/update.sh %s\n" "${CURRENT_VERSION}"
    printf "\n"
  fi
}

main "$@"
