# ACHEARE — Phase 0 Architecture Audit

**Branch:** `acheare/whitelabel` (fork of Twenty CRM)
**Repo:** `ACHEARE CRM/twenty-upstream`
**Audited:** 2026-09-11
**Purpose:** Establish ground truth before implementing workspace feature-composition onboarding, Setup Center, and Demo mode. No code was changed in this phase.

---

## 0. TL;DR

Achare already has a **working linear Achare onboarding** (11 fixed steps, server-persisted in `userVars`), a **real Achare data model** (recruitment + HR + payroll + finance standard objects), and a **dashboard provisioning service**.

What does **not** exist — and is the entire core of the master prompt — is the **workspace product-feature configuration layer**:

- no "select modules/features" step,
- no persisted workspace feature configuration,
- no dependency resolution,
- no feature-aware navigation / dashboards / search / command menu,
- no Setup Center,
- no Demo workspace or seeding,
- no feature→role/permission/dashboard mapping.

The existing onboarding is **linear-with-skips**, not **composition-driven**. That is the central gap.

---

## 1. Existing architecture (reused, must not be replaced)

Standard Twenty monorepo. Relevant packages:

| Package | Role |
| --- | --- |
| `twenty-server` | NestJS + GraphQL + TypeORM. Metadata engine, workspace lifecycle, standard objects. |
| `twenty-front` | React + Recoil + Apollo. Onboarding pages, navigation drawer, settings. |
| `twenty-shared` | `STANDARD_OBJECTS` registry + metadata constants (shared front/server). |
| `twenty-ui` | Design system (must be reused — no second design system). |

Key architectural facts:

- **Metadata-driven**: objects/fields/relations live in `twenty-shared/src/metadata/constants/standard-object.constant.ts` and are materialized per-workspace by the workspace-manager. New standard objects require metadata sync, not manual DB changes.
- **Per-workspace schema**: each workspace gets its own schema; standard objects are provisioned at workspace creation/activation.
- **Auth**: email+password via `auth.resolver.ts` (`signUp`, `signUpInWorkspace`). Workspace creation + activation handled by `workspace.service.ts` / `workspace.resolver.ts`.
- **State primitives available**: `userVars` (per user+workspace key/value), `WorkspaceEntity`, and Twenty's developer `FeatureFlag` system.

---

## 2. Existing onboarding flow

### 2.1 Two layers exist today

**Layer A — upstream Twenty onboarding** (preserved, untouched):
`OnboardingStatus` still contains `PLAN_REQUIRED, WORKSPACE_ACTIVATION, PROFILE_CREATION, SYNC_EMAIL, APPS_INSTALLATION, INVITE_TEAM, BOOK_CALL, COMPLETED`.

**Layer B — Achare onboarding** (added on top, the WIP):
`OnboardingStatus` was **extended** with `ACHARE_WELCOME … ACHARE_REVIEW`.

### 2.2 Achare steps (fixed, linear)

Defined in `onboarding/constants/acheare-setup-step-keys.ts`:

```
WELCOME → BASIC_SETUP → SETUP_CHOICE → AGENCY → TEAM
        → CRM_IMPORT → RECRUITMENT → HR → PAYROLL → DASHBOARD → REVIEW
```

- `SETUP_CHOICE` = Guided vs Manual. Manual calls `finishOnboarding()` immediately.
- `HR` and `PAYROLL` are skippable (tracked by `ACHARE_HR_SKIPPED` / `ACHARE_PAYROLL_SKIPPED`).
- State keys stored per `userId + workspaceId` via `UserVarsService`.

### 2.3 Server implementation

- `services/acheare-onboarding.service.ts` (424 lines) — progress read/write, `completeStep`, `skipStep`, `advanceToStep`, `finishOnboarding`, `getNextStep`.
- `acheare-onboarding.resolver.ts` (422 lines) — one mutation per step (`completeAchareBasicSetup`, `completeAchareTeamSetup`, …), guarded by `SettingsPermissionGuard(WORKSPACE)`.
- `services/acheare-dashboard-provisioning.service.ts` (276 lines) — provisions dashboards (Management/BDE/HR/Recruiter).
- `acheare-onboarding.module.ts` — wires the above.

