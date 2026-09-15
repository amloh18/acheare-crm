# VPS install (customer VPS, office server)

Goal: Achare reachable at `https://achare.customer.com` over TLS, with the whole
stack on one box and no external database or object store required.

This is the deployment the product is built around. Everything Achare depends on
— Postgres, Redis, file storage — runs in the same compose project, on the
customer's own hardware. There is no cloud dependency and no data plane that
lives somewhere else.

> **Design rule:** the deployment must not know or care what orchestrates it.
> `docker compose up -d` is the primitive. Dokploy, Portainer or a shell script
> can drive it, but Achare itself must never require them.

## 1. Deploying to an existing server

### Sizing

| | Minimum | Comfortable |
| :--- | :--- | :--- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB SSD | 80 GB SSD |

The app's memory limits are in `compose.production.yml` (server 1536M, worker
512M, Redis 256M) and can be overridden with `ACHARE_SERVER_MEMORY_LIMIT`,
`ACHARE_WORKER_MEMORY_LIMIT`, `ACHARE_REDIS_MEMORY_LIMIT`.

### Install Docker

On Ubuntu 22.04/24.04, use Docker's official repository — do not use the distro's
`docker.io` package, which lags and usually ships without the compose plugin:

```bash
curl -fsSL https://get.docker.com | sh
docker compose version        # must print v2.x
```

Add your user to the `docker` group if you would rather not use `sudo` for every
command, then re-login:

```bash
sudo usermod -aG docker "$USER"
```

### Get the deployment layer

```bash
git clone <your-repo> achare && cd achare/twenty-upstream
git checkout <release-tag>
```

Pull the released image, or build it on a machine with more RAM and push it to
your own registry. Building on a 2 vCPU box is possible but slow, and the build
stage needs more memory than the runtime does.

### Point DNS at the box

An `A` record (and `AAAA`, if the host has IPv6) for the domain, pointing at the
server's public IP. Caddy will not attempt to issue a certificate until the name
resolves; if it does not, it retries with backoff and you will see ACME errors in
`achare logs proxy`.

Open 80 and 443:

```bash
sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw allow 443/udp
```

### Configure

```bash
cp deploy/.env.example deploy/.env
deploy/scripts/achare init
```

Then edit `deploy/.env` and set at minimum:

```env
ACHARE_PROFILE=production
ACHARE_DOMAIN=achare.customer.com
ACHARE_ACME_EMAIL=ops@yourcompany.com
SERVER_URL=https://achare.customer.com
```

`SERVER_URL` must match `https://<ACHARE_DOMAIN>` exactly. Invitation links, email
links and session cookies are generated from it, so a mismatch produces
"invalid link" reports and login loops. `achare doctor` checks this pairing
explicitly in the production profile.

### Start

```bash
deploy/scripts/achare start
deploy/scripts/achare logs proxy      # watch the certificate get issued
deploy/scripts/achare doctor
```

`doctor` verifies Docker, the env file, both required secrets, S3 variables when
storage is not local, that the compose files render, disk headroom, Postgres,
Redis, `/healthz`, `/readyz`, storage writability, and the domain/`SERVER_URL`
pairing. It is the first thing to run when anything looks wrong, on any install.

## 2. What the production profile does differently

- **The application port is not published.** Only `proxy` binds host ports. The
  server is reachable only through Caddy. `compose.local.yml` publishes it;
  production does not.
- **One domain, path-based routing.** The server serves both the API and the SPA
  build, so everything lives on one origin. There is no second DNS record, no
  `api.` subdomain, and no CORS policy to get wrong.
- **`/healthz` is public**, so an external uptime monitor can watch the process.
- **`/readyz` returns 404 at the edge.** Its body names dependencies and migration
  counts, which is useful to `achare doctor` (inside the compose network) and not
  useful to the public internet. Caddy denies it explicitly, ahead of the
  catch-all.
