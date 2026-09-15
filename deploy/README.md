# Achare deployment layer

This directory is the deployment/runtime layer around the application. It does not
contain application code, and the application does not import anything from here.
It exists so that "run Achare somewhere" is one command instead of a remembered
incantation, and so that every install has the same shape.

```text
deploy/
├── .env.example              the configuration contract (copy to .env)
│
├── compose/
│   ├── compose.base.yml      services: server, worker, db, redis
│   ├── compose.local.yml     laptop / home lab: ports published, storage bind-mounted
│   ├── compose.production.yml customer VPS: Caddy + TLS, one domain, memory limits
│   ├── compose.desktop.yml   Tauri / Electron: localhost-only, minimal footprint
│   └── Caddyfile             path-based routing for the production profile
│
├── docker/
│   ├── server.Dockerfile     production multi-stage image (server + frontend)
│   └── landing.Dockerfile    marketing site image
│
├── scripts/
│   ├── achare                the operations CLI (all commands below)
│   ├── install.sh            one-line VPS installer (curl | sudo bash)
│   └── update.sh             zero-downtime container updater with rollback
│
├── backup/
│   ├── backup.sh             atomic snapshot engine (pg_dump + storage + secrets)
│   └── restore.sh            disaster recovery & verification
│
├── desktop/
│   └── tauri/                Tauri desktop shell (macOS / Windows)
│       ├── src-tauri/        Rust backend (process management)
│       └── README.md         architecture and setup guide
│
└── docs/
    ├── local-install.md      install and run on a laptop or office box
    ├── vps-install.md        install on a customer VPS with a real domain
    ├── operations.md         health, backup, restore, upgrade, troubleshooting
    └── backup-and-recovery.md backup strategy and procedures
```

## The shape of a deployment

There is exactly **one application image**. It contains the NestJS server *and*
the compiled frontend; the server serves both, so the browser talks to one origin
and there is no CORS surface to configure.

```text
     ┌──────────────────────── one image ────────────────────────┐
     │  deploy/docker/server.Dockerfile --target achare-server   │
     │                                                            │
     │  dist/main          (API + GraphQL)                        │
     │  dist/front         (the SPA, served by the same process)  │
     │  dist/queue-worker  (background jobs — a second container, │
     │                      same image, different command)        │
     └────────────────────────────────────────────────────────────┘
```

`server` runs `node dist/main` and owns database migrations. `worker` runs the
same image with `yarn worker:prod` and is the only place background jobs execute.
`db` and `redis` are stock containers. That is the whole stack.

## The CLI

```bash
deploy/scripts/achare init          # generate deploy/.env with fresh secrets
deploy/scripts/achare start         # start (or update) the stack, detached
deploy/scripts/achare stop          # stop containers (data untouched)
deploy/scripts/achare restart       # restart without touching data
deploy/scripts/achare status        # container state, ports, URLs
deploy/scripts/achare logs [svc]    # follow one service's logs (or all)
deploy/scripts/achare doctor        # pre-flight + runtime diagnostic
deploy/scripts/achare config        # resolved configuration, secrets redacted
deploy/scripts/achare version       # CLI, release and image version
deploy/scripts/achare backup        # atomic snapshot backup
deploy/scripts/achare restore <arc> # restore from a backup archive
deploy/scripts/achare update [ver]  # zero-downtime upgrade
```

The CLI is a thin wrapper over `docker compose`: it selects the right profile
files, points at `deploy/.env`, and never invents state of its own. Anything it
does can be done by hand (the exact `docker compose` invocation is printed in
`compose.base.yml`), which matters when you are on a customer's box with no
patience for wrappers.

## Profiles

