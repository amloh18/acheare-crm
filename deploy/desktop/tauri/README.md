# Achare Desktop — Tauri Shell

This directory contains the Tauri application that wraps the Achare server runtime into a native desktop application.

## Architecture

```text
┌──────────────────────────────────────────────┐
│              Tauri Desktop Shell              │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │          WebView (React SPA)            │  │
│  │      http://127.0.0.1:4242              │  │
│  └─────────────────────────────────────────┘  │
│                    │                          │
│  ┌─────────────────▼──────────────────────┐  │
│  │         Achare Runtime (Node.js)       │  │
│  │  • NestJS server (API + GraphQL)       │  │
│  │  • Embedded PostgreSQL 16              │  │
│  │  • Embedded Redis 7                    │  │
│  │  • Background worker (single-user)     │  │
│  └────────────────────────────────────────┘  │
│                    │                          │
│  ┌─────────────────▼──────────────────────┐  │
│  │         Data Directory                  │  │
│  │  macOS:  ~/Library/Application         │  │
│  │          Support/Achare/               │  │
│  │  Windows: %AppData%\Achare\           │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## How It Works

1. **First launch:** Onboarding wizard starts the embedded PostgreSQL, creates the database, runs migrations, and creates the admin account.
2. **Subsequent launches:** The runtime starts, the WebView connects to `http://127.0.0.1:4242`, and the user lands in their workspace.
3. **Updates:** The Tauri updater replaces the executable; user data is never touched.

## Key Principles

- **Single user mode:** No reverse proxy, no TLS, no multi-tenancy. The app runs locally for one person.
- **No Redis by default:** Background jobs are processed inline or deferred (configurable in Settings).
- **Data isolation:** All database files and documents live in the OS user directory.
- **No root/system install:** The app is a normal user-space application.

## Directory Structure

```text
deploy/desktop/tauri/
├── README.md              ← this file
├── src-tauri/             ← Tauri Rust backend
│   ├── Cargo.toml
│   ├── tauri.conf.json    ← Tauri configuration
│   ├── src/
│   │   └── main.rs        ← Rust entrypoint (process management)
│   └── icons/             ← App icons
└── ui/                    ← WebView content (symlinked to built SPA)
```

## Setup (Development)

```bash
# Prerequisites
# - Rust (https://rustup.rs)
# - Node.js 24+
# - Tauri CLI: cargo install tauri-cli

# 1. Build the frontend
cd twenty-upstream
npx nx run twenty-front:build

# 2. Build the server
npx nx run twenty-server:build

# 3. Run in dev mode
cd deploy/desktop/tauri
cargo tauri dev

# 4. Build for distribution
cargo tauri build
```

## Setup (Production)

```bash
# Build the distributable
cd deploy/desktop/tauri
cargo tauri build

# macOS: creates .dmg and .app in target/release/bundle/
# Windows: creates .exe installer in target/release/bundle/
```

## Embedded Runtime

The desktop app bundles:

| Component | Version | Purpose |
|-----------|---------|---------|
| PostgreSQL | 16 | Metadata + workspace data |
| Redis | 7 | Queue state (optional in single-user) |
| Node.js | 24 | Achare server runtime |
| Twenty Server | current | API + GraphQL + migrations |
| Twenty Front | current | React SPA |

## Platform Data Paths

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Achare/` |
| Windows | `%AppData%\Achare\` |
| Linux | `~/.local/share/Achare/` |

Contents:
```
Achare/
├── db/                 ← PostgreSQL data directory
├── storage/            ← Uploaded documents
├── logs/               ← Application logs
├── .env                ← Generated secrets
└── config.json         ← User preferences
```

## Onboarding Wizard (First Launch)

1. **Welcome** — Company name and branding
2. **Admin Setup** — Email and password for the first admin
3. **Feature Selection** — Choose modules (CRM, Recruitment, HR, Payroll, etc.)
4. **Database Init** — Automated PostgreSQL setup and migration
5. **Launch** — Enter the workspace

## Limitations

- No multi-user collaboration (single-user mode only)
- No automatic backups (user must back up the data directory manually or via Settings)
- No remote access (the app is localhost-only)
- No automated SSL (no domain, no public access)

For multi-user, collaboration, or public access, use the server deployment (`deploy/scripts/achare start`).
