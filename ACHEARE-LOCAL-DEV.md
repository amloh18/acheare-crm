# ACHEARE CRM — Local Development Guide

Everything needed to run, stop, and verify **ACHEARE CRM** on this machine.
Nothing here deploys anything online.

---

## Quick reference

| Thing | Value |
|---|---|
| UI (use this in a browser) | http://localhost:3001 |
| API server | http://localhost:3000 |
| Dev login (seeded) | `tim@apple.dev` / `tim@apple.dev` |
| Branch | `acheare/whitelabel` |
| Node used by the stack | `/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/bin` |

---

## START / STOP / STATUS

### START everything

```bash
cd "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/twenty-upstream"
bash scripts/acheare-up.sh
```

This starts, in order (skipping anything already running):
1. PostgreSQL 16 (Homebrew, port 5432)
2. Redis (port 6379)
3. ACHEARE server → `screen` session `acheare-server` (port 3000)
4. ACHEARE front → `screen` session `acheare-front` (port 3001)

It waits until both health endpoints return 200 before exiting.

### STOP the app (keep PostgreSQL/Redis running)

```bash
bash scripts/acheare-down.sh
```

### STOP everything, including PostgreSQL and Redis

```bash
bash scripts/acheare-down.sh --all
```

Note: PostgreSQL 16 and Redis are registered as Homebrew **launchd services**
(`brew services list`). If they were started via `brew services start`, stop
them with `brew services stop postgresql@16` / `brew services stop redis`
instead — `acheare-down.sh --all` stops them directly, and launchd may restart
them at login otherwise.

### STATUS

```bash
screen -ls                                   # should list acheare-server, acheare-front
redis-cli ping                               # PONG
/opt/homebrew/opt/postgresql@16/bin/pg_isready   # accepting connections
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/healthz   # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3001/          # 200
```

### LOGS

```bash
tail -f .acheare-dev-logs/server.log
tail -f .acheare-dev-logs/front.log
```

### ATTACH to a screen session (Ctrl-A then D to detach again)

```bash
screen -r acheare-server
screen -r acheare-front
```

---

## Persistence locations

| Data | Where |
|---|---|
| PostgreSQL 16 data | `/opt/homebrew/var/postgresql@16` |
| Database name / role | `default` / `postgres` (local dev only) |
| Uploaded files (local storage driver) | `packages/twenty-server/.local-storage/` |
| Server/frontend env files | `packages/twenty-server/.env`, `packages/twenty-front/.env` (not committed) |
| Dev logs | `.acheare-dev-logs/` (git-ignored) |

Do **not** delete `packages/twenty-server/.local-storage` or the Postgres data
directory — that is where your CRM data and attachments live.

---

## Environment configuration

Both packages have local `.env` files copied from their `.env.example`:
`packages/twenty-server/.env` and `packages/twenty-front/.env`.

Key server values (already set locally, defaults are fine for dev):

```text
PG_DATABASE_URL=postgres://postgres:postgres@localhost:5432/default
REDIS_URL=redis://localhost:6379
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=.local-storage
SERVER_URL=http://localhost:3000
FRONT_BASE_URL=http://localhost:3001
EMAIL_FROM_NAME=ACHEARE   # ACHEARE branding change
```

`.env` files are git-ignored; never commit secrets. Production values come
later, in the production-architecture phase.

---

## Verification

### Full API end-to-end test (30 checks)

```bash
node scripts/acheare-e2e-test.mjs
```

Covers: valid/invalid login, token exchange, unauthenticated rejection,
company/person/opportunity CRUD, person→company and opportunity→person
relationships, notes + note→company links, search and filtering, the complete
local file-upload chain (createFileUpload → PUT → completeFileUpload →
read-back → on-disk check), delete, and signOut.

Exit code 0 = all pass.

### Restart-persistence check

The E2E test deliberately keeps one company, one note (+link), and one
uploaded file. After restarting the whole stack:

```bash
node scripts/acheare-restart-check.mjs <companyId> <noteId> <fileId>
```

(The ids are printed at the end of the E2E run.)

### Remaining "Twenty" references (triage report)

```bash
node scripts/check-remaining-twenty-references.mjs
```

Classifies occurrences into USER-FACING / LEGAL / I18N / INTERNAL / TESTS /
NEEDS REVIEW. Legal (twenty.com/legal/*, LICENSE, DPA) and internal
references stay by design.

---

## Node version

The repo requires Node `^24.5.0`; the system Node (24.4.1) is too old. A
portable Node **24.16.0** lives at
`/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/`.
The stack scripts reference it explicitly. For manual yarn/nx commands:

```bash
export PATH="/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/bin:$PATH"
corepack enable --install-directory "/Users/amlohsl/Documents/VScode_projects/PROJECTS/ACHEARE CRM/node-v24.16.0-darwin-arm64/bin"
```

Builds: `npx nx run-many -t build -p twenty-ui twenty-server twenty-front`
Tests: `npx nx run twenty-front:test` · `npx nx run twenty-server:test`

---

## Why screen (not launchd)?

launchd-spawned processes cannot read `~/Documents` (macOS TCC privacy
protection) — the project lives under Documents, so launchd agents fail with
EX_CONFIG. `screen` sessions inherit the starting shell's TCC grants and
survive terminal/tool sessions. PostgreSQL and Redis stay on `brew services`
(launchd) because their data lives in `/opt/homebrew`, outside Documents.

## Known limitations

- Dev-seeded workspace ("Apple", `tim@apple.dev`) is used for testing; fresh
  workspaces can be created through the UI (native password auth).
- Email delivery is not configured (by design this phase); templates render
  with ACHEARE branding but nothing is sent.
- The login-logo placeholder and favicon are generated placeholders — swap in
  real assets later (see ACHEARE-WHITE-LABEL.md for the exact file list).
- Postgres ≥15 is required (migrations use `NULLS NOT DISTINCT`); PG16 is
  installed locally.
- Screen sessions die on reboot (by design); rerun `acheare-up.sh` after a
  restart — data persists.