| | `local` | `production` | `desktop` |
| :--- | :--- | :--- | :--- |
| Used for | laptop, home lab, office box | customer VPS, SMB server | macOS / Windows desktop app |
| App port | published on the host (`:3000`) | not published; only Caddy is | `127.0.0.1:4242` only |
| TLS | none | automatic, via Caddy + Let's Encrypt | none (localhost) |
| Domain | `http://localhost:3000` | one domain, path-based routing | `http://127.0.0.1:4242` |
| Storage | bind-mounted (`.data/storage`) | named volume | OS data dir |
| Memory limits | none | server 1536M, worker 512M, redis 256M | server 1024M, db 512M |
| Redis | enabled | enabled | disabled (single-user) |
| Log rotation | default | json-file, 10 MB × 5 | default |

Set the profile in `deploy/.env` (`ACHARE_PROFILE=local|production|desktop`) or per
invocation (`ACHARE_PROFILE=production deploy/scripts/achare start`).

## Configuration

`deploy/.env.example` is the contract, and every variable in it is read by the
code. This matters more than it sounds:

> Variable names that *look* plausible but do not exist are ignored silently and
> the application falls back to a default. Writing `STORAGE_DRIVER=s3` (a name
> from an earlier draft) leaves `STORAGE_TYPE` at `LOCAL`, and documents are
> written to local disk on a machine the operator believes has no data plane.

So: `STORAGE_TYPE` (values `LOCAL` or `S_3`, not `STORAGE_DRIVER`),
`STORAGE_LOCAL_PATH` (not `STORAGE_PATH`), and the frontend reads
`REACT_APP_SERVER_BASE_URL` at *build* time, not `REACT_APP_SERVER_URL`.
`achare doctor` validates the file against these names.

**Secrets.** `APP_SECRET` signs sessions; rotating it logs everyone out.
`ENCRYPTION_KEY` encrypts sensitive fields (salary, bank details); losing it makes
encrypted data unrecoverable, so it must be preserved **outside** the database and
included in backups. `achare init` generates both, along with the Postgres
password, and writes `deploy/.env` with mode `600`.

## Backup & Restore

```bash
# Create a backup
deploy/scripts/achare backup

# Restore from a backup
deploy/scripts/achare restore backups/achare-20260915T030000Z.tar.zst
```

The backup engine captures:
- **Database** — `pg_dump` custom format (consistent snapshot, no downtime)
- **Storage** — uploaded documents, attachments, avatars
- **Secrets** — `.env` with `ENCRYPTION_KEY` (required for encrypted fields)
- **Manifest** — version, timestamps, SHA-256 checksums

See `docs/operations.md` for the full backup/restore/upgrade procedure, and
`docs/backup-and-recovery.md` for the backup strategy.

## CI/CD

The GitHub Actions workflow (`.github/workflows/acheare-release.yml`) builds and
pushes version-pinned images to GHCR on tag push:

```bash
# Tag a release
git tag v0.2.0
git push origin v0.2.0

# Images produced:
#   ghcr.io/amloh18/achare-server:0.2.0
#   ghcr.io/amloh18/achare-server:sha-<short-sha>
#   ghcr.io/amloh18/achare-landing:0.2.0
#   ghcr.io/amloh18/achare-landing:sha-<short-sha>
```

## Desktop Appliance

The Tauri desktop shell wraps the Achare server into a native application:

```bash
# Install one-liner
curl -fsSL https://raw.githubusercontent.com/amloh18/acheare-crm/main/twenty-upstream/deploy/scripts/install.sh | sudo bash

# Or build the desktop app
cd deploy/desktop/tauri
cargo tauri build
```

See `deploy/desktop/tauri/README.md` for architecture and development setup.

## VPS Installer

One-command installation on a fresh Ubuntu 24.04 server:

```bash
# Install and configure automatically
sudo bash deploy/scripts/install.sh

# With a custom domain
ACHARE_DOMAIN=crm.example.com ACHARE_EMAIL=admin@example.com sudo bash deploy/scripts/install.sh
```

The installer handles: Docker installation, repository cloning, secret generation,
`.env` configuration, image pulling, stack startup, and daily backup cron.
