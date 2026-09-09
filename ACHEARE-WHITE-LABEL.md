# ACHEARE White-Label Guide

This document describes how the open-source [Twenty CRM](https://github.com/twentyhq/twenty)
repository was forked and white-labeled into **ACHEARE CRM**.

The goal of this phase was branding only: **no CRM functionality was modified**.
Twenty's authentication, data model, workflows, and architecture are untouched.

---

## 1. Repository layout

```
upstream Twenty (github.com/twentyhq/twenty)
        |
        v
ACHEARE branch (acheare/whitelabel)  <-- you are here
        |
        +-- branding/customizations (this document + scripts/)
```

- **Repository location:** `twenty-upstream/` inside this workspace
- **Upstream remote:** `origin` → `https://github.com/twentyhq/twenty`
- **ACHEARE branch:** `acheare/whitelabel` (created from upstream `main` at
  commit `3af9f5d04d` — "Add Menu to twenty-ui (#25610)")
- **Upstream history:** preserved intact; the branch only adds commits on top.

## 2. What was changed (summary)

| Area | Change |
| --- | --- |
| Browser/App identity | `index.html` title, og/twitter metadata, description → **ACHEARE CRM**; favicon + apple-touch-icon → ACHEARE assets |
| PWA manifest | `public/manifest.json` → `short_name: "ACHEARE"`, `name: "ACHEARE CRM"`, compact ACHEARE icon set |
| Page titles | `title-utils.ts` default suffix `Twenty` → `ACHEARE` (404 page, generic pages) |
| Login page | `Welcome to Twenty` → `Welcome to ACHEARE` |
| Login footer | `By using Twenty, you agree to the …` → `By using ACHEARE, you agree to the …` (legal URLs still point to twenty.com — see Limitations) |
| Logo | Replaced all references to Twenty's logo with a temporary ACHEARE placeholder logo (see §4) |
| Default workspace logo | `DEFAULT_WORKSPACE_LOGO` (front + emails) no longer points at Twenty's hosted placeholder image |
| Timeline author | System-authored timeline entries now display `ACHEARE` instead of `Twenty` |
| Billing errors | "contact Twenty team" → "contact ACHEARE team" (5 files) |
| Enterprise text | "install Twenty on a second server…" → "install ACHEARE on a second server…" |
| Community page | "implement and customize Twenty." → "implement and customize ACHEARE." |
| CSV import UI | "Twenty fields" → "ACHEARE fields" |
| Email templates | Head, footer, logo alt text, "What is Twenty?" block, invite/verification/password/trial/suspension copy → ACHEARE (see §7) |
| Email sender name | `EMAIL_FROM_NAME` default `Felix from Twenty` → `ACHEARE` |
| Email verification subject | `Welcome to Twenty: Please Confirm Your Email` → `Welcome to ACHEARE: …` |

## 3. Files changed

### Modified files (white-label)

**Frontend — `packages/twenty-front/`**
- `index.html` — title, og:title, twitter:title, description, favicon, apple-touch-icon, og:image/twitter:image
- `public/manifest.json` — PWA name + icon set
- `src/utils/title-utils.ts` — default page title
- `src/utils/__tests__/title-utils.test.ts` — updated expectations
- `src/pages/auth/SignInUp.tsx` — "Welcome to ACHEARE"
- `src/modules/auth/sign-in-up/components/FooterNote.tsx` — "By using ACHEARE…"
- `src/pages/not-found/NotFound.tsx` — "Page Not Found | ACHEARE"
- `src/modules/onboarding/components/OnboardingHeader.tsx` — logo asset
- `src/modules/onboarding/components/OnboardingPulsingLogo.tsx` — logo asset
- `src/modules/onboarding/components/import-contacts/OnboardingImportPreviewSyncBadge.tsx` — logo asset
- `src/modules/applications/components/AppConnectionHeader.tsx` — logo asset
- `src/modules/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo.ts` — local placeholder instead of Twenty-hosted image
- `src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts` (+ test) — "ACHEARE"
- `src/modules/settings/billing/components/AddPaymentMethodForm.tsx`
- `src/modules/settings/billing/hooks/useBillingPortalSession.ts`
- `src/modules/settings/billing/hooks/useEndSubscriptionTrialPeriod.ts`
- `src/modules/settings/billing/hooks/useHandleCheckoutSession.ts`
- `src/modules/settings/billing/hooks/useSubmitSubscriptionPayment.ts`
- `src/modules/spreadsheet-import/steps/components/MatchColumnsStep/components/ColumnGrid.tsx` — "ACHEARE fields"
- `src/pages/settings/enterprise/SettingsEnterprise.tsx`
- `src/pages/settings/community/SettingsCommunity.tsx`

**Emails — `packages/twenty-emails/`**
- `src/components/Logo.tsx` — alt text + placeholder URL
- `src/components/BaseHead.tsx` — "ACHEARE email"
- `src/components/Footer.tsx` — aria labels + sender placeholder
- `src/components/WhatIsTwenty.tsx` — "What is ACHEARE?"
- `src/constants/DefaultWorkspaceLogo.ts` — placeholder URL
- `src/emails/clean-suspended-workspace.email.tsx`
- `src/emails/billing-trial-converting.email.tsx`
- `src/emails/password-update-notify.email.tsx`
- `src/emails/send-email-verification-link.email.tsx`
- `src/emails/send-invite-link.email.tsx`

**Server — `packages/twenty-server/`**
- `src/engine/core-modules/twenty-config/config-variables.ts` — `EMAIL_FROM_NAME` default
- `src/engine/core-modules/email-verification/services/email-verification.service.ts` — email subject

### New files (assets + tooling)
- `packages/twenty-front/public/images/integrations/acheare-logo.svg` — placeholder logo
- `packages/twenty-front/public/favicon.svg` — placeholder favicon
- `packages/twenty-front/public/images/icons/acheare/` — generated PNG icons
  (16, 32, 48, 192, 512)
- `scripts/generate-acheare-brand-assets.mjs` — regenerates the placeholder icons
- `scripts/check-remaining-twenty-references.mjs` — validation script (§11)

### Modified files (build fixes — upstream issues, not branding)
See §10. These are the ONLY non-branding changes and are clearly separated.

## 4. Branding assets (logo / favicon)

Twenty's own assets were **left untouched** (upstream `public/images/icons/*`,
`twenty-logo.svg`). ACHEARE uses its own placeholder set so the final logo can
be dropped in without touching upstream files:

