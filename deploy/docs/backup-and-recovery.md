# Backup & Recovery

Achare's backup engine generates atomic snapshot archives. This document covers
the strategy, procedures, and best practices.

---

## Why backups matter

Two things in an Achare installation are irreplaceable:

1. **The database** — all records, all workspaces, all history
2. **`ENCRYPTION_KEY`** — without it, encrypted fields (salary, bank details)
   are unreadable permanently

A database dump without the encryption key is an incomplete backup. A storage
archive without the database is useless. Both must be captured together.

---

## What a backup contains

```
achare-backup-20260915T030000Z.tar.zst
├── manifest.json            # version, timestamp, SHA-256 checksums
├── database.dump            # pg_dump custom format (consistent snapshot)
├── storage.tar.gz           # uploaded documents, attachments, avatars
└── .env                     # secrets (ENCRYPTION_KEY, APP_SECRET, DB password)
```

### manifest.json

```json
{
  "version": "0.1.0",
  "createdAt": "2026-09-15T03:00:00Z",
  "profile": "production",
  "checksums": {
    "database.dump": "abc123...",
    ".env": "def456...",
    "storage.tar.gz": "ghi789..."
  },
  "components": ["database.dump", ".env", "storage.tar.gz"]
}
```

---

## Taking a backup

### Using the CLI (recommended)

```bash
# One command — handles everything
deploy/scripts/achare backup

# Or directly
deploy/backup/backup.sh
```

The backup is written to `./backups/achare-<timestamp>.tar.zst`.

### Manual procedure

If the backup script is not available:

```bash
cd twenty-upstream
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DEST="./backups/achare-$STAMP"
mkdir -p "$DEST"

# 1. Database
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.${PROFILE}.yml \
  --env-file deploy/.env \
  exec -T db pg_dump -U achare -d default --format=custom > "$DEST/database.dump"

# 2. Storage
docker run --rm \
  -v achare_achare-storage:/data:ro \
  -v "$PWD/$DEST":/backup \
  alpine tar czf /backup/storage.tar.gz -C /data .

# 3. Secrets
cp deploy/.env "$DEST/.env"

# 4. Manifest
cat > "$DEST/manifest.json" <<EOF
{
  "version": "$(cat VERSION)",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "components": ["database.dump", "storage.tar.gz", ".env"]
}
EOF

# 5. Archive
tar czf "achare-$STAMP.tar.gz" -C backups "achare-$STAMP"
```

---

## Restoring from a backup

### Using the CLI (recommended)

```bash
deploy/scripts/achare restore backups/achare-20260915T030000Z.tar.zst
```

The script will:
1. Extract the archive
2. Validate checksums
3. Stop the application (db + redis stay up)
4. Restore secrets (`.env`) FIRST
5. Restore uploaded files
6. Restore the database via `pg_restore`
7. Start the stack and verify health

### Manual procedure

```bash
cd twenty-upstream
SRC="./backups/achare-20260915T030000Z"

# 1. Stop application
deploy/scripts/achare stop

# 2. Restore secrets FIRST
cp "$SRC/.env" deploy/.env

# 3. Restore files
docker run --rm \
  -v achare_achare-storage:/data \
  -v "$PWD/$SRC":/backup \
  alpine sh -c 'rm -rf /data/* && tar xzf /backup/storage.tar.gz -C /data'

# 4. Restore database
docker compose --project-directory deploy \
  -f deploy/compose/compose.base.yml -f deploy/compose/compose.production.yml \
  --env-file deploy/.env \
  exec -T db pg_restore -U achare -d default --clean --if-exists --no-owner \
  < "$SRC/database.dump"

# 5. Start and verify
deploy/scripts/achare start
deploy/scripts/achare doctor
```

---

## Verification after restore

After restoring, check **three things**:

1. **Log in** — can you authenticate?
2. **Open a record** — are records intact?
3. **Check an encrypted field** — open a salary or bank account field:
   - **If it renders correctly** → `ENCRYPTION_KEY` is right
   - **If blank or error** → STOP immediately and find the correct key
     before anyone writes to the database; the wrong key restoring over good
     data permanently destroys encrypted fields

---

## Backup strategy

### What to back up

| Component | Where | How often |
|-----------|-------|-----------|
| Database | `pg_dump` via backup script | Daily minimum |
| Storage files | Archive via backup script | Daily minimum |
| `.env` secrets | Included in backup archive | With every backup |

### Where to store backups

| Strategy | Pros | Cons |
|----------|------|------|
| Local disk | Fast, simple | Single point of failure |
| Remote server (rsync/scp) | Off-machine | Requires SSH setup |
| S3 / R2 / MinIO | Durable, versioned | Requires credentials |
| Multiple locations | Best resilience | Most complexity |

**Minimum:** Keep backups on a different machine than the one being backed up.
A backup on the same disk survives an operator mistake and nothing else.

### Retention policy

| Backup type | Keep for | Rationale |
|-------------|----------|-----------|
| Daily | 30 days | Enough to recover from recent mistakes |
| Weekly | 12 weeks | Enough to recover from slow corruption |
| Monthly | 12 months | Enough for compliance / audit |

The `install.sh` installer configures a daily cron job at 03:00 UTC.
Manual pruning:

```bash
# Delete backups older than 30 days
find backups/ -name "achare-*.tar.zst" -mtime +30 -delete
```

---

## Disaster recovery scenarios

### Scenario 1: Database corruption

```bash
# Restore just the database from the most recent backup
deploy/scripts/achare restore backups/achare-20260915T030000Z.tar.zst
```

### Scenario 2: Server failure (new machine)

```bash
# 1. Install Docker on the new machine
# 2. Clone the repository
# 3. Copy the backup archive to the new machine
# 4. Restore
deploy/scripts/achare restore /path/to/achare-backup.tar.zst
```

### Scenario 3: Lost encryption key

If `ENCRYPTION_KEY` is lost and you have no backup that contains it:
- **All encrypted fields are permanently unreadable**
- The database itself is still usable for non-encrypted data
- There is no recovery path — this is by design (encryption means encryption)

**Prevention:** Store `ENCRYPTION_KEY` in a password manager, a secrets vault,
or a separate secure location. Never rely on the database alone as your backup.

### Scenario 4: Accidental data deletion

```bash
# 1. Stop the application immediately
deploy/scripts/achare stop

# 2. Restore from a backup taken before the deletion
deploy/scripts/achare restore backups/achare-20260914T030000Z.tar.zst

# 3. This replaces ALL data with the backup state
#    Any changes made after the backup are lost
```

---

## Automated daily backups

The VPS installer (`deploy/scripts/install.sh`) configures a cron job:

```
0 3 * * * cd /opt/achare/twenty-upstream && deploy/backup/backup.sh >> /var/log/achare-backup.log 2>&1
```

To verify the cron job:

```bash
crontab -l | grep achare
```

To disable:

```bash
crontab -l | grep -v 'achare.*backup.sh' | crontab -
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `pg_dump: error: connection refused` | Database container not running | `achare start` first |
| Backup is very large | Storage volume has many files | Expected; `tar.zst` compresses well |
| `pg_restore` warnings about pre-existing objects | Restoring over a non-empty database | Normal; errors are not |
| Encrypted fields blank after restore | Wrong `ENCRYPTION_KEY` | Find the correct key; stop writing to DB |
| `backup.sh: command not found` | Script not executable | `chmod +x deploy/backup/backup.sh` |
