#!/usr/bin/env bash
#
# install.sh — Achare one-line VPS installer
#
# Installs and starts Achare on a fresh Ubuntu 24.04 LTS server.
# Run as root or with sudo.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/amloh18/acheare-crm/main/twenty-upstream/deploy/scripts/install.sh | sudo bash
#
# Or manually:
#   sudo bash deploy/scripts/install.sh
#
# What it does:
#   1. Installs Docker and Docker Compose plugin
#   2. Clones the Achare repository (or uses the local copy)
#   3. Generates cryptographic secrets (APP_SECRET, ENCRYPTION_KEY, DB password)
#   4. Configures the deployment profile
#   5. Starts the stack
#   6. Configures automatic daily backups via cron
#   7. Runs the health check

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration (override with environment variables)
# ---------------------------------------------------------------------------

ACHARE_DOMAIN="${ACHARE_DOMAIN:-}"
ACHARE_EMAIL="${ACHARE_EMAIL:-noreply@example.com}"
ACHARE_PROFILE="${ACHARE_PROFILE:-production}"
ACHARE_VERSION="${ACHARE_VERSION:-}"
ACHARE_REPO="${ACHARE_REPO:-https://github.com/amloh18/acheare-crm.git}"
ACHARE_BRANCH="${ACHARE_BRANCH:-main}"
ACHARE_INSTALL_DIR="${ACHARE_INSTALL_DIR:-/opt/achare}"
ACHARE_ENABLE_BACKUP="${ACHARE_ENABLE_BACKUP:-true}"

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
# Root check
# ---------------------------------------------------------------------------

if [ "$(id -u)" -ne 0 ]; then
  fail "This script must be run as root (use sudo)"
fi

# ---------------------------------------------------------------------------
# Step 1: Install Docker
# ---------------------------------------------------------------------------

step "Installing Docker"

if command -v docker >/dev/null 2>&1; then
  ok "Docker already installed: $(docker --version | head -1)"
else
  # Install Docker official GPG key and repository
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  ok "Docker installed: $(docker --version | head -1)"
fi

# Ensure Docker is running
systemctl enable docker >/dev/null 2>&1 || true
systemctl start docker 2>/dev/null || true

# ---------------------------------------------------------------------------
# Step 2: Clone or update the repository
# ---------------------------------------------------------------------------

step "Setting up Achare repository"

if [ -d "${ACHARE_INSTALL_DIR}/.git" ]; then
  ok "Repository exists at ${ACHARE_INSTALL_DIR}; pulling latest"
  cd "${ACHARE_INSTALL_DIR}"
  git fetch --all --quiet
  if [ -n "${ACHARE_BRANCH}" ]; then
    git checkout "${ACHARE_BRANCH}" --quiet 2>/dev/null || git checkout "${ACHARE_BRANCH}" -b "${ACHARE_BRANCH}" --quiet 2>/dev/null || true
  fi
  git pull --quiet 2>/dev/null || true
else
  ok "Cloning repository to ${ACHARE_INSTALL_DIR}"
  mkdir -p "$(dirname "${ACHARE_INSTALL_DIR}")"
  git clone --branch "${ACHARE_BRANCH}" --depth 1 "${ACHARE_REPO}" "${ACHARE_INSTALL_DIR}"
fi

cd "${ACHARE_INSTALL_DIR}/twenty-upstream"

# Resolve version from VERSION file
if [ -z "${ACHARE_VERSION}" ]; then
  ACHARE_VERSION="$(cat VERSION 2>/dev/null | tr -d '[:space:]' || echo '0.1.0')"
fi
ok "Achare version: ${ACHARE_VERSION}"

# ---------------------------------------------------------------------------
# Step 3: Generate secrets and configure .env
# ---------------------------------------------------------------------------

step "Generating secrets and configuring .env"

DEPLOY_DIR="deploy"
ENV_FILE="${DEPLOY_DIR}/.env"
ENV_EXAMPLE="${DEPLOY_DIR}/.env.example"

if [ ! -f "${ENV_EXAMPLE}" ]; then
  fail "env example not found: ${ENV_EXAMPLE}"
fi

if [ -f "${ENV_FILE}" ]; then
  ok ".env already exists; preserving existing configuration"