| Asset | Path | Current state |
| --- | --- | --- |
| App logo (SVG) | `packages/twenty-front/public/images/integrations/acheare-logo.svg` | Placeholder ("A" monogram on indigo→violet gradient) |
| Favicon (SVG) | `packages/twenty-front/public/favicon.svg` | Placeholder |
| Favicon (PNG fallback) | `public/images/icons/acheare/favicon-48x48.png` | Generated |
| Apple touch icon | `public/images/icons/acheare/icon-192x192.png` | Generated |
| PWA icons | `public/images/icons/acheare/icon-{16,32,48,192,512}.png` | Generated |
| Email logo | hardcoded URL in `twenty-emails/src/components/Logo.tsx` | `https://app.acheare.com/…` placeholder |

**To insert the final ACHEARE logo:** replace the SVG/PNG files above (keep the
same file names and paths — no code changes needed), then update the email logo
URL in `twenty-emails/src/components/Logo.tsx` and the email default workspace
logo in `twenty-emails/src/constants/DefaultWorkspaceLogo.ts` to the deployed
ACHEARE front URL. Regenerate PNGs with `node scripts/generate-acheare-brand-assets.mjs`
or overwrite them directly.

## 5. Browser / application identity

- Browser title: `ACHEARE CRM`
- Open Graph / Twitter cards: title `ACHEARE CRM`, description
  `ACHEARE CRM - A modern open-source CRM`, image points to the local ACHEARE icon
  (replace with a real social card before launch)
- PWA manifest: `ACHEARE` / `ACHEARE CRM`
- Login page: `Welcome to ACHEARE`
- 404 page: `Page Not Found | ACHEARE`

## 6. Login experience

Twenty's existing email+password authentication was **preserved** (the
`client-config` endpoint reports `authProviders.password: true`). Only the
visible product name on the sign-in flow was changed. No Supabase/SSO work was
done — that is a later phase.

## 7. Email templates

All user-facing Twenty references in `twenty-emails` were replaced (title,
footer, "What is ACHEARE?" block, invite, verification, password-update,
trial-converting, suspended-workspace emails) and the server-side email sender
name + verification subject were updated.

**Requires later configuration (not done — no email provider configured):**
- Email logo URL → deployed ACHEARE asset URL (currently `https://app.acheare.com/…`)
- Email footer sender identity → ACHEARE's legal entity + address
  (currently a placeholder; commercial email requires a physical address)
- Email footer links → ACHEARE's own website/docs/legal pages (currently
  upstream twenty.com links, kept for attribution)

## 8. Licensing and attribution (IMPORTANT)

- The upstream `LICENSE` (AGPL-3.0) is **unchanged and must remain**.
- Copyright notices, third-party licenses and the upstream README are
  **unchanged**.
