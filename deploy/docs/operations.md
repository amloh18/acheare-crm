# Operations

Health, backup, restore, upgrade, rollback, and what to do when something breaks.
Written for whoever is on the box at 2am, not for a design review.

---

## 1. Health

Two endpoints, two different questions.

| | `/healthz` | `/readyz` |
| :--- | :--- | :--- |
| Question | Is the process alive? | Can it actually serve requests? |
| Checks | nothing — the route answering *is* the answer | database + migrations, Redis, storage, worker |
| Codes | always 200 if the process is up | 200 for `ok` and `degraded`, **503 for `unavailable`** |
| Public | yes, safe for an uptime monitor | no, denied at the edge in production |

`/readyz` is what the container healthcheck uses, so a container being reported
`healthy` means it can serve traffic — not merely that Node started.

```bash
deploy/scripts/achare doctor                # everything, human-readable
curl -s localhost:3000/readyz | jq          # the raw report
docker compose ... exec -T server curl -s localhost:3000/readyz   # from inside
```

```json
{
  "status": "degraded",
  "version": "0.1.0",
  "checks": [
    { "name": "database", "status": "up", "latencyMs": 26, "message": "182 migrations applied" },
    { "name": "redis",    "status": "up", "latencyMs": 15 },
    { "name": "storage",  "status": "up", "latencyMs": 15, "message": "LOCAL driver writable" },
    { "name": "worker",   "status": "degraded", "latencyMs": 13, "message": "no queue workers are connected" }
  ],
  "timestamp": "2026-09-12T13:44:19.397Z"
}
```

How to read it:

- **`status: ok`** — everything responds.
- **`status: degraded`** (HTTP 200) — something non-fatal is wrong. The app serves
  requests; `/readyz` returns 200 on purpose, because a load balancer should not
  pull a working instance out of rotation over a warning. Today this means one
  thing in practice: `worker: degraded` for the first few seconds of startup, until
  the worker container connects to the queue.
- **`status: unavailable`** (HTTP 503) — a *fatal* check is down (database, Redis,
  storage). The app cannot serve. This is the code that should page someone.

The three fatal checks are the ones without which requests cannot be answered.
`worker` is deliberately non-fatal: without it, imports and emails queue up
instead of running, but the CRM still works.

`achare doctor` adds the things the app cannot see about itself: is Docker
installed and running, is the env file complete, are the secrets real (not
placeholders, not too short), do the compose files render, is there disk
headroom, in production does `SERVER_URL` match `ACHARE_DOMAIN`. It exits non-zero
on failure, so it works in a cron job or a monitoring hook.

---

## 2. Backup

There is **no `achare backup` command yet.** This is the procedure that works
today. Three things must be captured, and only two of them are in the database.

| What | Where | Why it matters |
| :--- | :--- | :--- |
| Database | volume `achare_achare-db-data` | all records, all workspaces |
| Files | volume `achare_achare-storage` (or `deploy/.data/storage` locally) | uploaded documents, attachments |
| `deploy/.env` | the file | `ENCRYPTION_KEY` — without it, the database is incomplete |

> **`ENCRYPTION_KEY` is not optional.** Encrypted fields (salary, bank details)
> are unreadable without it. A database dump on its own is not a complete backup.
> Keep `deploy/.env` in a secret store as well as in the archive, and never in the
> same place as the dump without encryption.

### Take a backup

```bash
cd twenty-upstream

VERSION=$(cat VERSION)
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DEST="./backups/achare-$STAMP"
mkdir -p "$DEST"

# 1. Database. pg_dump, not a file copy of the data directory — copying a
#    running Postgres data directory produces a corrupt restoration.
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.production.yml \
  --env-file deploy/.env \
  exec -T db pg_dump -U achare -d default --format=custom \
  > "$DEST/database.dump"

# 2. Files. The volume name is <project>_<volume>, and the project is "achare".
docker run --rm \
  -v achare_achare-storage:/data:ro \
  -v "$PWD/$DEST":/backup \
  alpine tar czf /backup/storage.tar.gz -C /data .

# 3. Secrets. Contains ENCRYPTION_KEY; encrypt it before it leaves the host.
cp deploy/.env "$DEST/.env"

# 4. Manifest, so a restore knows what it is looking at.
cat > "$DEST/manifest.json" <<EOF
{
  "version": "$VERSION",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "components": ["database.dump", "storage.tar.gz", ".env"]
}
EOF

tar czf "achare-$STAMP.tar.gz" -C backups "achare-$STAMP"
```

