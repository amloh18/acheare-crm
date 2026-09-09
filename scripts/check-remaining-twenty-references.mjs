#!/usr/bin/env node
/**
 * ACHEARE white-label validation script.
 *
 * Scans the app packages for remaining references to "Twenty" and classifies
 * them so a human can confirm none are user-facing branding that was missed.
 *
 * Run from the repository root:
 *   node scripts/check-remaining-twenty-references.mjs
 *
 * Classification is intentionally conservative: only obvious categories are
 * auto-classified. Everything else lands in "NEEDS REVIEW" for a human to
 * decide. This script does NOT fail the build and does NOT require zero
 * matches — upstream identifiers, legal text and generated i18n catalogs are
 * expected to keep referencing "Twenty".
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(join(import.meta.dirname, '..'));

// Packages that ship the CRM product (website/docs are upstream marketing
// sites and are intentionally out of scope for the white-label).
const SCAN_DIRS = [
  'packages/twenty-front/src',
  'packages/twenty-emails/src',
  'packages/twenty-server/src',
];

// Internal identifiers / names that are intentionally left unchanged.
const INTERNAL_PATTERNS = [
  /allowRequestsToTwentyIcons/i,
  /TwentyIcons/i,
  /TwentyConfig/i,
  /TwentyLogLevel/i,
  /TwentySemVer/i,
  /isTwentyStandardApplication/i,
  /twenty-ui\//,
  /twenty-shared/,
  /twenty-logo\.png/i,
  /twenty-mime-policy/i,
  /Twenty-Marketplace/i,
  /Twenty-AppUpgrade/i,
  /Twenty CLI/i,
  /Twenty MCP Server/i,
  /Twenty MCP bridge/i,
  /Twenty CRM/,
  /Twenty-DPA/i,
  /twenty-standard-application/i,
  /twenty-cli-application-registration/i,
  /twentyhq\.github\.io/i,
  /Twenty\.com/,
  // oxlint/eslint rule namespaces and disable comments
  /twenty\/no-/,
  /twenty\/effect/,
  /twenty\/state/,
  /twenty\/hardcoded/,
  /twenty\/navigate/,
  /twenty\/logic/,
  // workspace package imports (twenty-*)
  /^import /,
  /from 'twenty-/,
  /from "twenty-/,
  /import\('twenty-/,
  // upstream URLs in comments / links (attribution)
  /github\.com\/twentyhq\/twenty/,
  /\.twenty\.com/,
  // internal channel / logger names
  /twenty-sign-out/,
  /loggerLink\(\(\) => 'Twenty'\)/,
];

// Comment-only lines (source comments are internal).
const COMMENT_PATTERNS = [/^\s*(\/\/|\*|\/\*)/];

// Legal documents (DPA templates, license) — never modified.
const LEGAL_PATTERNS = [/\/dpa\//i, /dpa-template|dpa-region|dpa-template-version/i];

// Generated i18n catalogs.
const GENERATED_PATTERNS = [/\/locales\//, /locales\/generated/, /\.po$/];

// Tests, fixtures, stories, mock data.
const TEST_PATTERNS = [
  /__tests__/,
  /__stories__/,
  /\.spec\./,
  /\.test\./,
  /testing\/mock-data/,
  /\.stories\./,
];

const walk = (dir, acc = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, acc);
    } else if (
      /\.(ts|tsx|js|mjs|html|json|md)$/.test(entry) &&
      !entry.startsWith('.')
    ) {
      acc.push(full);
    }
  }
  return acc;
};

const matchesAny = (line, patterns) => patterns.some((p) => p.test(line));

const buckets = {
  LEGAL: [],
  'I18N (generated catalogs)': [],
  'INTERNAL (identifiers/names)': [],
  'TESTS/FIXTURES/STORIES': [],
  'NEEDS REVIEW': [],
};

let total = 0;

for (const scanDir of SCAN_DIRS) {
  const absDir = join(ROOT, scanDir);
  if (!statSync(absDir, { throwIfNoEntry: false })) {
    continue;
  }
  for (const file of walk(absDir)) {
    const rel = relative(ROOT, file);
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (!line.includes('Twenty') && !line.includes('twenty')) {
        return;
      }
      total++;
      const entry = `${rel}:${idx + 1}: ${line.trim()}`;
      const context = `${rel}\n${line}`;
      if (matchesAny(context, LEGAL_PATTERNS)) {
        buckets.LEGAL.push(entry);
      } else if (matchesAny(context, GENERATED_PATTERNS)) {
        buckets['I18N (generated catalogs)'].push(entry);
      } else if (matchesAny(context, INTERNAL_PATTERNS)) {
        buckets['INTERNAL (identifiers/names)'].push(entry);
      } else if (matchesAny(context, TEST_PATTERNS)) {
        buckets['TESTS/FIXTURES/STORIES'].push(entry);
      } else if (matchesAny(line, COMMENT_PATTERNS)) {
        buckets['INTERNAL (identifiers/names)'].push(entry);
      } else {
        buckets['NEEDS REVIEW'].push(entry);
      }
    });
  }
}

console.log('='.repeat(72));
console.log('Remaining "Twenty" references (ACHEARE white-label validation)');
console.log('='.repeat(72));
console.log(`Total occurrences (case-insensitive "Twenty"/"twenty"): ${total}\n`);

for (const [bucket, entries] of Object.entries(buckets)) {
  console.log(`\n[${bucket}] (${entries.length})`);
  for (const entry of entries.slice(0, 40)) {
    console.log(`  ${entry}`);
  }
  if (entries.length > 40) {
    console.log(`  ... and ${entries.length - 40} more`);
  }
}

console.log('\n' + '='.repeat(72));
console.log('Interpretation:');
console.log('- LEGAL / I18N / INTERNAL / TESTS are expected to keep referencing "Twenty".');
console.log('- Review the NEEDS REVIEW bucket manually before release.');
console.log('='.repeat(72));