- **AGPL note for commercial white-labeling:** AGPL-3.0 requires that anyone
  who uses the software over a network be offered the corresponding source.
  If ACHEARE is offered as a hosted service, ACHEARE must make the
  (modified) source available to users. This is a legal obligation, not an
  ACHEARE decision — review with counsel before launch. No legal advice is
  given here.
- The Twenty trademark: the Twenty logo and "Twenty" name remain upstream
  property; ACHEARE does not use Twenty's logo as its own.

## 9. What was intentionally NOT changed

- **Package names / imports:** all `twenty-*` workspace packages
  (`twenty-front`, `twenty-server`, `twenty-ui`, …) keep their names.
- **Environment variables, Docker service names, database names:** unchanged.
- **API identifiers, migrations, GraphQL types:** unchanged.
- **MCP connector name** (`Twenty`, `Twenty MCP Server`): kept — it is a
  protocol identifier matched by MCP clients and upstream docs.
- **Legal documents (DPA templates):** unchanged — they legally bind
  "Twenty.com PBC" as processor.
- **Website (`twenty-website`) and docs (`twenty-docs`):** out of scope for
  this phase (upstream marketing sites, not the CRM product).
- **README.md:** left as upstream (project attribution).

## 10. Build & run (verified on this machine)

### Requirements
- Node.js `^24.5.0` (verified with `24.16.0`; a portable copy lives at
  `../node-v24.16.0-darwin-arm64/` next to the repo)
- Yarn 4.13.0 (via corepack; repo pins `yarn@4.13.0`)
- PostgreSQL **16** (upstream migrations require ≥15) and Redis

### Install & build
```bash
cd twenty-upstream
corepack yarn install
corepack yarn nx run twenty-front:build
corepack yarn nx run twenty-server:build
```

### Database setup (first run)
```bash
cd packages/twenty-server
cp .env.example .env            # PG_DATABASE_URL=postgres://postgres:postgres@localhost:5432/default
node dist/database/scripts/setup-db.js
node dist/command/command.js run-instance-commands --force --include-slow
```

### Run
```bash
# terminal 1 — server (port 3000)
cd packages/twenty-server && node dist/main
# terminal 2 — frontend dev server (port 3001)
cd packages/twenty-front && cp .env.example .env && npx vite
```
Then open http://localhost:3001. The official upstream `yarn start` target
(`nx run-many -t start -p twenty-server twenty-front` + worker) is equivalent
when Docker is available (upstream docker-compose uses `postgres:16`).

### Verified on this machine
- `twenty-front:build` ✅  ·  `twenty-server:build` ✅  ·  `twenty-emails:build` ✅
- Targeted unit tests (title-utils, timeline author, email rendering) ✅
- Server: `/healthz` 200, `/client-config` OK (password auth enabled) ✅
- Frontend: serves on 3001, `<title>ACHEARE CRM</title>`, manifest `ACHEARE`,
  ACHEARE favicon/logo/icon assets all 200 ✅
- Database: all instance migrations applied (`Instance commands completed`) ✅

