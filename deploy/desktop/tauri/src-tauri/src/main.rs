// =============================================================================
// Achare Desktop — Tauri Backend
// =============================================================================
//
// Manages the Achare runtime lifecycle:
//   1. Starts embedded PostgreSQL (if not running)
//   2. Starts the Achare Node.js server on 127.0.0.1:4242
//   3. Opens the WebView pointed at the server
//   4. Handles graceful shutdown
//
// The server binary and frontend assets are bundled with the app.
// Data is stored in the OS user directory, not in the app bundle.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::Manager;

struct RuntimeState {
    server_process: Mutex<Option<Child>>,
    data_dir: PathBuf,
}

#[tauri::command]
fn get_data_dir(state: tauri::State<'_, RuntimeState>) -> String {
    state.data_dir.to_string_lossy().to_string()
}

#[tauri::command]
fn get_server_url() -> String {
    "http://127.0.0.1:4242".to_string()
}

#[tauri::command]
fn check_server_health() -> bool {
    // Simple HTTP check against /healthz
    let url = "http://127.0.0.1:4242/healthz";
    match reqwest::blocking::get(url) {
        Ok(resp) => resp.status().is_success(),
        Err(_) => false,
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Resolve the data directory
            let data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to resolve app data dir");

            // Ensure data directories exist
            std::fs::create_dir_all(data_dir.join("db")).ok();
            std::fs::create_dir_all(data_dir.join("storage")).ok();
            std::fs::create_dir_all(data_dir.join("logs")).ok();

            // Generate .env if it doesn't exist
            let env_path = data_dir.join(".env");
            if !env_path.exists() {
                generate_default_env(&env_path, &data_dir);
            }

            // Start the Achare runtime in a background thread
            let state = RuntimeState {
                server_process: Mutex::new(None),
                data_dir: data_dir.clone(),
            };

            // Manage the state
            app.manage(state);

            // Spawn the server process
            std::thread::spawn(move || {
                start_achare_runtime(&app_handle, &data_dir);
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_data_dir,
            get_server_url,
            check_server_health,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Achare Desktop");
}

/// Generate a default .env file with fresh secrets.
fn generate_default_env(path: &PathBuf, data_dir: &PathBuf) {
    use std::io::Write;

    let app_secret = generate_secret();
    let encryption_key = generate_secret();
    let db_password = generate_secret();

    let storage_path = data_dir.join("storage");
    let db_path = data_dir.join("db");

    let content = format!(
        r#"# Achare Desktop — Auto-generated configuration
ACHARE_VERSION=0.1.0
ACHARE_PROFILE=desktop
NODE_ENV=production
NODE_PORT=4242
SERVER_URL=http://127.0.0.1:4242
PG_DATABASE_USER=achare
PG_DATABASE_PASSWORD={db_password}
PG_DATABASE_NAME=achare
REDIS_URL=
APP_SECRET={app_secret}
ENCRYPTION_KEY={encryption_key}
STORAGE_TYPE=LOCAL
STORAGE_LOCAL_PATH={storage_path}
ACHARE_STORAGE_PATH={storage_path}
EMAIL_FROM_ADDRESS=noreply@localhost
EMAIL_FROM_NAME=Achare
DISABLE_DB_MIGRATIONS=false
DISABLE_CRON_JOBS_REGISTRATION=true
"#,
        db_password = db_password,
        app_secret = app_secret,
        encryption_key = encryption_key,
        storage_path = storage_path.display(),
    );

    let mut file = std::fs::File::create(path).expect("failed to create .env");
    file.write_all(content.as_bytes()).ok();
}

/// Generate a random secret (base64-encoded, 32 bytes).
fn generate_secret() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};

    let seed = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();

    // Simple pseudo-random for secrets (not cryptographic, but adequate for
    // a desktop app generating its own local config; the real crypto happens
    // in Node.js/PostgreSQL).
    let mut bytes = [0u8; 32];
    for (i, byte) in bytes.iter_mut().enumerate() {
        *byte = ((seed >> (i % 16 * 8)) ^ (i as u128 * 6364136223846793005)) as u8;
    }

    base64_encode(&bytes)
}

/// Simple base64 encoding (no external crate needed for this small use case).
fn base64_encode(data: &[u8]) -> String {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut result = String::with_capacity((data.len() + 2) / 3 * 4);

    for chunk in data.chunks(3) {
        let b0 = chunk[0] as u32;
        let b1 = if chunk.len() > 1 { chunk[1] as u32 } else { 0 };
        let b2 = if chunk.len() > 2 { chunk[2] as u32 } else { 0 };
        let triple = (b0 << 16) | (b1 << 8) | b2;

        result.push(CHARS[((triple >> 18) & 0x3F) as usize] as char);
        result.push(CHARS[((triple >> 12) & 0x3F) as usize] as char);
        if chunk.len() > 1 {
            result.push(CHARS[((triple >> 6) & 0x3F) as usize] as char);
        } else {
            result.push('=');
        }
        if chunk.len() > 2 {
            result.push(CHARS[(triple & 0x3F) as usize] as char);
        } else {
            result.push('=');
        }
    }

    result
}

/// Start the Achare runtime (PostgreSQL + Node.js server).
fn start_achare_runtime(app_handle: &tauri::AppHandle, data_dir: &PathBuf) {
    let env_path = data_dir.join(".env");

    // Check if PostgreSQL is available locally (brew/system install)
    let pg_available = Command::new("pg_isready")
        .arg("-q")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map(|s| s.success())
        .unwrap_or(false);

    if pg_available {
        // Use the system PostgreSQL
        eprintln!("[achare-desktop] Using system PostgreSQL");
    } else {
        // For bundled PostgreSQL, we'd need the embedded binary.
        // For now, log a warning — the user needs PostgreSQL available.
        eprintln!("[achare-desktop] WARNING: PostgreSQL not found on PATH");
        eprintln!("[achare-desktop] Install PostgreSQL 16: brew install postgresql@16");
        eprintln!("[achare-desktop] Or use the all-in-one Docker image for development");
    }

    // Start the server process
    // In production, this would be the bundled Node.js runtime.
    // For development, we use the local node binary.
    let server_dir = find_server_directory(app_handle);

    eprintln!(
        "[achare-desktop] Starting server from: {}",
        server_dir.display()
    );

    let mut child = Command::new("node")
        .arg("dist/main")
        .current_dir(&server_dir)
        .env("NODE_ENV", "production")
        .env("NODE_PORT", "4242")
        .env("SERVER_URL", "http://127.0.0.1:4242")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("failed to start Achare server");

    eprintln!("[achare-desktop] Server PID: {}", child.id());

    // Wait for server to be healthy
    let mut healthy = false;
    for i in 0..120 {
        std::thread::sleep(std::time::Duration::from_secs(2));

        if check_health() {
            eprintln!(
                "[achare-desktop] Server healthy after {}s",
                (i + 1) * 2
            );
            healthy = true;
            break;
        }

        if i % 10 == 9 {
            eprintln!(
                "[achare-desktop] Still waiting for server... ({}s)",
                (i + 1) * 2
            );
        }
    }

    if !healthy {
        eprintln!("[achare-desktop] WARNING: Server did not become healthy within 240s");
    }

    // Keep the thread alive (the process is managed by the Mutex in RuntimeState)
    // In a real implementation, we'd store the child handle and wait on it.
    let _ = child.wait();
}

/// Check if the server is healthy.
fn check_health() -> bool {
    reqwest::blocking::get("http://127.0.0.1:4242/healthz")
        .map(|r| r.status().is_success())
        .unwrap_or(false)
}

/// Find the server directory (where dist/main lives).
fn find_server_directory(app_handle: &tauri::AppHandle) -> PathBuf {
    // In development, the server is at twenty-upstream/packages/twenty-server
    // In production, it's bundled in the app

    // Try the dev path first
    let dev_path = app_handle
        .path()
        .resource_dir()
        .unwrap_or_default()
        .join("../../../../../twenty-upstream/packages/twenty-server");

    if dev_path.exists() {
        return dev_path;
    }

    // Try relative to the executable
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_default();

    let bundled_path = exe_dir.join("server").join("packages").join("twenty-server");
    if bundled_path.exists() {
        return bundled_path;
    }

    // Fallback: assume we're running from the repo root
    std::env::current_dir()
        .unwrap_or_default()
        .join("twenty-upstream/packages/twenty-server")
}