Use `--format=custom` — it compresses, and it lets `pg_restore` do a
parallel/selective restore later. `-T` is required: without it `docker compose
exec` allocates a TTY and mangles the binary stream.

Prefer `pg_dump` over stopping the stack. It is consistent without downtime. If
you must have a byte-exact snapshot, `achare stop`, archive the volumes, then
`achare start` — accepting the outage.

### Where backups should live

At minimum, on a different machine than the one being backed up; a backup on the
same disk survives an operator mistake and nothing else. The architecture doc
describes local and S3-compatible destinations as a future first-class feature
(`Settings → System → Backup`); until then, whatever ships the archive off the box
is your choice, and the archive is a plain `.tar.gz` so anything can carry it.

---

## 3. Restore

Restoring reconstructs the database, the files, and the secrets. Do it on a
clean install of the **same release** the backup came from, then upgrade.

```bash
cd twenty-upstream
git checkout <release-tag-from-manifest.json>
tar xzf achare-<stamp>.tar.gz -C backups
SRC="./backups/achare-<stamp>"

# 1. Stop the application. Postgres and Redis stay up.
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.production.yml \
  --env-file deploy/.env \
  stop server worker

# 2. Restore the secrets FIRST: PG_DATABASE_PASSWORD in it must match the
#    database about to be restored, and ENCRYPTION_KEY is what makes the
#    encrypted columns readable at all.
cp "$SRC/.env" deploy/.env

# 3. Files. --delete so the restored files are exactly the archived ones.
docker run --rm \
  -v achare_achare-storage:/data \
  -v "$PWD/$SRC":/backup \
  alpine sh -c 'rm -rf /data/* && tar xzf /backup/storage.tar.gz -C /data'

# 4. Database. --clean --if-exists drops existing objects first, so this replaces
#    the current contents rather than merging with them.
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.production.yml \
  --env-file deploy/.env \
  exec -T db pg_restore -U achare -d default --clean --if-exists --no-owner \
  < "$SRC/database.dump"

# 5. Start and verify. The entrypoint runs migrations, which is expected: the
#    restored dump may predate the running image.
deploy/scripts/achare start
deploy/scripts/achare doctor
```

Then log in and check a record you know, a document you know, and — critically —
**one field you know to be encrypted** (a salary or a bank account). If those
render, the `ENCRYPTION_KEY` is right. If they are blank or an error, stop and
find the correct key before anyone writes to the database; the wrong key restoring
over good data is how encrypted fields get permanently lost.

`pg_restore` warnings about pre-existing objects are normal when restoring over a
non-empty database. Errors are not.

---

## 4. Upgrade

`VERSION` at the repository root is the canonical release. The compose files
require an explicit `ACHARE_VERSION` (defaulting to that file), so no part of this
procedure ever involves `latest`.

```bash
cd twenty-upstream

# 1. Back up first. Always. An upgrade with no backup is a gamble.
#    (section 2)

# 2. Record what you are upgrading from, for the rollback you may need.
deploy/scripts/achare version

# 3. Get the new release.
git fetch --tags && git checkout v0.2.0
deploy/scripts/achare config         # confirm the resolved version and image

# 4. Restart. The server's entrypoint runs migrations before serving.
deploy/scripts/achare restart
deploy/scripts/achare logs server    # watch the migration output

# 5. Verify.
deploy/scripts/achare doctor
```

Migrations run automatically on start, inside the server container's entrypoint,
before the app accepts traffic. That is the intended path, and it is why the
worker refuses to run them too.

For a maintenance window with less downtime:

```bash
deploy/scripts/achare stop
# pull images / build the new tag
deploy/scripts/achare start
```

### Rollback

```bash
# in deploy/.env
ACHARE_VERSION=0.1.0

deploy/scripts/achare start
deploy/scripts/achare doctor
```

