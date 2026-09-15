# Achare Entity Mapping — Reuse vs Extend vs Create New

> **Mandatory pre-migration gate.** Every entity must be mapped before writing any migration.

---

## 1. Existing Twenty Standard Objects (REUSE)

These objects already exist and should be reused directly:

| Achare Entity | Twenty Object | Status | Action |
|---|---|---|---|
| Person | `person` | ✅ Exists | Extend with normalized fields |
| Company | `company` | ✅ Exists | Extend with company_type, legal_name |
| Opportunity | `opportunity` | ✅ Exists | Reuse as-is for CRM deals |
| Attachment | `attachment` | ✅ Exists | Reuse for file storage |
| Note | `note` | ✅ Exists | Reuse as-is |
| Task | `task` | ✅ Exists | Reuse as-is |
| Timeline Activity | `timelineActivity` | ✅ Exists | Reuse as-is |
| Workspace Member | `workspaceMember` | ✅ Exists | Reuse for workspace membership |

---

## 2. Existing Achare Recruitment Objects (REUSE)

These Achare-specific objects already exist in the codebase:

| Achare Domain Model | Achare Existing Object | Status | Action |
|---|---|---|---|
| Job Openings | `requirement` | ✅ Exists | Map `requirement` → `job_openings` concept |
| Candidate (person) | `candidate` | ✅ Exists | Map to `people` + `candidate_profiles` |
| Applications | `candidateSubmission` | ✅ Exists | Map to `applications` concept |
| Interviews | `interview` | ✅ Exists | Reuse, extend with participants |
| Candidate Skills | (inline on candidate) | ⚠️ Partial | Normalize to `candidate_skills` |
| Job Skills | (inline on requirement) | ⚠️ Partial | Normalize to `job_skills` |

---

## 3. Existing Achare HR Objects (REUSE)

| Achare Domain Model | Achare Existing Object | Status | Action |
|---|---|---|---|
| Employee | `employee` | ✅ Exists | Extend with `company_id`, `is_current` |
| Department | `department` | ✅ Exists | Extend with `parent_department_id` |
| Team | `team` | ✅ Exists | Reuse as-is |
| Designation | `designation` | ✅ Exists | Reuse as-is |
| Attendance Day | `attendanceDay` | ✅ Exists | Extend with `timezone` handling |
| Attendance Event | `attendanceEvent` | ✅ Exists | Reuse as-is |
| Leave Type | `leaveType` | ✅ Exists | Reuse as-is |
| Leave Request | `leaveRequest` | ✅ Exists | Reuse as-is |
| Leave Balance | `leaveBalance` | ✅ Exists | Reuse as-is |
| Roster Assignment | `rosterAssignment` | ✅ Exists | Reuse as-is |
| Shift | `shift` | ✅ Exists | Reuse as-is |
| Onboarding Item | `onboardingItem` | ✅ Exists | Reuse as-is |

---

## 4. Existing Achare Payroll Objects (REUSE)

| Achare Domain Model | Achare Existing Object | Status | Action |
|---|---|---|---|
| Salary Structure | `salaryStructure` | ✅ Exists | Extend with versioning fields |
| Payroll Period | `payrollPeriod` | ✅ Exists | Map to `payroll_runs` |
| Payslip | `payslip` | ✅ Exists | Extend with immutability |
| Payroll Adjustment | `payrollAdjustment` | ✅ Exists | Map to `payroll_item_components` |

---

## 5. Existing Achare Finance Objects (REUSE)

| Achare Domain Model | Achare Existing Object | Status | Action |
|---|---|---|---|
| Invoice | `invoice` | ✅ Exists | Reuse as-is |
| Payment | `payment` | ✅ Exists | Reuse as-is |

---

## 6. NEW Entities to Create

These entities do NOT exist in Twenty or Achare and must be created:

### 6.1 People Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Person Contexts | `person.contexts` | Already implemented as string array on person entity | ✅ **DONE** |
| Person Organization Roles | `person.roles` | Already implemented as string array on person entity | ✅ **DONE** |
| Person Status | `person.status` | Already implemented on person entity | ✅ **DONE** |
| Person External IDs | `personExternalId` | Import deduplication (Bullhorn, Zoho, CSV) | ✅ **DONE** |
| Person Normalized Fields | (extend `person`) | `emailNormalized`, `phoneNormalized` for dedup | ✅ **DONE** |

### 6.2 CRM Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Company | `company` | Already exists with Achare extensions | ✅ **DONE** |
| Opportunity | `opportunity` | Already exists, reused for deals | ✅ **DONE** |
| Company Person Relationships | `companyPersonRelationship` | Connect People to Companies | ✅ **DONE** |
| Company Locations | `companyLocation` | Multi-location support | **LOW** (design for later) |

