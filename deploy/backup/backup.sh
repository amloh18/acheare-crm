#!/usr/bin/env bash
#
# backup.sh — Achare atomic backup engine
#
# Generates a timestamped snapshot archive containing:
#   - database.dump      (pg_dump custom format)
#   - storage.tar.zst    (uploaded documents, attachments)
#   - .env               (secrets — ENCRYPTION_KEY, APP_SECRET, DB password)
#   - manifest.json      (version, schema, timestamp, checksums)
#
# Usage:
#   deploy/backup/backup.sh [backup_dir]
#
# The default backup directory is ./backups relative to the repository root.
# The archive is written as a single .tar.zst file.
#
# Requirements: docker, pg_dump (inside the db container), zstd (optional, falls back to gzip)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
ENV_FILE="${ACHARE_ENV_FILE:-${DEPLOY_DIR}/.env}"
COMPOSE_DIR="${DEPLOY_DIR}/compose"

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Profile selection
ACHARE_PROFILE="${ACHARE_PROFILE:-local}"
PROFILE="${ACHARE_PROFILE}"

# Version
VERSION_FILE="${REPO_ROOT}/VERSION"
ACHARE_VERSION="$(cat "${VERSION_FILE}" 2>/dev/null | tr -d '[:space:]' || echo '0.0.0')"

# Backup destination
BACKUP_DIR="${1:-${REPO_ROOT}/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
SNAPSHOT_DIR="achare-${STAMP}"
DEST="${BACKUP_DIR}/${SNAPSHOT_DIR}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { printf "${GREEN}[✓]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[!]${NC} %s\n" "$1"; }
fail() { printf "${RED}[✗]${NC} %s\n" "$1" >&2; exit 1; }

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
# Check if compression is available
# ---------------------------------------------------------------------------

HAS_ZSTD=0
if command -v zstd >/dev/null 2>&1; then
  HAS_ZSTD=1
fi

# ---------------------------------------------------------------------------
# Main backup logic
# ---------------------------------------------------------------------------

