#!/usr/bin/env bash
#
# restore.sh — Achare disaster recovery
#
# Restores a backup snapshot archive produced by backup.sh.
# Reconstructs the database, uploaded files, and secrets.
#
# Usage:
#   deploy/backup/restore.sh <archive-path>
#
# Example:
#   deploy/backup/restore.sh backups/achare-20260915T030000Z.tar.zst
#
# The script:
#   1. Extracts the archive to a temporary directory
#   2. Validates the manifest and checksums
#   3. Stops the application (db and redis stay up)
#   4. Restores secrets (.env) FIRST
#   5. Restores uploaded files
#   6. Restores the database via pg_restore
#   7. Starts the stack and runs the health check
#
# ⚠️  This is destructive: it replaces the current database and files.
#     Take a backup of the current state before restoring.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
ENV_FILE="${ACHARE_ENV_FILE:-${DEPLOY_DIR}/.env}"
COMPOSE_DIR="${DEPLOY_DIR}/compose"

# Profile selection
ACHARE_PROFILE="${ACHARE_PROFILE:-local}"
PROFILE="${ACHARE_PROFILE}"

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
# Check for decompression tools
# ---------------------------------------------------------------------------

HAS_ZSTD=0
HAS_GZIP=0
command -v zstd >/dev/null 2>&1 && HAS_ZSTD=1
command -v gzip >/dev/null 2>&1 && HAS_GZIP=1

# ---------------------------------------------------------------------------
# Main restore logic
# ---------------------------------------------------------------------------