### 6.3 Recruitment Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Requirement (Job Opening) | `requirement` | Already exists as Achare standard object | ✅ **DONE** |
| Candidate | `candidate` | Already exists as Achare standard object | ✅ **DONE** |
| Candidate Submission (Application) | `candidateSubmission` | Already exists as Achare standard object | ✅ **DONE** |
| Interview | `interview` | Already exists as Achare standard object | ✅ **DONE** |
| Application Stage History | `applicationStageHistory` | Pipeline audit trail | ✅ **DONE** |
| Interview Participants | `interviewParticipant` | Panel interview support | ✅ **DONE** |
| Placement | `placement` | Hiring/placement record | ✅ **DONE** |
| Job Status History | `jobStatusHistory` | Job lifecycle audit trail | **MEDIUM** — NOT YET BUILT |

### 6.4 HR Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Employee | `employee` | Already exists as Achare standard object | ✅ **DONE** |
| Department | `department` | Already exists as Achare standard object | ✅ **DONE** |
| Team | `team` | Already exists as Achare standard object | ✅ **DONE** |
| Designation | `designation` | Already exists as Achare standard object | ✅ **DONE** |
| Attendance Day | `attendanceDay` | Already exists as Achare standard object | ✅ **DONE** |
| Attendance Event | `attendanceEvent` | Already exists as Achare standard object | ✅ **DONE** |
| Leave Type | `leaveType` | Already exists as Achare standard object | ✅ **DONE** |
| Leave Request | `leaveRequest` | Already exists as Achare standard object | ✅ **DONE** |
| Leave Balance | `leaveBalance` | Already exists as Achare standard object | ✅ **DONE** |
| Roster Assignment | `rosterAssignment` | Already exists as Achare standard object | ✅ **DONE** |
| Shift | `shift` | Already exists as Achare standard object | ✅ **DONE** |
| Onboarding Item | `onboardingItem` | Already exists as Achare standard object | ✅ **DONE** |
| (None new needed) | — | — | — |

### 6.5 Payroll Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Salary Structure | `salaryStructure` | Already exists as Achare standard object | ✅ **DONE** |
| Salary Component | `salaryComponent` | Already exists — configurable earning/deduction/tax | ✅ **DONE** |
| Payroll Period | `payrollPeriod` | Already exists as Achare standard object | ✅ **DONE** |
| Payslip | `payslip` | Already exists as Achare standard object | ✅ **DONE** |
| Payslip Line | `payslipLine` | Already exists as Achare standard object | ✅ **DONE** |
| Payroll Adjustment | `payrollAdjustment` | Already exists as Achare standard object | ✅ **DONE** |
| (None new needed) | — | — | — |

### 6.6 Documents Domain

| Entity | Table | Purpose | Status |
|---|---|---|---|
| Attachment | `attachment` | Already exists — Twenty's file storage system | ✅ **DONE** |
| Document | `document` | Unified document metadata | **MEDIUM** — NOT YET BUILT |
| Document Link | `documentLink` | Polymorphic relationships | **MEDIUM** — NOT YET BUILT |

---

## 7. Migration Strategy

### 7.1 Principles

1. **Extend existing objects** — add fields to `person`, `company`, `employee`, `salaryStructure` via standard object field additions
2. **Create new standard objects** — for entities that don't exist (personContext, placement, etc.) using Twenty's standard object creation pipeline
3. **Preserve existing data** — all migrations must be additive, never destructive
4. **Universal identifiers** — every new object and field needs frozen UUIDs

### 7.2 Build Order

```
Phase 1: People normalized fields (email_normalized, phone_normalized)
Phase 2: CompanyPersonRelationship (CRM junction table)
Phase 3: ApplicationStageHistory + InterviewParticipant + Placement (Recruitment audit)
Phase 4: PersonExternalId (Import deduplication)
Phase 5: Document + DocumentLink (Unified document metadata)
```

### 7.3 What NOT to Create

- Do NOT create a new `person` table — already exists with `contexts`, `roles`, `status` fields
- Do NOT create a new `company` table — already exists
- Do NOT create a new `opportunity` table — already exists, reused for deals
- Do NOT create a new `employee` table — already exists as Achare standard object
- Do NOT create a new `department` table — already exists as Achare standard object
- Do NOT create a new `requirement` table — already exists (maps to job_openings)
- Do NOT create a new `candidate` table — already exists
- Do NOT create a new `candidateSubmission` table — already exists (maps to applications)
- Do NOT create a new `interview` table — already exists
- Do NOT create a new `salaryStructure` table — already exists
- Do NOT create a new `salaryComponent` table — already exists
- Do NOT create a new `payrollPeriod` table — already exists
- Do NOT create a new `payslip` table — already exists
- Do NOT create a new `leaveType` table — already exists
- Do NOT create a new `leaveRequest` table — already exists
- Do NOT create parallel auth, file storage, or workspace systems