### Upstream issues found (not ACHEARE-change issues)
1. **Upstream `main` does not build:** commit `b22709dd79` ("Move part
   class-name merging into shared utilities", #25621) moved
   `mergeFieldPartClassName` → `mergeClassNames` in
   `twenty-ui/src/utilities/internal/`, but the five Menu components added by
   the later commit `3af9f5d04d` (#25610) still import the removed module.
   Fix: updated the 5 imports under
   `packages/twenty-ui/src/surfaces/Menu/internal/` to use `mergeClassNames`.
2. **Workspace path with a space breaks the build:** this checkout lives under
   a directory containing a space (`…/PROJECTS/ACHEARE CRM/`). vite-plugin-checker
   spawns `tsc` by joining args into an unquoted shell string, so the tsconfig
   path splits at the space and tsc fails with `TS5042`. Fix: a tracked Yarn
   patch (`vite-plugin-checker-npm-0.10.2-*.patch` + resolutions in
   `package.json` and `packages/twenty-ui/package.json`) that spawns with an
   args array and no shell. This patch can be dropped once upstream fixes the
   quoting, or if the repo is moved to a space-free path.
3. **PostgreSQL 14 too old:** migration `2.34.0_EnforceTimelineActivityTypeEmitUniqueness…`
   uses `NULLS NOT DISTINCT` (Postgres ≥15). Local Postgres 16 was installed via
   Homebrew for the run; upstream docker-compose already uses `postgres:16`.

These three items are the only non-branding changes in this branch and are easy
to identify/drop when pulling upstream.

## 11. Automated validation

```bash
node scripts/check-remaining-twenty-references.mjs
```

Scans `twenty-front`, `twenty-emails`, `twenty-server` and classifies every
remaining "Twenty"/"twenty" occurrence into:
`LEGAL` · `I18N (generated catalogs)` · `INTERNAL (identifiers/names)` ·
`TESTS/FIXTURES/STORIES` · `NEEDS REVIEW`.

It is informational (never fails the build): legal text, generated i18n
catalogs, package identifiers and tests are expected to keep referencing
Twenty. The `NEEDS REVIEW` bucket is printed for a human to triage.

### Remaining Twenty references (current snapshot)

```text
Total occurrences (front/emails/server src): ~20,600 lines
Legal:                                   166   (LICENSE, DPA templates, Twenty.com PBC)
Internal (identifiers/names):         17,213   (twenty-* packages, TwentyConfig,
                                                oxlint rules, DB migrations, env vars,
                                                MCP connector names, URLs in comments)
i18n (generated catalogs):                91   (locale .po/.ts files — stale for changed
                                                strings; English falls back to the new
                                                source text)
Tests/fixtures/stories:                  718   (mock data, story examples)
Needs review:                          2,428   (mostly migration command titles, MCP
                                                setup texts, example emails/URLs in
                                                settings docs, Docker Hub link)
```

User-facing "Twenty" occurrences in the shipped product were all replaced
(§2). The `NEEDS REVIEW` bucket contains no core login/UI branding; it is
dominated by dev-facing MCP connector copy ("Add the Twenty MCP server…"),
example data (e.g. `tim@twenty.com` in the composite-field settings docs),
migration titles, and upstream URLs. Decide case-by-case before a public
launch.

## 12. Updating from upstream

```bash
git fetch origin
git checkout acheare/whitelabel
git merge origin/main          # or: git rebase origin/main
# re-verify:
corepack yarn install
corepack yarn nx run twenty-front:build
node scripts/check-remaining-twenty-references.mjs
```

Expected conflict surfaces (all small):
- `packages/twenty-front/index.html`, `public/manifest.json` (branding)
- `twenty-front/src/utils/title-utils.ts`, `SignInUp.tsx`, `FooterNote.tsx`
- `twenty-emails/src/components/*` and email templates
- `twenty-server/.../config-variables.ts` (`EMAIL_FROM_NAME`)
- `package.json` / `packages/twenty-ui/package.json` / `yarn.lock` (the
  vite-plugin-checker patch resolution — re-run `yarn install` after upstream
  bumps the plugin, and drop the patch if upstream fixes the quoting bug)
- `twenty-ui/src/surfaces/Menu/internal/*` — drop the 5-file fix once upstream
  repairs its own build.

The white-label philosophy: **keep internal identifiers upstream; reapply only
the visible-branding deltas.** When a string in a new upstream release mentions
Twenty in the UI, add it to the white-label set.

## 13. Known limitations

- **i18n catalogs are stale** for the changed English strings. Lingui falls
  back to the source text, so the UI renders ACHEARE correctly, but
  non-English catalogs still carry the old "Twenty" entries. Regenerate with
  `yarn nx run twenty-front:lingui:extract` (+ compile) when desired — note
  this rewrites all locale files.
- **Legal/privacy links** on the login footer still point to
  `twenty.com/legal/*` — replace with ACHEARE's own terms/privacy/DPA pages
  before launch.
- **Email assets/links** use `app.acheare.com` placeholders — configure the
  real domain + final logo before enabling an email provider.
- **Website/docs are not white-labeled** (`packages/twenty-website`,
  `packages/twenty-docs` remain upstream Twenty marketing sites).
- **MCP / developer tooling copy** still says "Twenty" (connector names are
  protocol identifiers — changing them breaks integration with upstream docs
  and tools).
- **No production deployment** was performed; nothing was pushed.

## 14. Next phases (NOT implemented)

Based on what this phase revealed, the recommended order for the next phases:

1. **Self-hosting architecture** — lock down the production run
   (docker-compose is the documented path; Postgres ≥16 + Redis).
2. **Authentication/SSO** — replace/extend Twenty's email+password login with
   ACHEARE's auth strategy (Supabase/SSO) once the branding is stable.
3. **Database architecture** — plan ACHEARE's data model on top of Twenty's
   metadata-driven schema.
4. **Object storage** — wire file/attachment storage to ACHEARE's target (R2/S3).
5. **Recruitment CRM data model** — build candidate/job/application objects as
   Twenty custom objects or workspace schema code.
6. **Oracle deployment** — deploy behind the chosen infrastructure.