### 2.4 Frontend implementation

- Pages in `twenty-front/src/pages/onboarding/`: `AchareWelcome`, `AchareBasicSetup`, `AchareSetupChoice`, `AchareAgency`, `AchareTeam`, `AchareCrmImport`, `AchareRecruitment`, `AchareHr`, `AcharePayroll`, `AchareDashboard`, `AchareReview`.
- Routing gate in `hooks/usePageChangeEffectNavigateLocation.ts` maps each Achare status → route.

### 2.5 Critical observation

**Onboarding progress is stored per-user, not per-workspace.** Feature composition (the master prompt's core) is inherently a *workspace* concern. `userVars` is the wrong home for it. → See §8.

---

## 3. Existing account / workspace flow

```
Landing/SignInUp (twenty-front)
   → signUp (auth.resolver.ts)  → user created (no workspace)
   → signUpInNewWorkspace       → workspace created + user attached as admin
   → workspace activation       → metadata materialized
   → OnboardingStatus gate → Achare onboarding pages
```

- Workspace creation/activation: `workspace.service.ts`, `workspace.resolver.ts`, `activate-workspace-input.ts`.
- `AchareBasicSetup` currently updates `workspace.displayName` directly from the resolver.
- Demo entry point (`Explore Demo`) does **not** exist anywhere.

---

## 4. Existing feature/module mechanisms

### 4.1 What exists

- **Twenty developer feature flags**: `feature-flag/services/feature-flag.service.ts`, `workspace-feature-flags-map-cache`, `admin-panel` + `lab` resolvers. These are per-workspace booleans for **unfinished development**.
- **Standard objects** registered in `twenty-shared/src/metadata/constants/standard-object.constant.ts` — all created for every workspace.

### 4.2 What does NOT exist

- **No workspace product-feature configuration** (`isFeatureEnabled(workspace, "PAYROLL")` style). Confirmed by search: no `featureConfig` / `workspaceFeature` / `enabledModules` / `featureSelection` anywhere.
- Per master prompt §65: developer feature flags are a **different concept** and must not be repurposed as customer module configuration.

**Conclusion: the workspace feature-configuration service/model is entirely greenfield.**

---

## 5. Existing HR / payroll / recruitment / finance state

Real standard objects already exist (from commit `d62594e27b`). Do **not** duplicate these (master prompt §125).

**Recruitment** (`modules/recruitment/`): `requirement`, `candidate`, `candidateSubmission`, `interview` + `candidate-conversion.service.ts`.

**HR** (`modules/hr/standard-objects/`): `employee`, `department`, `team`, `designation`, `location`, `shift`, `rosterAssignment`, `onboardingItem`, `attendanceEvent`, `attendanceDay`, `attendanceCorrection`, `leaveType`, `leaveRequest`, `leaveBalance`, `announcement`, plus `invoice` / `payment` entities living here.
Services: `attendance.service.ts`, `leave.service.ts`, `salary.service.ts`, `payroll-calculation.service.ts`, `payroll-lifecycle.service.ts`, `employee-lifecycle.service.ts`, `roster.service.ts`, `my-workspace.service.ts`.

**Payroll** (in `modules/hr/standard-objects/`): `salaryStructure`, `salaryComponent`, `payrollPeriod`, `payslip`, `payslipLine`, `payrollAdjustment`.

**Finance** (`modules/finance/`): `invoice`, `payment` + `invoice.service.ts`.

**Navigation already declares all folders**: `myWork, crm, recruitment, team, hr, payroll, documents, finance, analytics, admin, workflows` with child items for every object — created for **every** workspace, unconditionally.

**This is the key integration point:** navigation/dashboards are currently static and module-agnostic. Feature composition must make them dynamic.

---

## 6. Existing demo / seed mechanisms

- No demo workspace, no `Explore Demo` entry, no demo seeding service, no demo reset.
- Only upstream Twenty's onboarding app-installation job (`install-onboarding-apps.job.ts`) exists, which is unrelated.
- Seeding is effectively greenfield.

---

## 7. Exact implementation gaps (ordered)

| # | Gap | Master-prompt refs |
| --- | --- | --- |
| G1 | Workspace feature-configuration model + persistence (per-workspace, not per-user) | §11, §105 |
| G2 | Feature catalogue + dependency graph (Payroll→Employee, Attendance→Employee, …) | §9, §10, §106 |
| G3 | Feature-selection onboarding step (card UI, presets, dependency warnings) | §7, §8, §83–86 |
| G4 | Dynamic onboarding step generation from selected features | §18, §19 |
| G5 | Feature-aware navigation (hide disabled folders/items) | §12, §52 |
| G6 | Feature-aware dashboards / Home | §31, §53, §57, §100, §101 |
| G7 | Feature-aware global search + command menu | §55, §56, §103, §104 |
| G8 | Feature-aware permissions/role initialization | §29, §54, §109 |
| G9 | Setup Center (post-onboarding admin config) | §17, §66 |
| G10 | Demo workspace + connected seed data + demo users + reset/isolation | §34–§43, §96–§99 |
| G11 | Feature enable/disable API + safety (never delete data) | §16, §108 |
| G12 | Migration/defaults for existing workspaces | §63, §64 |
| G13 | Idempotency + transaction safety of config ops | §50, §51 |

---

## 8. Proposed data model

### 8.1 Workspace feature configuration (G1)

Persist **per workspace**. Options ranked:

1. **Preferred — a dedicated workspace-level metadata record** (e.g. `workspaceFeatureConfiguration` object or a JSON column on `WorkspaceEntity`), so it is queryable, cacheable, and available to metadata-driven nav generation.
2. Acceptable — `userVars` keyed by workspace with a synthetic system user, but this is a hack and misaligns ownership.
3. Rejected — `localStorage` (explicitly forbidden by §11).

Recommended shape:

```
WorkspaceFeatureConfiguration
  workspaceId (unique)
  enabledFeatures: FeatureKey[]        // e.g. ['CRM','RECRUITMENT','HR','PAYROLL']
  featureSettings: JSONB               // per-feature config payload
  setupVersion: number
  updatedAt
```

### 8.2 Feature catalogue + dependencies (G2)

Single source of truth, shared front+server (place in `twenty-shared`):

```
FeatureKey = CRM | RECRUITMENT | TEAM | HR | ATTENDANCE | LEAVE | ROSTERS
           | PAYROLL | FINANCE | DOCUMENTS | COLLABORATION | ANALYTICS

dependencies: {
  PAYROLL:    [TEAM/EMPLOYEE, SALARY],
  ATTENDANCE: [EMPLOYEE],
  LEAVE:      [EMPLOYEE],
  ROSTERS:    [EMPLOYEE],
  PAYSLIPS:   [PAYROLL],
  SUBMISSIONS:[CANDIDATES, REQUIREMENTS],
  INTERVIEWS: [CANDIDATES, REQUIREMENTS],
}
```

Plus per-feature: display name, description, icon, nav folder UUID, object list, dashboard keys, role keys.

### 8.3 Mapping tables (G5–G8)

Centralised maps (not scattered): `feature → navigation items`, `feature → dashboards`, `feature → roles/permissions`, `feature → search entities`, `feature → command-menu actions`, `feature → onboarding step`.

---

## 9. Proposed API changes

New `WorkspaceFeatureService` + GraphQL surface (follow existing conventions, §107):

```
query  workspaceFeatures                    → { enabledFeatures, settings, setupStatus }
query  featureCatalog                       → catalogue + dependencies
mutation setWorkspaceFeatures(input)        → validates + resolves dependencies + persists
mutation enableWorkspaceFeature(key)        → idempotent, initializes config
mutation disableWorkspaceFeature(key)       → hides only, preserves data (§108)
query  achareOnboardingSteps                → dynamic step list from features
query  achareSetupStatus                    → Setup Center progress
```

Extend existing `AchareOnboardingResolver` with a feature-selection step; do not create a parallel onboarding engine (§62).

---

## 10. Proposed frontend changes

- New onboarding step: `AchareFeatureSelection` (card grid + presets + dependency notices) inserted after `BASIC_SETUP`.
- `usePageChangeEffectNavigateLocation` → drive from **dynamic step list**, not the fixed `ACHARE_SETUP_STEPS_ORDER`.
- Navigation drawer → filter by `workspaceFeatures`.
- Home/dashboards → filter widget modules by enabled features.
- Command menu + global search → filter by enabled features.
- New Setup Center under Settings (Admin): Company / Features / Team / HR / Payroll / Finance / Documents / Imports / Dashboards.
- New auth entry: `Explore Demo`.
- Reuse `twenty-ui` throughout (§80, §112).

---

## 11. Migration strategy

- **Existing workspaces**: infer enabled features from present data (CRM on; Recruitment/HR/Payroll/Finance/Documents on if objects/data exist). Never auto-disable existing functionality (§64).
- Write a versioned default (`setupVersion`) so old workspaces get a safe config without user action (§63).
- Nav items must not disappear for existing customers unexpectedly — default-on for anything already in use.
- Deliver as a workspace migration command under `workspace-migration`, consistent with upstream patterns (§95).

---

## 12. Testing strategy

- Unit: dependency resolution, feature→nav mapping, idempotent enable/disable, `getNextStep` with feature filtering.
- Integration: `WorkspaceFeatureService` persistence + migration defaults.
- E2E (real signup, §69, §93): fresh account → workspace → feature selection → onboarding → working workspace, for combinations A–E (§70).
- Dependency tests (§71), disable/re-enable data-preservation tests (§72), interruption/resume tests (§73).
- Demo tests (§75, §123): open demo → drill Company→Requirement→Candidate→Employee→Attendance→Payroll→Payslip→Document.
- Regression (§124): existing CRM, recruitment, existing workspaces, permissions.

---

## 13. Recommended build order (from gaps)

```
Phase 1  Feature catalogue + dependencies + WorkspaceFeatureConfiguration + service/API   (G1,G2,G11,G13)
Phase 2  Dynamic navigation                                                               (G5)
Phase 3  Dynamic dashboards / Home                                                        (G6)
Phase 4  Feature-selection step + dynamic onboarding steps                                (G3,G4)
Phase 5  Setup Center                                                                     (G9)
Phase 6  Live signup verification (no mocks)                                              (G12)
Phase 7  Demo workspace + seeding + users + reset                                         (G10)
Phase 8  End-to-end testing                                                               (§70–§75)
```

Phases 1–3 are the true foundation; everything else depends on the feature-configuration service existing first.

---

## 14. Risks / watch-outs

1. **Two onboarding state machines** — the fixed `ACHARE_SETUP_STEPS_ORDER` must be replaced by a dynamic generator, not run alongside (§62).
2. **Per-user vs per-workspace** — current state ownership is wrong for feature config; fix at the model level.
3. **Static nav constant** — `standard-navigation-menu-item.constant.ts` provisions everything; making it conditional touches workspace materialization. Needs care for existing workspaces.
4. **Don't duplicate objects** — recruitment/HR/payroll/finance objects already exist (§125).
5. **Data safety on disable** — visibility only, never deletion (§16, §108).
6. **AGPL** — white-label hosted service carries source-availability obligations (see `ACHEARE-WHITE-LABEL.md` §8).

---

## 15. Implementation log (appended after Phase 0)

Kept here so the build order above stays the single plan of record.

### Phase 1 — feature catalogue + configuration service (G1, G2, G11, G13) ✅
- Catalogue, module definitions, dependency graph, presets and onboarding-step mapping live in `packages/twenty-shared/src/workspace/` (types / constants / utils).
- `WorkspaceFeatureService` + `WorkspaceFeatureResolver` + DTOs in `packages/twenty-server/src/engine/core-modules/workspace-feature/`.
- **Persistence reuses the existing `keyValuePair` table** — one workspace-scoped row (`userId = null`, `type = CONFIG_VARIABLE`, key `ACHARE_WORKSPACE_FEATURES`). No new table, no migration, no parallel config infrastructure (§11).
- `getConfiguration` falls back to an all-on default, so existing workspaces never lose anything (§64).

### Phase 2 — dynamic navigation (G5) ✅
- `getAchareFeatureForStandardObject` / `isAchareStandardObjectEnabled` in the shared catalogue.
- `filterAndSortNavigationMenuItems` takes an optional `enabledAchareFeatures`; `useNavigationMenuItemsByFolder` also drops now-empty workspace folders. `undefined` = no filtering, so nothing changes for unconfigured workspaces.
- Frontend query hook `useAchareEnabledFeatures` returns `undefined` while loading, so the drawer is never briefly emptied.

### Phase 3 — dynamic dashboards / Home (G6) ✅
- `getDisabledAchareStandardObjectKeys` + `isAchareDashboardEnabled` in the shared catalogue (one rule, shared by server and frontend).
- **Widgets**: `WidgetVisibilityContext` gained `hiddenObjectMetadataIdsForDisabledFeatures`, resolved once in `useWidgetVisibilityContext` and applied in `filterVisibleWidgets` — reusing the existing visibility mechanism, so dashboards and record pages filter identically.
- **Home**: `useDefaultHomePagePath` no longer falls back to an object gated by a disabled feature.
- **Provisioning**: `AchareDashboardProvisioningService` skips dashboards whose every widget belongs to a disabled module; the onboarding resolver passes the workspace's enabled features.

### Phase 4 — feature selection + dynamic onboarding steps (G3, G4) ✅
Onboarding is no longer a fixed linear wizard: the admin picks modules, and the wizard, the step order and the redirects are generated from that selection.

**One step vocabulary, no data migration.** `AchareOnboardingStepKey` (shared) and the server's persisted `AchareSetupStep` were collapsed into a single type using the step names the server already persisted. `ACHARE_SETUP_STEPS_ORDER` (the fixed state machine) is **deleted**, not run alongside — `AchareOnboardingService.getStepOrder` now delegates to `WorkspaceFeatureService.getOnboardingSteps`.

- **Shared**: `getNextAchareOnboardingStep` (step-list lookup); `ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS`, `ACHARE_ONBOARDING_STEP_APP_PATH`, `ACHARE_ONBOARDING_STATUS_TO_STEP`, `ACHARE_MODULE_ONBOARDING_STEPS`, `ACHARE_ONBOARDING_STEP_LABEL`; new `AppPath.AchareFeatureSelection` / `AchareFinance` / `AchareDocuments`.
- **Server**: new `completeAchareFeatureSelection` (persists the composition via `WorkspaceFeatureService.setEnabledFeatures`, including `presetKey`), `completeAchareFinanceSetup`, `completeAchareDocumentsSetup`; every completion mutation now funnels through one `advanceToNextStep` helper, so enabling/disabling a module changes the wizard without touching the resolver. `skipStep` rejects non-skippable steps (`STEP_NOT_SKIPPABLE`). Fixed a real bug: `startOnboarding` rewound *completed* workspaces back to `WELCOME`.
- **Frontend**: new `AchareFeatureSelection` page (preset cards, per-module toggles, dependency notice, and a live preview of the generated step list), plus `AchareFinance` / `AchareDocuments` built on a shared `AchareModuleSetupStep` — a new module step is now a data change, not a new page. `useSetNextOnboardingStatus` walks the workspace's own `onboardingSteps` instead of an if-chain (with the full canonical wizard as the not-yet-loaded fallback), and now refuses to rewind a status the server already advanced past. `usePageChangeEffectNavigateLocation`'s 11 hand-written Achare `if` blocks were replaced by a single generated rule off the shared vocabulary. `AchareReview` lists the modules the workspace actually composed.
- **Deleting a feature never deletes data** (§64): the module setup steps only hide navigation; the pages say so explicitly.

### Phase 5 — Setup Center (G9) ✅
The existing `Settings → Setup Center` page was a read-only list of **11 hardcoded** steps with hardcoded labels — it predated the dynamic generator and had already gone stale (no `FEATURE_SELECTION`, `FINANCE` or `DOCUMENTS`). It is now a real configuration hub with two jobs:

- **Honest progress.** The step list comes from the workspace's own generated `onboardingSteps` and labels from the shared `ACHARE_ONBOARDING_STEP_LABEL`, so the Setup Center and the wizard can never disagree again. Each step shows Completed / In progress / Skipped / Not started, plus a "N of M steps done" summary.
- **Feature composition after the fact.** An admin can toggle modules and individual features and save via `setWorkspaceFeatures`.

**One editor, two callers.** The module/feature list was extracted into `AchareFeatureCompositionEditor`, shared by onboarding's feature-selection step and the Setup Center. It renders the per-feature chips as read-only tags when no `onToggleFeature` is passed and as toggles when it is — so the two screens cannot drift on what a module contains or what "partially selected" means. The onboarding page gained per-feature toggles as a side effect.

**Disabling is dependency-aware and never destructive.** Dependencies are one-directional and `setEnabledFeatures` resolves them on the way in, which means a naive "remove Employees" would be silently re-added while Payroll is on. The Setup Center therefore:
- resolves the draft through `resolveAchareFeatureDependencies` and saves the **effective** set, so the preview matches exactly what gets stored;
- shows a warning naming each feature that came back and **which enabled features require it** (`getAchareDependentFeatures`), so the admin knows to turn Payroll off first rather than wondering why the toggle didn't take;
- shows what will be added on top of the selection;
- states plainly that turning a module off only hides it — no records, files or history are deleted (§64).

**GraphQL**: `setWorkspaceFeatures` document + hook, with the `AchareWorkspaceFeatureMutationSuccess`, `SetAchareWorkspaceFeaturesInput`, `Mutation.setWorkspaceFeatures` field, `MutationSetWorkspaceFeaturesArgs`, operation types and `SetWorkspaceFeaturesDocument` hand-mirrored. `enableWorkspaceFeature` / `disableWorkspaceFeature` remain server-side for programmatic callers but are deliberately not used by the UI — `setWorkspaceFeatures` covers both directions in one round trip and the shared dependency graph keeps the two sides in agreement.


### Verification workflow for this fork (learned the hard way)
1. `npx nx run twenty-shared:build` — the frontend/server resolve `twenty-shared/*` from `dist`, so new exports are invisible until this runs. It also re-runs `generateBarrels`.
2. **`npx nx run twenty-sdk:build` — required whenever `AppPath` (or another shared enum) changes.** `rollup-plugin-dts` *inlines* a copy of the enum into `packages/twenty-sdk/dist/front-component/index.d.ts`. TypeScript only treats two enum declarations as interchangeable while their members are identical, so a stale SDK dist turns every `navigate(AppPath.X, …)` call in `useFrontComponentExecutionContext` into a type error. This is what produced 6 phantom errors before the SDK was rebuilt.
3. `NODE_OPTIONS="--max-old-space-size=12288" npx tsc -p tsconfig.json --noEmit` per package. Do **not** use `nx run twenty-*:typecheck` — it depends on `^build` and dies in this environment on `SAFE_DELETE_BULK_CONFIRM_REQUIRED`.
4. `npx jest --config jest.config.mjs <pattern>`; the shared standard-object snapshot needs `-u` after any deliberate `STANDARD_OBJECT_FIELDS` change.

### Phase 6 — metadata close-out, HR self-service, payroll tests, roles, search ✅ (2026-09-12)

Closed the outstanding items from the HR/Payroll gap report and the metadata workarounds taken on 2026-09-12.

**Metadata (Phase 2).** The five fields whose builders were missing are now built and back in views: `department.departmentHead`, `attendanceDay.shift`, `onboardingItem.assignedTo`, `attendanceCorrection.reviewedBy`, `leaveRequest.reviewedBy` — each with its reverse side on `workspaceMember`/`shift` (`onboardingItems`, `attendanceCorrections`, `leaveRequests`, `departments`, `attendanceDays`). The workaround that removed those fields from `allAttendanceDays`, `allOnboardingItems`, `allAttendanceCorrections`, `allLeaveRequests`, `departmentRecordPageFields` etc. is reverted, so the record pages show the relations again. `employee.manager`, `team.department` and `team.teamLead` stay allowlisted as declared-but-not-built: Twenty's standard-app builder has no self-relation/reverse-field support for them yet.

**Self-service frontend (Phase 3).** `myWorkspaceData` returned only counts. It now returns the underlying lists (pending leave requests, leave balances with an `available` total, recent payslips with currency-formatted net pay, active announcements) and `MyWorkspacePage` renders them under My Leave / My Payslips / Announcements sections.

**API surface (Phase 4).** `MyWorkspaceService.publishAnnouncement` / `getAnnouncementsForEmployee` were unreachable: they are now exposed through a new `AnnouncementResolver` (`publishAnnouncement`, `announcementsForEmployee`) registered in `HrModule`. The first service-level tests for this domain were added (`payroll-calculation.service.spec.ts`, 9 cases) using an in-memory workspace repository harness.

**Two real bugs found and fixed.**
- **Payroll proration overstated.** `daysBetween` did a raw millisecond diff + 1 over a period that ends at `…T23:59:59Z`, so a *full* month prorated at 32/31 (every payslip paid ~3.2% extra) and the day count also depended on the server timezone. It now counts inclusive calendar days across UTC day boundaries.
- **Reviewer attribution.** `approveLeave` / `rejectLeave` / `reviewAttendanceCorrection` passed `user.id` into `reviewedById`, which is a `workspaceMember` relation. They now use `@AuthWorkspaceMemberId()`.

**Roles (Phase 5).** Non-admin standard roles are now shipped with every workspace: `Recruiter`, `HR Manager`, `Finance`, with deterministic universal identifiers (`getRoleUniversalIdentifier`). Object-level and field-level permissions are *not* part of the standard-app sync pipeline (`TWENTY_STANDARD_ALL_METADATA_NAME` carries `role` but not `objectPermission`/`fieldPermission`), so per-object/per-field grants remain workspace configuration in Settings → Roles. Extending the pipeline is the next step for real least-privilege defaults.

**Search (Phase 6).** The HR objects were already indexed, but several had a UUID-only search field. `employee.workLocation`, `leaveRequest.reason`, `attendanceCorrection.reason`/`reviewNotes`, `payslip.paymentReference`, `payment.reference`/`notes`, `invoice.notes` were added to `SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME`.

**Verified.** `twenty-shared:build` + 235 suites / 1905 tests green (one snapshot updated), `twenty-server` parity + standard-application + hr suites green (18 suites / 87 tests), `twenty-server` and `twenty-front` typecheck showing only the pre-existing upstream errors.

### Deliberate deferrals
- **Dashboard-record-level hiding** (beyond widget level) is still open: widgets are filtered, but a dashboard that is *entirely* gated is hidden rather than deleted, and there is no per-dashboard management UI. The Setup Center now manages features but not dashboards.
- `generated-metadata/graphql.ts` was hand-mirrored (codegen needs a live server). **Re-run `codegen-metadata.cjs` with the server up to confirm no drift.**
- `AchareModuleSetupInputDTO` only carries `skipSetup`: the Finance/Documents wizard steps confirm or skip, and their real settings still live in Settings. The Setup Center manages *whether* those modules are on, not their internals.
- The Setup Center has no per-step "re-run this step" affordance. Navigating to a wizard route while `onboardingStatus` is `COMPLETED` is immediately redirected away by `usePageChangeEffectNavigateLocation`, so a real re-entry needs a dedicated "restart from step N" mutation rather than a link.
- `enableWorkspaceFeature` / `disableWorkspaceFeature` are implemented and tested server-side but unused by the UI (see Phase 5).