---

## 8. Field Extensions on Existing Objects

### 8.1 Person

Already extended with:
- `contexts: string[]` — Person context classification ✅
- `roles: string[]` — Organization roles ✅
- `status: string` — Person status ✅
- `inHouse: boolean` — In-house flag ✅

Also extended with:

| Field | Type | Purpose | Status |
|---|---|---|---|
| `emailNormalized` | `string` | Lowercased, trimmed email for dedup | ✅ **DONE** |
| `phoneNormalized` | `string` | Digits-only phone for dedup | ✅ **DONE** |

### 8.2 Company

Add to existing `company` standard object:

| Field | Type | Purpose |
|---|---|---|
| `companyType` | `string` | `client`, `prospect`, `partner`, `vendor` |
| `legalName` | `string` | Legal entity name |
| `industry` | `string` | Industry classification |

### 8.3 Employee (Achare existing)

Add to existing `employee` standard object:

| Field | Type | Purpose |
|---|---|---|
| `isCurrent` | `boolean` | Whether this is the active employment |
| `companyId` | `relation` | FK to company for employment history |
| `timezone` | `string` | Work timezone for attendance |

### 8.4 Salary Structure (Achare existing)

Add to existing `salaryStructure` standard object:

| Field | Type | Purpose |
|---|---|---|
| `effectiveTo` | `date` | End of salary version (null = current) |

---

## 9. Verification

### 9.1 Automated checks run

| Check | Command | Result |
|---|---|---|
| Shared types | `npx tsgo --noEmit -p tsconfig.json` (twenty-shared) | ✅ clean |
| Server types | `npx tsgo --noEmit -p tsconfig.json` (twenty-server) | ✅ clean |
| Frontend types | `npx tsgo --noEmit -p tsconfig.json` (twenty-front) | ✅ clean |
| Metadata invariants | custom script over built `STANDARD_OBJECTS` | ✅ clean |

The metadata invariant check validates what the compiler cannot see
(relation targets are plain strings):

- every object / field / index universal identifier is a well-formed UUID
- no duplicate object or field universal identifiers (global uniqueness)
- every `viewFieldNames` entry in every declared view resolves to a real field
- every relation `targetObjectName` exists **and** its `targetFieldName`
  is declared as a field on that target object

Last run: **62 standard objects, 304 relation declarations, 0 problems.**

### 9.2 Still to verify manually

- [ ] Fresh workspace creation builds all standard objects
- [ ] Demo workspace creation builds all standard objects
- [ ] Workspace upgrade path (existing workspace → new objects) on a real DB
- [ ] Record-page UI renders the new relation panels

## 10. Known gaps after this pass

| Item | Notes |
|---|---|
| `jobStatusHistory` | Not built. Requirement lifecycle audit. |
| `document` / `documentLink` | Not built. Metadata-only design was prepared, but the object
needs an R2-backed upload pipeline before it is worth exposing; Twenty's existing
`attachment` object already covers file storage today. |
| `companyLocation` | Not built (intentionally deferred, per domain-model notes). |
| `company.companyType` / `legalName` / `industry` | Not added yet. |
| `employee.isCurrent` / `companyId` / `timezone` | Not added yet. |
| `salaryStructure.effectiveTo` | Not added yet. |
| `candidate_skills` / `job_skills` normalization | Still inline string arrays on `candidate` / `requirement`. |
| Dedup service | `emailNormalized` / `phoneNormalized` fields exist; the service that
populates and matches them on import is not implemented yet. |

### 10.1 Wiring recipe for the next standard object

Adding a standard object touches all of these; missing one breaks the build:

1. `packages/twenty-server/src/modules/<module>/standard-objects/<kebab-name>.workspace-entity.ts`
2. `twenty-shared/src/metadata/constants/standard-object-universal-identifiers.constant.ts`
3. `twenty-shared/src/metadata/constants/standard-object-fields.constant.ts`
4. `twenty-shared/src/metadata/constants/standard-object.constant.ts` (entry + views + indexes)
5. `.../twenty-standard-application/utils/field-metadata/compute-<camelName>-standard-flat-field-metadata.util.ts`
6. `.../utils/field-metadata/build-standard-flat-field-metadata-maps.util.ts` (import + registry)
7. `.../utils/object-metadata/create-standard-flat-object-metadata.util.ts`
8. `.../constants/search-fields-by-standard-object-name.constant.ts`
9. inverse relation field on each target object (fields constant + compute util + entity class)

Then rebuild `twenty-shared` **including declarations**, or downstream
packages keep resolving the previous build from `dist`:

```bash
cd packages/twenty-shared
npx vite build
npx tsgo -p tsconfig.lib.json --declaration --emitDeclarationOnly --noEmit false --outDir dist --rootDir src
npx tsc-alias -p tsconfig.lib.json --outDir dist
```