- **Security headers** (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`) are set at the proxy.
- **Memory limits and log rotation** sized for a 4–8 GB box.

## 3. Storage choices

Default is local storage on the box's disk (`STORAGE_TYPE=LOCAL`), which keeps
customer documents on customer infrastructure.

For larger installs or a separate backup/durability story, point storage at any
S3-compatible service and the application switches drivers at startup:

```env
STORAGE_TYPE=S_3
STORAGE_S3_REGION=auto
STORAGE_S3_NAME=achare-documents
STORAGE_S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com
STORAGE_S3_ACCESS_KEY_ID=...
STORAGE_S3_SECRET_ACCESS_KEY=...
# Only when browsers cannot reach STORAGE_S3_ENDPOINT directly:
STORAGE_S3_PRESIGNED_URL_BASE=https://storage.example.com
```

`S_3` is the literal enum value; `s3` is normalised to it. The variable is
`STORAGE_TYPE` — writing `STORAGE_DRIVER` (a name from an earlier draft of the
architecture doc) leaves storage on local disk while the operator believes it is
on S3, and `achare doctor` will not warn you, because from the application's point
of view nothing is wrong. Copy the names from `deploy/.env.example`.

## 4. Secrets

`achare init` generates `APP_SECRET`, `ENCRYPTION_KEY` and
`PG_DATABASE_PASSWORD`, and writes `deploy/.env` mode `600`.

| Secret | Losing it means |
| :--- | :--- |
| `APP_SECRET` | Everyone is logged out. Recoverable (users log in again). |
| `PG_DATABASE_PASSWORD` | Recoverable only if you still have the old value; the Postgres volume was initialised with it. |
| `ENCRYPTION_KEY` | **Encrypted fields — salary, bank details — are unreadable. Not recoverable.** |

So `ENCRYPTION_KEY` must be preserved outside the database, in whatever secret
store you already trust, and included in backups as a secret — not pasted into an
ordinary database dump.

Rotating `APP_SECRET` is a planned, acceptable operation. Rotating
`ENCRYPTION_KEY` is a migration: it must be done with `FALLBACK_ENCRYPTION_KEY`
set so existing records can still be read while new writes use the new key.
Treat it as a maintenance window, not a config edit.

## 5. Notes for whoever runs the box

- **Migrations belong to the server container's entrypoint.** The worker runs with
  `DISABLE_DB_MIGRATIONS=true` and `DISABLE_CRON_JOBS_REGISTRATION=true` and waits
  for the server to be healthy. Do not "fix" a slow start by making both migrate.
- **Do not edit the database by hand.** Schema changes come from migrations that
  ship with a release; a manual edit will be reverted or will break the next
  upgrade.
- **`latest` is never used.** The compose files require an explicit
  `ACHARE_VERSION`, defaulting to the `VERSION` file in the repository. That is
  what makes rollback a tag change rather than an archaeology exercise. See
  [`operations.md`](operations.md).
- **Upgrading is stop → backup → swap tag → start**, with the procedure written
  down in [`operations.md`](operations.md). There is no `achare update` command
  yet.

## 6. Provisioning a new customer from scratch

The manual sequence, which is what an installer script should eventually automate:

1. Create the VPS (Ubuntu 24.04 LTS), add your SSH key, disable password auth.
2. Point the customer's domain at the IP.
3. Install Docker (above) and open 80/443.
4. Clone the release tag and run `achare init`.
5. Set `ACHARE_DOMAIN`, `SERVER_URL`, `ACHARE_ACME_EMAIL`, `ACHARE_PROFILE=production`.
6. `achare start`, then `achare doctor` until it reports healthy.
7. Open the domain and complete the first-run setup (company name, admin user).
8. Record `ENCRYPTION_KEY` in your secret store, and configure a backup according
   to [`operations.md`](operations.md).

Add a DNS/uptime monitor against `https://<domain>/healthz` — that route is public
precisely so monitoring does not need credentials.
