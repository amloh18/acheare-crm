# Local install (laptop, home lab, office box)

Goal: Achare running at `http://localhost:3000` on one machine, with its data in
`deploy/.data/`, reachable from other devices on the LAN if you want.

## 1. Prerequisites

- **Docker.** Docker Desktop, or on macOS:
  `brew install colima docker docker-compose && colima start`.
  The CLI needs the `docker compose` plugin (v2), not the old `docker-compose`
  Python script.
- **RAM.** ~2.5 GB free for the stack (server 1.5 GB is the largest piece).
- **Free ports.** `3000` (app), `5432` (Postgres), `6379` (Redis). The `local`
  profile publishes the last two so you can point `psql`/`redis-cli` at the stack
  — if you already run Postgres or Redis on the host, either stop it or override
  `PG_DATABASE_PORT`/`REDIS_PORT` in `deploy/.env`.

```bash
deploy/scripts/achare doctor      # tells you which of these is missing
```

`doctor` degrades cleanly when Docker is absent: it reports what is wrong and
exits non-zero without pretending to have checked the runtime.

## 2. Get the image

**Pull a release** (once one is published):

```bash
echo "ACHARE_IMAGE=ghcr.io/amloh18/achare-server" >> deploy/.env
```

**Or build it locally** from this repository. Note `--target twenty`: that
Dockerfile's *default* target is the all-in-one dev image, which is not what you
want here.

```bash
cd twenty-upstream
docker build \
  --target twenty \
  --build-arg APP_VERSION="$(cat VERSION)" \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t achare/server:"$(cat VERSION)" \
  .
```

Then in `deploy/.env`:

```env
ACHARE_IMAGE=achare/server
```

The build takes a while (it compiles the server and the frontend). It is a
multi-stage build; the result contains both.

## 3. Configure

```bash
cp deploy/.env.example deploy/.env
deploy/scripts/achare init
```

`init` fills in `APP_SECRET`, `ENCRYPTION_KEY` and `PG_DATABASE_PASSWORD` with
fresh random values and writes the file `600`. It will not overwrite an existing
`.env` unless you pass `--force` (which rotates the secrets — do not do that on a
running install).

Review these three, which it deliberately leaves alone:

```env
ACHARE_PROFILE=local
SERVER_URL=http://localhost:3000     # what the browser will type
NODE_PORT=3000
```

Keep `ACHARE_PROFILE=local`. Then confirm the file is sane:

```bash
deploy/scripts/achare config      # secrets shown as ********
```

## 4. Start

```bash
deploy/scripts/achare start
```

The first start is the slow one: the server container runs database setup and
migrations in its entrypoint before serving. The container healthcheck is
`/readyz`, so it reports `starting` until the app can actually answer requests
(up to ~2 minutes on a cold database).

Watch it come up:

```bash
deploy/scripts/achare logs server
```

Then verify, from a second terminal:

```bash
deploy/scripts/achare doctor
curl -s http://localhost:3000/readyz | jq
```

A healthy install answers:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "checks": [
    { "name": "database", "status": "up", "latencyMs": 26 },
    { "name": "redis",    "status": "up", "latencyMs": 15 },
    { "name": "storage",  "status": "up", "latencyMs": 15 },
    { "name": "worker",   "status": "up", "latencyMs": 13 }
  ]
}
```

`status` is `ok` when everything is up, `degraded` when something non-fatal is
missing (typically `worker` before the worker container has connected — wait a
few seconds), and `unavailable` when a fatal check is down. Only `unavailable`
returns HTTP 503; `degraded` is still a working application, so it returns 200 on
purpose and the detail lives in the body.

> `GET /healthz` is a liveness check only — it answers "the process is
> listening", nothing more. If something looks wrong, read `/readyz`.

## 5. First run

Open `http://localhost:3000`. There is no seeded account: the first run walks
through workspace creation (company name, admin email, password) and provisions
the workspace schema, metadata, standard objects and roles. Give it a minute.

## 6. Reaching it from another device

Other devices on the LAN need `SERVER_URL` to be the address *they* will use, not
`localhost`, because it is baked into invitation links, email links and session
cookies:

```env
SERVER_URL=http://192.168.1.40:3000
```

Then `deploy/scripts/achare restart`. The port is already published on all
interfaces by the `local` profile. There is no TLS here, so do not expose this
to the internet — for a real domain, use
[`vps-install.md`](vps-install.md).

## 7. Where the data is

```text
deploy/.data/storage/       uploaded files (bind mount, inspectable)
Docker volume achare-db-data     PostgreSQL
Docker volume achare-redis-data  Redis (queue state)
deploy/.env                 secrets — back this up too, separately and safely
```

Because storage is a bind mount in this profile, backing up the files is a
`cp -r`. The database is not a file you can copy safely while it runs — use the
procedure in [`operations.md`](operations.md).

## 8. Everyday commands

```bash
deploy/scripts/achare status
deploy/scripts/achare logs
deploy/scripts/achare restart
deploy/scripts/achare stop
```

`stop` stops containers; volumes and `deploy/.data/` are untouched. To wipe
everything — **this deletes all data** — remove the volumes explicitly, which the
CLI deliberately does not offer:

```bash
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.local.yml \
  --env-file deploy/.env down -v
rm -rf deploy/.data
```

## Troubleshooting

**`docker is not installed or not on PATH`** — install Docker, or
`brew install colima docker docker-compose && colima start`.

**`the Docker daemon is not reachable`** — Docker Desktop is not running, or
`colima start`.

**Server container keeps restarting** — `achare logs server`. The usual causes are
an empty `ENCRYPTION_KEY`/`APP_SECRET` (the compose file refuses to start without
them) or a `pg_database_url` the container cannot reach.

**Port already in use** — something else holds 3000/5432/6379. Move the app with
`NODE_PORT`, or stop the host Postgres/Redis, or override `PG_DATABASE_PORT` and
`REDIS_PORT`.

**`/readyz` says `database: down`** — the server cannot reach Postgres. Check
`achare logs db`; if the password was changed in `.env` after the volume was
created, the container's data directory still has the old one. Either restore the
old password or recreate the volume (which loses data).

**`worker: degraded` never clears** — check `achare logs worker`. It waits for the
server to become healthy before starting (migrations belong to the server), so a
server that never becomes ready keeps the worker down too.