else
  # Generate cryptographic secrets
  APP_SECRET="$(openssl rand -base64 32)"
  ENCRYPTION_KEY="$(openssl rand -base64 32)"
  PG_PASSWORD="$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)"

  # Build .env from template
  while IFS= read -r line || [ -n "${line}" ]; do
    case "${line}" in
      'APP_SECRET='*) printf 'APP_SECRET=%s\n' "${APP_SECRET}" ;;
      'ENCRYPTION_KEY='*) printf 'ENCRYPTION_KEY=%s\n' "${ENCRYPTION_KEY}" ;;
      'PG_DATABASE_PASSWORD='*) printf 'PG_DATABASE_PASSWORD=%s\n' "${PG_PASSWORD}" ;;
      'ACHARE_PROFILE='*) printf 'ACHARE_PROFILE=%s\n' "${ACHARE_PROFILE}" ;;
      'EMAIL_FROM_ADDRESS='*) printf 'EMAIL_FROM_ADDRESS=noreply@%s\n' "${ACHARE_DOMAIN:-localhost}" ;;
      'EMAIL_FROM_NAME='*) printf 'EMAIL_FROM_NAME=Achare\n' ;;
      *) printf '%s\n' "${line}" ;;
    esac
  done < "${ENV_EXAMPLE}" > "${ENV_FILE}"

  chmod 600 "${ENV_FILE}"
  ok "secrets generated and written to ${ENV_FILE}"
fi

# Configure domain and SERVER_URL for production
if [ "${ACHARE_PROFILE}" = "production" ] && [ -n "${ACHARE_DOMAIN}" ]; then
  # Update SERVER_URL
  sed -i "s|^SERVER_URL=.*|SERVER_URL=https://${ACHARE_DOMAIN}|" "${ENV_FILE}"
  sed -i "s|^ACHARE_DOMAIN=.*|ACHARE_DOMAIN=${ACHARE_DOMAIN}|" "${ENV_FILE}"
  sed -i "s|^ACHARE_ACME_EMAIL=.*|ACHARE_ACME_EMAIL=${ACHARE_EMAIL}|" "${ENV_FILE}"
  ok "configured for domain: https://${ACHARE_DOMAIN}"
elif [ "${ACHARE_PROFILE}" = "production" ]; then
  warn "ACHARE_DOMAIN not set; TLS certificates will not be provisioned"
  warn "Set ACHARE_DOMAIN and ACHARE_ACME_EMAIL in ${ENV_FILE} before going live"
fi

# Set the version in .env
sed -i "s|^# ACHARE_VERSION=.*|ACHARE_VERSION=${ACHARE_VERSION}|" "${ENV_FILE}"

# ---------------------------------------------------------------------------
# Step 4: Pull images and start the stack
# ---------------------------------------------------------------------------

step "Pulling images and starting the stack"

IMAGE="ghcr.io/amloh18/achare-server:${ACHARE_VERSION}"
ok "Pulling ${IMAGE}..."
docker pull "${IMAGE}" 2>/dev/null || warn "could not pull ${IMAGE}; will build locally if needed"

cd "${DEPLOY_DIR}"
chmod +x scripts/achare
./scripts/achare start

# ---------------------------------------------------------------------------
# Step 5: Configure automatic backups (cron)
# ---------------------------------------------------------------------------

if [ "${ACHARE_ENABLE_BACKUP}" = "true" ]; then
  step "Configuring automatic daily backups"

  CRON_LINE="0 3 * * * cd ${ACHARE_INSTALL_DIR}/twenty-upstream && deploy/backup/backup.sh >> /var/log/achare-backup.log 2>&1"

  # Add to root's crontab if not already present
  (crontab -l 2>/dev/null | grep -v 'achare.*backup.sh'; echo "${CRON_LINE}") | crontab -
  ok "daily backup scheduled at 03:00 UTC"
fi

# ---------------------------------------------------------------------------
# Step 6: Health check
# ---------------------------------------------------------------------------

step "Running health check"

./scripts/achare doctor || warn "doctor reported issues — check the output above"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

printf "\n"
printf "========================================================================\n"
printf "${GREEN}Achare installation complete!${NC}\n"
printf "========================================================================\n"
printf "\n"
printf "  Version:     %s\n" "${ACHARE_VERSION}"
printf "  Profile:     %s\n" "${ACHARE_PROFILE}"
printf "  Install dir: %s\n" "${ACHARE_INSTALL_DIR}/twenty-upstream"
printf "\n"

if [ "${ACHARE_PROFILE}" = "production" ] && [ -n "${ACHARE_DOMAIN}" ]; then
  printf "  URL:         https://%s\n" "${ACHARE_DOMAIN}"
else
  printf "  URL:         http://localhost:3000\n"
fi

printf "\n"
printf "Useful commands:\n"
printf "  cd %s\n" "${ACHARE_INSTALL_DIR}/twenty-upstream"
printf "  deploy/scripts/achare status    # container state and URLs\n"
printf "  deploy/scripts/achare logs      # follow logs\n"
printf "  deploy/scripts/achare doctor    # full diagnostic\n"
printf "  deploy/scripts/achare update    # upgrade to a new version\n"
printf "  deploy/backup/backup.sh         # manual backup\n"
printf "\n"