> **Rolling back the image does not roll back migrations.** Migrations are
> forward-only: going back to the previous image leaves the database on the new
> schema. Usually that is harmless — a schema ahead of the code — but if the
> release included a destructive change, the previous image may not work against
> the migrated schema either.

That is the honest limit of the rollback story, and the reason step 1 is not
negotiable. A rollback that matters is a **restore** of the pre-upgrade backup
(section 3), against the previous image. Plan for the outage accordingly: for a
release with destructive migrations, the rollback path is restore, not
retag.

Before any release with schema changes, test the upgrade on a restore of
production data — not on an empty database, which will not exercise the
migrations that matter.

---

## 5. Common failures

| Symptom | Likely cause | What to do |
| :--- | :--- | :--- |
| Compose refuses to start: `SERVER_URL must be set` | `.env` missing the variable | `achare config`; the compose file fails loudly on purpose rather than starting with a default hostname |
| Container `unhealthy`, logs show migrations retrying | Database not reachable, or the password in `.env` no longer matches the volume | `achare logs db`; if the volume was initialised with a different password, restore the old one or recreate the volume (data loss) |
| `readyz` reports `storage: down` | `STORAGE_LOCAL_PATH` not writable by uid 1000, or an S3 credential/endpoint problem | Check the `message` field; for `S_3`, verify `STORAGE_S3_ENDPOINT` is reachable *from the container* |
| `readyz` reports `worker: degraded` forever | Worker container restarting or never healthy | `achare logs worker`; it waits for the server to be healthy first, so a server that never becomes ready keeps it down |
| `readyz` reports `redis: down` | Redis container down, or wrong `REDIS_URL` | `achare logs redis`; `REDIS_URL` must point at `redis:6379` inside the compose network, not `localhost` |
| Site loads but actions fail, or "invalid link" errors | `SERVER_URL` disagrees with what the browser used | `achare doctor` (production) checks this pairing explicitly; fix `SERVER_URL` and restart |
| Certificate never issues | DNS does not resolve to the host yet, or 80/443 are closed | `achare logs proxy`; ACME retries with backoff, so it recovers on its own once DNS is right |
| `env` changes have no effect | The container was not recreated | `achare restart` recreates with the current environment; `compose restart` on its own does not re-read `.env` |
| Everything is `unhealthy` after a disk-full incident | Postgres went read-only | Free space, then restart the stack; check `achare doctor` for the headroom warning |

### Getting useful output

```bash
deploy/scripts/achare status
deploy/scripts/achare logs server
deploy/scripts/achare logs worker
deploy/scripts/achare logs db
deploy/scripts/achare logs proxy          # production only
deploy/scripts/achare config              # resolved values, secrets redacted
```

When reporting a problem, include: the output of `achare version`, the output of
`achare doctor`, and the relevant server logs. Those three answer most of the
questions before they are asked.

---

## 6. What exists and what doesn't

### Exists now

- `achare backup` — atomic snapshot backup (pg_dump + storage + secrets + manifest)
- `achare restore <archive>` — full disaster recovery from a backup archive
- `achare update [version]` — zero-downtime upgrade with automatic backup
- **Automated daily backups** — configured by `install.sh` via cron (03:00 UTC)
- **CI/CD release builds** — `.github/workflows/acheare-release.yml` builds and
  pushes version-pinned images to GHCR on tag push
- **VPS installer** — `deploy/scripts/install.sh` for one-command Ubuntu setup
- **Desktop shell** — Tauri scaffolding in `deploy/desktop/tauri/`

### Does not exist yet

- **Scheduled backup rotation.** Backups accumulate; there is no automatic pruning
  of old archives. Add a cron that deletes archives older than your retention
  threshold (e.g., 7 daily, 4 weekly).
- **A backup UI.** `Settings → System → Backup` is a design goal.
- **`Settings → System → Health`.** The data exists — the admin panel's health
  service already reports database, Redis, worker and app status — but the
  deployed surface for it is not built.
- **S3 backup destination.** `backup.sh` writes locally; streaming to S3/R2/MinIO
  is a future enhancement.
- **Desktop Tauri build.** The scaffolding exists; `cargo tauri build` has not
  been verified end-to-end yet.