main() {
  ARCHIVE_PATH="${1:-}"

  if [ -z "${ARCHIVE_PATH}" ]; then
    printf "Usage: %s <archive-path>\n" "$0"
    printf "\n"
    printf "Restores an Achare backup archive produced by backup.sh.\n"
    printf "\n"
    printf "Example:\n"
    printf "  deploy/backup/restore.sh backups/achare-20260915T030000Z.tar.zst\n"
    exit 1
  fi

  require_docker

  # Resolve to absolute path
  if [ ! -f "${ARCHIVE_PATH}" ]; then
    fail "archive not found: ${ARCHIVE_PATH}"
  fi
  ARCHIVE_PATH="$(cd "$(dirname "${ARCHIVE_PATH}")" && pwd)/$(basename "${ARCHIVE_PATH}")"

  printf "\n"
  printf "Achare Restore — profile %s\n" "${PROFILE}"
  printf "========================================================================\n"
  printf "Archive: %s\n" "${ARCHIVE_PATH}"
  printf "\n"
  printf "${RED}⚠️  This will REPLACE the current database and files.${NC}\n"
  printf "${RED}    Press Enter to continue, or Ctrl+C to abort.${NC}\n"
  printf "\n"
  read -r _

  # --- 1. Extract archive -----------------------------------------------------
  step "Extracting archive"

  WORK_DIR="$(mktemp -d)"
  trap "rm -rf '${WORK_DIR}'" EXIT

  FILENAME="$(basename "${ARCHIVE_PATH}")"

  if [[ "${FILENAME}" == *.tar.zst ]] && [ "${HAS_ZSTD}" -eq 1 ]; then
    zstd -d "${ARCHIVE_PATH}" --stdout | tar xf - -C "${WORK_DIR}"
  elif [[ "${FILENAME}" == *.tar.gz ]] || [[ "${FILENAME}" == *.tgz ]]; then
    tar xzf "${ARCHIVE_PATH}" -C "${WORK_DIR}"
  elif [[ "${FILENAME}" == *.tar ]]; then
    tar xf "${ARCHIVE_PATH}" -C "${WORK_DIR}"
  else
    fail "unrecognised archive format: ${FILENAME}"
  fi

  # Find the snapshot directory (achare-<timestamp>)
  SNAPSHOT_DIR="$(find "${WORK_DIR}" -maxdepth 1 -type d -name 'achare-*' | head -1)"
  if [ -z "${SNAPSHOT_DIR}" ]; then
    fail "no achare-* snapshot directory found in archive"
  fi

  ok "extracted to ${SNAPSHOT_DIR}"

  # --- 2. Validate manifest ---------------------------------------------------
  step "Validating manifest"

  if [ ! -f "${SNAPSHOT_DIR}/manifest.json" ]; then
    fail "manifest.json not found in snapshot"
  fi

  MANIFEST_VERSION="$(cat "${SNAPSHOT_DIR}/manifest.json" | grep -o '"version": *"[^"]*"' | head -1 | sed 's/.*"version": *"//;s/".*//')"
  MANIFEST_CREATED="$(cat "${SNAPSHOT_DIR}/manifest.json" | grep -o '"createdAt": *"[^"]*"' | head -1 | sed 's/.*"createdAt": *"//;s/".*//')"

  printf "  Version:    %s\n" "${MANIFEST_VERSION:-unknown}"
  printf "  Created at: %s\n" "${MANIFEST_CREATED:-unknown}"

  # Verify checksums
  for component in database.dump .env storage.tar.gz; do
    if [ -f "${SNAPSHOT_DIR}/${component}" ]; then
      EXPECTED="$(cat "${SNAPSHOT_DIR}/manifest.json" | grep -o "\"${component}\": *\"[^\"]*\"" | sed "s/.*\"${component}\": *\"//;s/\".*//" || true)"
      ACTUAL="$(sha256sum "${SNAPSHOT_DIR}/${component}" | cut -d' ' -f1)"
      if [ -n "${EXPECTED}" ] && [ "${EXPECTED}" = "${ACTUAL}" ]; then
        ok "${component} checksum valid"
      elif [ -n "${EXPECTED}" ]; then
        warn "${component} checksum mismatch (expected ${EXPECTED}, got ${ACTUAL})"
      fi
    fi
  done

  # --- 3. Stop application (db and redis stay up) -----------------------------
  step "Stopping application containers"

  compose stop server worker 2>/dev/null || true
  ok "application stopped"

  # --- 4. Restore secrets FIRST -----------------------------------------------
  step "Restoring secrets (.env)"

  if [ -f "${SNAPSHOT_DIR}/.env" ]; then
    cp "${SNAPSHOT_DIR}/.env" "${ENV_FILE}"
    chmod 600 "${ENV_FILE}"
    ok ".env restored — ENCRYPTION_KEY is now from the backup"
  else
    warn ".env not found in backup; keeping current secrets"
  fi

  # --- 5. Restore storage files ------------------------------------------------
  step "Restoring uploaded files"

  if [ -f "${SNAPSHOT_DIR}/storage.tar.gz" ]; then
    # Determine storage target
    STORAGE_VOLUME="achare_achare-storage"
    if docker volume inspect "${STORAGE_VOLUME}" >/dev/null 2>&1; then
      docker run --rm \
        -v "${STORAGE_VOLUME}:/data" \
        -v "${SNAPSHOT_DIR}:/backup:ro" \
        alpine sh -c 'rm -rf /data/* && tar xzf /backup/storage.tar.gz -C /data'
      ok "storage restored to volume ${STORAGE_VOLUME}"
    else
      STORAGE_PATH="${ACHARE_STORAGE_PATH:-${DEPLOY_DIR}/.data/storage}"
      mkdir -p "${STORAGE_PATH}"
      rm -rf "${STORAGE_PATH}"/*
      tar xzf "${SNAPSHOT_DIR}/storage.tar.gz" -C "${STORAGE_PATH}"
      ok "storage restored to ${STORAGE_PATH}"
    fi
  else
    warn "no storage archive found; skipping file restore"
  fi

  # --- 6. Restore database -----------------------------------------------------
  step "Restoring database"

  if [ -f "${SNAPSHOT_DIR}/database.dump" ]; then
    # Extract PG credentials from the restored .env
    PG_USER="$(grep '^PG_DATABASE_USER=' "${ENV_FILE}" | head -1 | cut -d= -f2 || echo 'achare')"
    PG_DB="$(grep '^PG_DATABASE_NAME=' "${ENV_FILE}" | head -1 | cut -d= -f2 || echo 'default')"

    # Check if db container is running
    DB_RUNNING="$(compose ps --services --status running 2>/dev/null | grep -c '^db$' || true)"
    if [ "${DB_RUNNING}" -eq 0 ]; then
      warn "database container is not running; starting stack first..."
      compose up -d db redis
      sleep 5
    fi

    printf "  Running pg_restore (--clean --if-exists --no-owner)...\n"

    # Use -T: without it, docker compose exec allocates a TTY and mangles binary streams.
    compose exec -T db pg_restore \
      -U "${PG_USER}" \
      -d "${PG_DB}" \
      --clean \
      --if-exists \
      --no-owner \
      < "${SNAPSHOT_DIR}/database.dump" 2>&1 | tail -5 || true

    ok "database restored"
  else
    fail "database.dump not found in backup"
  fi

  # --- 7. Start and verify -----------------------------------------------------
  step "Starting stack and verifying health"

  compose up -d
  printf "  Waiting for healthy state...\n"

  HEALTHY=0
  for i in $(seq 1 60); do
    RAW="$(compose exec -T server curl -sS -w '\n%{http_code}' "http://localhost:3000/readyz" 2>/dev/null || true)"
    HTTP_CODE="$(printf '%s' "${RAW}" | tail -n1)"
    if [ "${HTTP_CODE}" = "200" ]; then
      HEALTHY=1
      break
    fi
    sleep 3
  done

  if [ "${HEALTHY}" -eq 1 ]; then
    ok "server is healthy (/readyz → 200)"
  else
    warn "server not yet healthy after 3 minutes — check: achare logs server"
  fi

  # --- 8. Summary --------------------------------------------------------------
  printf "\n"
  printf "========================================================================\n"
  printf "Restore complete.\n"
  printf "\n"
  printf "  Version:     %s\n" "${MANIFEST_VERSION:-unknown}"
  printf "  Backed up:   %s\n" "${MANIFEST_CREATED:-unknown}"
  printf "  Profile:     %s\n" "${PROFILE}"
  printf "\n"
  printf "Verify the following:\n"
  printf "  1. Log in to the application\n"
  printf "  2. Check a record you know\n"
  printf "  3. Open a document you know\n"
  printf "  4. Check an encrypted field (salary or bank account)\n"
  printf "     - If it renders correctly, ENCRYPTION_KEY is right\n"
  printf "     - If blank or error, STOP and find the correct key\n"
  printf "\n"
  printf "Run: deploy/scripts/achare doctor\n"
}

main "$@"