main() {
  require_docker
  require_env

  printf "\n"
  printf "Achare Backup — version %s, profile %s\n" "${ACHARE_VERSION}" "${PROFILE}"
  printf "------------------------------------------------------------------------\n\n"

  mkdir -p "${DEST}"

  # --- 1. Database dump -------------------------------------------------------
  printf "  Dumping database...\n"

  # Check if db container is running
  DB_RUNNING="$(compose ps --services --status running 2>/dev/null | grep -c '^db$' || true)"
  if [ "${DB_RUNNING}" -eq 0 ]; then
    fail "database container is not running. Start the stack first: achare start"
  fi

  # Extract PG_DATABASE_USER and PG_DATABASE_NAME from .env
  PG_USER="$(grep '^PG_DATABASE_USER=' "${ENV_FILE}" | head -1 | cut -d= -f2 || echo 'achare')"
  PG_DB="$(grep '^PG_DATABASE_NAME=' "${ENV_FILE}" | head -1 | cut -d= -f2 || echo 'default')"

  compose exec -T db pg_dump \
    -U "${PG_USER}" \
    -d "${PG_DB}" \
    --format=custom \
    > "${DEST}/database.dump"

  DB_SIZE="$(wc -c < "${DEST}/database.dump" | tr -d ' ')"
  ok "database dump: $(numfmt --to=iec-i --suffix=B "${DB_SIZE}" 2>/dev/null || echo "${DB_SIZE} bytes")"

  # --- 2. Storage archive -----------------------------------------------------
  printf "  Archiving storage...\n"

  # Determine the storage volume name
  STORAGE_VOLUME="achare_achare-storage"

  if docker volume inspect "${STORAGE_VOLUME}" >/dev/null 2>&1; then
    docker run --rm \
      -v "${STORAGE_VOLUME}:/data:ro" \
      -v "${DEST}:/backup" \
      alpine tar czf /backup/storage.tar.gz -C /data . 2>/dev/null

    STORAGE_SIZE="$(wc -c < "${DEST}/storage.tar.gz" | tr -d ' ')"
    ok "storage archive: $(numfmt --to=iec-i --suffix=B "${STORAGE_SIZE}" 2>/dev/null || echo "${STORAGE_SIZE} bytes")"
  else
    # Try local bind-mount path
    STORAGE_PATH="${ACHARE_STORAGE_PATH:-${DEPLOY_DIR}/.data/storage}"
    if [ -d "${STORAGE_PATH}" ]; then
      tar czf "${DEST}/storage.tar.gz" -C "${STORAGE_PATH}" . 2>/dev/null
      STORAGE_SIZE="$(wc -c < "${DEST}/storage.tar.gz" | tr -d ' ')"
      ok "storage archive (local): $(numfmt --to=iec-i --suffix=B "${STORAGE_SIZE}" 2>/dev/null || echo "${STORAGE_SIZE} bytes")"
    else
      warn "storage volume/directory not found; skipping storage backup"
    fi
  fi

  # --- 3. Secrets (copy .env) -------------------------------------------------
  printf "  Copying secrets...\n"

  cp "${ENV_FILE}" "${DEST}/.env"
  chmod 600 "${DEST}/.env"
  ok ".env copied (contains ENCRYPTION_KEY — handle with care)"

  # --- 4. Manifest ------------------------------------------------------------
  printf "  Writing manifest...\n"

  # Compute checksums
  DB_CHECKSUM="$(sha256sum "${DEST}/database.dump" | cut -d' ' -f1)"
  ENV_CHECKSUM="$(sha256sum "${DEST}/.env" | cut -d' ' -f1)"

  STORAGE_CHECKSUM=""
  if [ -f "${DEST}/storage.tar.gz" ]; then
    STORAGE_CHECKSUM="$(sha256sum "${DEST}/storage.tar.gz" | cut -d' ' -f1)"
  fi

  cat > "${DEST}/manifest.json" <<EOF
{
  "version": "${ACHARE_VERSION}",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "profile": "${PROFILE}",
  "checksums": {
    "database.dump": "${DB_CHECKSUM}",
    ".env": "${ENV_CHECKSUM}"$(
      if [ -n "${STORAGE_CHECKSUM}" ]; then
        printf ',\n    "storage.tar.gz": "%s"' "${STORAGE_CHECKSUM}"
      fi
    )
  },
  "components": ["database.dump", ".env"$(
    if [ -f "${DEST}/storage.tar.gz" ]; then
      printf ', "storage.tar.gz"'
    fi
  )]
}
EOF
  ok "manifest.json written"

  # --- 5. Create final archive ------------------------------------------------
  printf "  Creating archive...\n"

  FINAL_ARCHIVE="${BACKUP_DIR}/achare-${STAMP}.tar"

  tar cf "${FINAL_ARCHIVE}" -C "${BACKUP_DIR}" "${SNAPSHOT_DIR}"

  if [ "${HAS_ZSTD}" -eq 1 ]; then
    zstd -T0 --rm "${FINAL_ARCHIVE}" -o "${FINAL_ARCHIVE}.zst" >/dev/null 2>&1
    FINAL_SIZE="$(wc -c < "${FINAL_ARCHIVE}.zst" | tr -d ' ')"
    ok "archive: achare-${STAMP}.tar.zst ($(numfmt --to=iec-i --suffix=B "${FINAL_SIZE}" 2>/dev/null || echo "${FINAL_SIZE} bytes"))"
  else
    gzip "${FINAL_ARCHIVE}"
    FINAL_SIZE="$(wc -c < "${FINAL_ARCHIVE}.gz" | tr -d ' ')"
    ok "archive: achare-${STAMP}.tar.gz ($(numfmt --to=iec-i --suffix=B "${FINAL_SIZE}" 2>/dev/null || echo "${FINAL_SIZE} bytes"))"
    warn "zstd not found; used gzip (install zstd for better compression)"
  fi

  # --- 6. Cleanup snapshot directory -------------------------------------------
  rm -rf "${DEST}"

  printf "\n"
  printf "------------------------------------------------------------------------\n"
  printf "Backup complete: %s\n" "${BACKUP_DIR}/achare-${STAMP}.tar.zst${HAS_ZSTD:+}${HAS_ZSTD:-.gz}"
  printf "\n"
  printf "IMPORTANT: This archive contains your secrets (.env with ENCRYPTION_KEY).\n"
  printf "Store it securely and keep a copy off this machine.\n"
  printf "\n"
  printf "Restore with: deploy/backup/restore.sh <archive-path>\n"
}

main "$@"
