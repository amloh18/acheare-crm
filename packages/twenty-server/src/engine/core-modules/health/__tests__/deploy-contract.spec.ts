import { existsSync, readFileSync } from 'fs';
import path from 'path';

import { ApiPath } from 'twenty-shared/types';

// The deployment layer is easy to get wrong in ways nothing else catches: a
// healthcheck pointing at a route that does not exist, a variable name that the
// config service silently ignores, a `latest` tag creeping into production.
// These tests read the deploy artifacts from the repository root and fail when
// they drift from the code. They are skipped when deploy/ is not checked out
// (for example when the server package is built on its own).
const REPO_ROOT = path.resolve(process.cwd(), '..', '..');
const DEPLOY_DIR = path.join(REPO_ROOT, 'deploy');
const COMPOSE_DIR = path.join(DEPLOY_DIR, 'compose');
const CONFIG_VARIABLES_PATH = path.resolve(
  __dirname,
  '../../twenty-config/config-variables.ts',
);

const readOrNull = (filePath: string): string | null =>
  existsSync(filePath) ? readFileSync(filePath, 'utf8') : null;

const deployIsCheckedOut = existsSync(COMPOSE_DIR);

const describeDeploy = deployIsCheckedOut ? describe : describe.skip;

// Variables the deploy layer owns: consumed by docker-compose itself or by the
// Postgres/Redis containers, never by the application.
const COMPOSE_ONLY_VARIABLES = new Set([
  'ACHARE_IMAGE',
  'ACHARE_VERSION',
  'ACHARE_PROFILE',
  'ACHARE_DOMAIN',
  'ACHARE_ACME_EMAIL',
  'ACHARE_STORAGE_PATH',
  'ACHARE_SERVER_MEMORY_LIMIT',
  'ACHARE_WORKER_MEMORY_LIMIT',
  'ACHARE_REDIS_MEMORY_LIMIT',
  'PG_DATABASE_PASSWORD',
  'PG_DATABASE_USER',
  'PG_DATABASE_NAME',
  'PG_DATABASE_PORT',
  'REDIS_PORT',
]);

describeDeploy('deploy contract', () => {
  describe('compose profiles', () => {
    const base = readOrNull(path.join(COMPOSE_DIR, 'compose.base.yml')) ?? '';
    const local = readOrNull(path.join(COMPOSE_DIR, 'compose.local.yml')) ?? '';
    const production =
      readOrNull(path.join(COMPOSE_DIR, 'compose.production.yml')) ?? '';

    it('ships base, local and production profiles', () => {
      expect(base).not.toBe('');
      expect(local).not.toBe('');
      expect(production).not.toBe('');
    });

    it('runs the server healthcheck against the readiness route the code serves', () => {
      // Guards the exact class of bug this test exists for: the healthcheck
      // path is a string in YAML and a route in the app; nothing else ties them.
      expect(base).toContain(`/readyz`);
      expect(ApiPath.Ready).toBe('readyz');
    });

    it('lets exactly one process own migrations', () => {
      expect(base).toContain('DISABLE_DB_MIGRATIONS: "true"');
    });

    it('pins postgres to a major version instead of a floating tag', () => {
      expect(base).toMatch(/image:\s*postgres:16\b/);
    });

    it('never deploys the application from a mutable tag', () => {
      for (const profile of [base, local, production]) {
        expect(profile).not.toMatch(/achare-server:latest/);
      }
      expect(base).toContain('${ACHARE_VERSION:-0.1.0}');
    });

    it('publishes the app port locally and only the proxy in production', () => {
      expect(local).toContain('${NODE_PORT:-3000}:${NODE_PORT:-3000}');
      expect(production).toContain('proxy:');
      expect(production).not.toContain('${NODE_PORT:-3000}:${NODE_PORT:-3000}');
    });

    it('denies the readiness endpoint at the edge but keeps liveness public', () => {
      const caddyfile =
        readOrNull(path.join(COMPOSE_DIR, 'Caddyfile')) ?? '';

      // /readyz names dependencies and migration counts; it is for the compose
      // network and `achare doctor`, not for the public internet. The catch-all
      // would route it, so the denial has to be an explicit, higher-specificity
      // block — a comment saying so is not enforcement.
      expect(caddyfile).toMatch(/handle\s+\/readyz\s*\{[^}]*respond\s+404/);
      expect(caddyfile).toMatch(/handle\s+\/healthz\s*\{[^}]*reverse_proxy/);
    });
  });

  describe('.env.example', () => {
    const envExample = readOrNull(path.join(DEPLOY_DIR, '.env.example')) ?? '';
    const configVariables = readOrNull(CONFIG_VARIABLES_PATH) ?? '';

    it('documents only variables the application or compose actually reads', () => {
      const documented = envExample
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line))
        .map((line) => line.split('=')[0]);

      expect(documented.length).toBeGreaterThan(10);

      const unknown = documented.filter(
        (key) =>
          !COMPOSE_ONLY_VARIABLES.has(key) &&
          !new RegExp(`\\b${key}\\s*[:?=]`).test(configVariables),
      );

      // A name that the config service does not know is silently ignored at
      // runtime, and the app falls back to a default.
      expect(unknown).toEqual([]);
    });

    it('ships without a real secret', () => {
      expect(envExample).toMatch(/^APP_SECRET=\s*$/m);
      expect(envExample).toMatch(/^ENCRYPTION_KEY=\s*$/m);
      expect(envExample).toMatch(/^PG_DATABASE_PASSWORD=\s*$/m);
    });
  });
});
