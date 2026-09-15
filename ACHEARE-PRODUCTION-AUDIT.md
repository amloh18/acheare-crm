# ACHEARE — Production Readiness Audit

**Scope:** Achare data model (built by extending Twenty CRM) + Achare Smart Roles / permission architecture.
**Mode:** Read-only research. **No database or schema change was made for this audit.**
**Audited:** 2026-09-15
**Repo:** `ACHEARE CRM/twenty-upstream` (fork of Twenty; branch carries the Achare entity work)

---

## 0. Verdict

The Achare domain model is **structurally sound but not production-ready**. The core modelling decision — one canonical `person`, with `employee`, `candidate`, `candidateSubmission` (application), `requirement` (job), `interview`, `placement` hanging off it — is correct and matches the frozen plan.

What blocks production is **not missing entities**. It is five classes of defect, all verified in the source:

| # | Defect class | Severity | Customer impact |
|---|---|---|---|
| 1 | **Money stored as floating point** (`NUMBER` → Postgres `float`) across payroll, salary, invoice and payment | **CRITICAL** | Payslip and invoice totals drift by paise/rupees; audit reconciliation fails |
| 2 | **`leaveBalance` stores `entitled` / `used` / `pending` as `TEXT`** | **CRITICAL** | Leave balances cannot be summed, accrued, carried forward, or audited |
| 3 | **Relations declared but never materialized** (`employee.manager`, `team.department`, `team.teamLead`) | **CRITICAL** | Manager hierarchy and team↔department do not exist at runtime |
| 4 | **16 HR/payroll objects cannot carry attachments, tasks, notes or timeline activity** | **HIGH** | Payslips, payroll periods, leave requests cannot store documents — kills the Documents requirement |
| 5 | **No link between the HR identity graph and the login identity** (`employee`/`person` → `workspaceMember` absent) | **HIGH** | Employee self-service ("see only my payslip") is not expressible with row-level permissions |

Plus two structural process defects that will keep producing defects of class 3 and 5:

- The index-builder registry is typed **optional**, so the compiler never forces a new object to ship its indexes. **7 objects declare indexes that will never be created.**
- The field-builder return type is **loose** on 24 objects, so a declared field that is never instantiated compiles clean. This is exactly how `employee.manager` and 87 other fields went missing.

The **permission architecture is a different story**: Twenty already ships a complete, server-enforced RBAC engine (role → object → field → row-level → permission flags → record shares → invitations). Achare should **configure and seed** it, not build a parallel system. The gap is that the four seeded Achare roles are functionally identical and uneditable, so payroll is not actually gated from a Recruiter today.

---

## 1. Method & evidence base

Everything below was derived by reading the repository, not screenshots.

**Primary evidence (authoritative, machine-read):**

- `packages/twenty-shared/dist/metadata.cjs` → `STANDARD_OBJECTS` (the built metadata registry that the front and server both consume).
- The `compute-*-standard-flat-field-metadata.util.ts` builders on disk (the field definitions actually materialized per workspace).
- `utils/index/build-standard-flat-index-metadata-maps.util.ts` — the registry that decides which indexes exist.
- `workspace-migration/workspace-migration-runner/utils/field-metadata-type-to-column-type.util.ts` — the field-type → Postgres-column contract.
- The metadata entities: `role`, `role-target`, `object-permission`, `field-permission`, `permission-flag`, `role-permission-flag`, `row-level-permission-predicate`, `record-share`.
- `engine/twenty-orm/repository/permissions.utils.ts` and `engine/twenty-orm/utils/compute-permission-intersection.util.ts` — the enforcement layer.
- `engine/core-modules/file-storage/**` and `engine/core-modules/file/entities/file.entity.ts` — storage.

**Reproduce:** the audit scripts are in `/tmp/acheare-audit.cjs`, `/tmp/acheare-gapcheck.cjs`, `/tmp/acheare-indexcorrect.cjs`, `/tmp/acheare-crosscheck.cjs`, `/tmp/acheare-viewcheck.cjs`. They are read-only and emit `/tmp/acheare-inventory.json`.

**Scale of the surface:** 62 standard objects, 296 relation declarations, 304 validated relation endpoints.

---

## 2. Twenty architecture facts (the contract any change must obey)

These are not opinions; they are constraints discovered in code. Any Achare change that violates them will silently fail rather than error.

### 2.1 Objects and fields are metadata, materialized per workspace

- Objects/fields/relations live in `twenty-shared` metadata constants and are materialized into a **per-workspace Postgres schema** by the workspace-manager. You do not hand-write DDL for a standard object.
- The authoritative field definition for runtime is the `compute-<object>-standard-flat-field-metadata.util.ts` builder, **not** the `standard-object-fields.constant.ts` declaration. A field declared in the constant but absent from the builder **is never created**.
- `createStandardFieldFlatMetadata` and `createStandardRelationFieldFlatMetadata` are the only two constructors.

### 2.2 A relation needs both sides to exist

A relation field is only created when its inverse is resolvable. A "side-effect" relation such as `payslip.attachments` requires `attachment.targetPayslip` (or the generic target join) to exist. Declaring only one side produces **no field at all** — no error, no log.

### 2.3 Field type → Postgres column type is fixed

From `field-metadata-type-to-column-type.util.ts`:

| FieldMetadataType | Column type |
|---|---|
| `UUID` | `uuid` |
| `NUMERIC` | `numeric` — **rejected for user field creation** ("Use NUMBER instead") |
| `NUMBER`, `POSITION` | **`float`** |
| `DATE` | `date` |
| `DATE_TIME` | `timestamptz` |
| `CURRENCY` (composite) | `amountMicros NUMERIC` + `currencyCode TEXT` |
| `SELECT` / `MULTI_SELECT` | `enum` |
| `FILES`, `RAW_JSON` | `jsonb` |
| `TS_VECTOR` | `tsvector` |

**Consequence:** the only exact-money primitive available to Achare is `CURRENCY` (integer micros). `NUMBER` is IEEE float. `NUMERIC` cannot be created by users.

### 2.4 Indexes require an explicit builder registered in a map

`build-standard-flat-index-metadata-maps.util.ts` holds `STANDARD_FLAT_INDEX_METADATA_BUILDERS_BY_OBJECT_NAME`, typed:

```ts
satisfies { [P in AllStandardObjectName]?: StandardIndexBuilder<P> };
```

The `?` makes coverage **optional**. Declaring indexes in metadata without registering a builder creates **nothing**. There is no generic fallback, and no other code path derives indexes from metadata.

### 2.5 Composite unique indexes work; arbitrary CHECK constraints do not

- Composite unique indexes are proven in production metadata: `employeeCodeUniqueIndex`, `employeeWorkDateUniqueIndex` (attendanceDay), `candidateRequirementUniqueIndex` (candidateSubmission), `periodEmployeeUniqueIndex` (payslip), `employeeTypeYearUniqueIndex` (leaveBalance), `structureNameUniqueIndex`, `nameUniqueIndex` (payrollPeriod), `invoiceNumberUniqueIndex`.
- `@Check` exists on **core** entities (e.g. `file`, `roleTarget`) but is not exposed for standard workspace objects.
- **Therefore:** date ordering (`effectiveFrom < effectiveTo`), status transitions, and cross-field arithmetic must be enforced in services and covered by tests. Prefer a composite unique index wherever the rule is "at most one".

### 2.6 Object history, soft delete, ids, timestamps

- Every standard object extends `BaseWorkspaceEntity`: `id`, `createdAt`, `updatedAt`, `deletedAt`, plus `position`, `createdBy`, `updatedBy`, `searchVector`.
- `id` = `uuid` PK (`gen_random_uuid()` / `uuid_generate_v4()`).
- Timestamps = `timestamptz`, `createdAt` / `updatedAt` automatic, `updatedBy` / `createdBy` = `ACTOR`.
- Soft delete via `deletedAt` is uniform.
- **There is no generic audit/change-log table.** Searches for `audit|changelog|revision|history` entities return nothing. `timelineActivity` is an *activity feed*, not an audit log, and has a fixed set of `target*` relations.

### 2.7 Workspace isolation

- Every tenant-owned record carries `workspaceId` and lives in the workspace schema.
- Isolation is enforced in the **ORM layer**, not by Postgres RLS (no `ENABLE ROW LEVEL SECURITY` anywhere).
- `engine/twenty-orm/repository/permissions.utils.ts` applies permission checks on every read/write/soft-delete/destroy.
- `compute-permission-intersection.util.ts` intersects permissions when a principal has several role sources.
- Risk surface: raw SQL, background jobs, the workflow executor (which resolves `authContext.application.defaultRoleId`), imports/exports, and any use of a non-workspace-scoped repository.

### 2.8 Storage

- `attachment` is a standard object holding `file: FileOutput[]` (fileId, label, extension), `fileCategory`, `type`, `fullPath`, `createdBy`/`updatedBy`, plus explicit `target*` relations.
- Binary content lives in the `file` core entity: `workspaceId`, `applicationId`, `path`, `size` (`bigint`), `mimeType`, `status` (`UPLOADED`/`PENDING`), `settings jsonb`, `deletedAt`; unique on `(workspaceId, applicationId, path)`.
- Drivers: `local.driver.ts`, `s3.driver.ts`, `validated-storage.driver.ts`, behind `StorageDriver`.
- The S3 driver accepts `bucketName`, `region`, **`endpoint`**, and optional presign endpoint → **Cloudflare R2 works as-is over the S3-compatible driver**; this is configuration, not new code.
- `getFileMetadata` returns `{ size, checksum? }` where checksum is the backend's version identity (an S3 ETag). **There is no persisted checksum column** — checksum is read-time only.

---

## 3. Object inventory and domain classification

62 standard objects. Achare adds the domain objects; the rest are Twenty platform/CRM/messaging/workflow objects.

| Domain | Objects |
|---|---|
| **PLATFORM** | workspaceMember, attachment, note, noteTarget, task, taskTarget, timelineActivity, dashboard, workflow, workflowAutomatedTrigger, workflowRun, workflowVersion, recordShare, blocklist |
| **MESSAGING (platform)** | message, messageCampaign, messageList, messageListMember, messageParticipant, messageThread, messageChannelMessageAssociation, messageChannelMessageAssociationMessageFolder, calendarChannelEventAssociation, calendarEvent, calendarEventParticipant, calendarEventTarget, callRecording, messageThreadTarget |
| **IDENTITY** | person, personExternalId, companyPersonRelationship |
| **CRM** | company, opportunity, invoice, payment |
| **RECRUITMENT** | candidate, requirement, candidateSubmission, interview, interviewParticipant, placement, applicationStageHistory |
| **HR** | employee, department, designation, location, team, onboardingItem, announcement, comment, notification |
| **ATTENDANCE** | attendanceEvent, attendanceDay, attendanceCorrection, shift, rosterAssignment |
| **LEAVE** | leaveType, leaveBalance, leaveRequest |
| **PAYROLL** | salaryStructure, salaryComponent, payrollPeriod, payslip, payslipLine, payrollAdjustment |
| **DOCUMENTS** | attachment (shared with PLATFORM) |
| **ANALYTICS** | dashboard (shared with PLATFORM) |

### 3.1 Objects crossing domain boundaries unnecessarily

| Object | Problem | Recommendation |
|---|---|---|
| `invoice`, `payment` (placed in `modules/hr`) | Finance objects live inside the HR module; `requirement.invoices` and `candidateSubmission.placementFee` tie billing into recruitment | Physically relocate to a `finance` module. `modules/finance/` exists and is **empty** — this looks like an unfinished move |
| `candidate.currentCompany` / `currentDesignation` (TEXT) | Duplicates `company` and `designation` domains as free text, so a candidate's employer is not a real company record | Keep as denormalized cache or convert to relations; do not let it become a second company directory |
| `interview.interviewer` (TEXT) **and** `interview.interviewParticipants` (relation) | Two sources of truth for who interviews | Drop the TEXT field; make participants authoritative |
| `candidate.name` (TEXT) | Duplicates `person.name` (`FULL_NAME`) | Derive from person; never store both |
| `person.roles` (MULTI_SELECT) | Named `roles` but is a *business* role label, while the RBAC engine has `role` / `roleTarget` as *security* roles | Rename to `businessRoles` to prevent a permanent naming collision with the Smart Roles work |
| `timelineActivity` holds ~20 explicit `target*` relations across every domain | Growing join object; adding an object means editing the join object | Accept for now; cap it and prefer `attachment`/`noteTarget`/`taskTarget` for new objects |

---

## 4. Person / Employee / Candidate / Workspace Member (Phase 4)

### 4.1 Current state

```
person                     ← canonical human directory (29 custom fields)
 ├─ emails (EMAILS) + emailNormalized (TEXT)
 ├─ phones (PHONES) + phoneNormalized (TEXT)
 ├─ inHouse (BOOLEAN)
 ├─ contexts (MULTI_SELECT)   ← candidate | client_contact | in_house | …
 ├─ roles (MULTI_SELECT)      ← admin | hr | recruiter | bde | manager | …
 ├─ candidateProfiles → candidate (1:M inverse)
 ├─ employees → employee (1:M inverse)
 ├─ companyPersonRelationships → companyPersonRelationship
 ├─ externalIds → personExternalId
 ├─ interviewParticipants, requirements, taskTargets, noteTargets, attachments,
 │  timelineActivities, calendarEventTargets, messageThreadTargets, …
 └─ company (legacy direct FK)

employee      → person ✓, department, designation, team, location
candidate     → person ✓
workspaceMember → user (login identity only; NO relation to person or employee)
```

### 4.2 Verdict

- **Person is genuinely canonical.** `employee → person`, `candidate → person`, `companyPersonRelationship → person`, `interviewParticipant → person`. A person can be a candidate and an employee without duplication. This satisfies the primary identity rule.
- **Contexts and roles are modelled as MULTI_SELECT on `person`** rather than the plan's separate `person_contexts` / `person_organization_roles` objects. This is a **deliberate, acceptable simplification** — it preserves the "one person, many contexts" rule with far less machinery. Trade-off: no effective dates per context/role (see H1).
- **Duplicate-identity detection is real:** `emailNormalized` / `phoneNormalized` + declared `person.emailsUniqueIndex`.
- **`workspaceMember` is correctly separate from `person`.** Not every employee is a workspace member, and not every workspace member is an employee. This is right.

### 4.3 Defects

| ID | Severity | Defect |
|---|---|---|
| **H5** | **HIGH** | `workspaceMember` has **no relation** to `person` or `employee`, and neither `person` nor `employee` has a `workspaceMember` field. Verified: `employee.workspaceMember` absent, `person.workspaceMember` absent. Consequence: (a) an employee's login cannot be resolved to their HR record; (b) row-level self-service permissions cannot be expressed (see §12.5); (c) "my payslip", "my attendance", "my leave" are unimplementable without a join table or direct FK |
| **M4** | MEDIUM | `employee.joiningDate` / `exitDate` are `DATE_TIME`; a joining date is a business date → `DATE` |
| **L6** | LOW | `person.company` legacy direct FK coexists with `companyPersonRelationship` → two pathways between person and company |

### 4.4 Fix

Add a nullable `employee.workspaceMember` (M2O → `workspaceMember`) with inverse `workspaceMember.employee` (1:M — one login may be linked to one employee record; an employee without a login simply has none). Backfill from e-mail match (`person.emailNormalized` = `workspaceMember.user.email`) as a one-time, reviewable job. This single relation unblocks self-service permissions, "assigned to me" filters, and approver resolution.

---

## 5. Recruitment model (Phase 5)

### 5.1 Current shape

```
company ──< requirement (job opening) ──< candidateSubmission (application)
                     │                             │
                     │                             ├── applicationStageHistory (from/to/reason/by/at) ✓
                     │                             ├── interviews ──< interviewParticipant (person)
                     │                             └── placements (submission, candidate, dates, fee)
candidate ── person
```

### 5.2 Verdict — this is the strongest domain in the model

- `Candidate != Application` ✓ (`candidateSubmission` is the application, keyed to candidate + requirement).
- One candidate → many applications ✓ (many submissions).
- One candidate → many interviews ✓ (`interview` has both `candidate` and `submission`).
- One requirement → many submissions, interviews, invoices ✓.
- **`applicationStageHistory`** (submission, fromStage, toStage, changedBy, changedAt, reason) is a correct append-only pipeline audit — exactly what Phase 12 asks for. Note it is a first-class object, not reconstructed from audit logs. **Keep as the model for other state machines.**
- Duplicate applications prevented: `candidateRequirementUniqueIndex` ✓.
- `placement` is distinct from the application ✓, with `replacementDueDate` for replacement guarantees.

### 5.3 Defects

| ID | Severity | Defect |
|---|---|---|
| **M7** | MEDIUM | `candidate.skills` and `requirement.skills` are `MULTI_SELECT` with a **fixed 10-option enum**. Cannot store arbitrary skills, no proficiency, no years of experience, no matching. The plan explicitly required normalized skills |
| **M8** | MEDIUM | No placement guarantee/replacement lifecycle beyond a date field; `placement.feeStatus` and `invoice.status` are independent → fee collection and placement are not reconciled |
| **M9** | MEDIUM | `interview.interviewer` (TEXT) duplicates `interviewParticipant` |
| **M10** | MEDIUM | `requirement.filledCount` vs `numberOfOpenings` has no constraint and no source of truth — is it derived from placement count? Nothing enforces or recomputes it |
| **M11** | MEDIUM | `interviewParticipant` and `applicationStageHistory` have **no index builders** (see §13), so both are full-table-scanned on the hottest recruitment joins |

---

## 6. HR / employee model (Phase 6)

### 6.1 Current shape

`employee`: `employeeCode` (unique), `status`, `person`, `department`, `designation`, `team`, `location`, `employmentType`, `joiningDate`, `exitDate`, `workLocation` (TEXT), plus inverses to attendance/leave/payroll/onboarding.

### 6.2 Verdict — **no history. This is the model's biggest design gap after money.**

| ID | Severity | Defect |
|---|---|---|
| **H1** | **HIGH** | `employee` stores `department`, `designation`, `team`, `location` as **mutable foreign keys**, and `manager` is missing entirely. There is **no employment-history object and no effective-dated assignment object**. A transfer, promotion, manager change, location change or rehire **overwrites the previous value** and — because Twenty has no audit table — the history is **unrecoverable**. Phase 6 explicitly requires joining / transfer / promotion / termination / rehire to be preserved |
| **C3** | **CRITICAL** | `employee.manager` is declared in metadata but **has no inverse**, so the field is never created. The HR org chart does not exist at runtime |
| **C3b** | **CRITICAL** | `team.department` and `team.teamLead` are declared with no inverse → a team cannot belong to a department and cannot have a lead. `department` also has **no `parentDepartment`** → no hierarchy, contradicting the plan |
| **C4** | **HIGH** | 16 HR/payroll/attendance/leave objects declare `attachments`, `taskTargets`, `noteTargets`, `timelineActivities`, but the target objects (`attachment`, `taskTarget`, `noteTarget`, `timelineActivity`) have no corresponding target fields → **none of these relations are created**. `employee` itself *does* have them (verified). The affected objects are: `onboardingItem`, `shift`, `rosterAssignment`, `attendanceEvent`, `attendanceDay`, `attendanceCorrection`, `leaveType`, `leaveRequest`, `leaveBalance`, `salaryStructure`, `salaryComponent`, `payrollPeriod`, `payslip`, `payslipLine`, `payrollAdjustment`, `payment` |
| **M12** | MEDIUM | `department` has no index at all. `department.employees` reverse lookups scan |
| **M13** | MEDIUM | `designation` has no index builder (declared `titleIndex`, `statusIndex` — not created) |
| **M14** | MEDIUM | `onboardingItem.dueDate` is `DATE_TIME`; onboarding due dates are business dates |
| **L7** | LOW | No `employee.department` history means org-chart-as-of-date reporting is impossible |

### 6.3 Fix

1. Implement the three missing relations (`employee.manager` self-relation with inverse `directReports`; `team.department`; `team.teamLead` → workspaceMember). Additive, no data migration, low risk.
2. Add `department.parentDepartment` (self-relation) for hierarchy.
3. Add **`employeeAssignment`** — effective-dated records of `(employee, department, designation, location, team, manager, employmentType, effectiveFrom, effectiveTo)` with a business rule of *at most one open-ended assignment per employee*. Keep `employee.*` as the current-state projection maintained by the service layer.
4. Add **`employmentEvent`** (kind: JOINED | TRANSFERRED | PROMOTED | MANAGER_CHANGE | LOCATION_CHANGE | CONFIRMED | EXITED | REHIRED, effectiveDate, from/to JSON, reason, approvedBy) — modelled directly on `applicationStageHistory`.

---

## 7. Attendance (Phase 7)

### 7.1 Current shape

```
attendanceEvent   (employee, timestamp, eventType, source, correction)   ← RAW
attendanceDay     (employee, workDate, status, firstCheckIn, lastCheckOut,
                   workedMinutes, breakMinutes, lateMinutes,
                   earlyDepartureMinutes, overtimeMinutes, shift)        ← DERIVED
attendanceCorrection (employee, workDate, requestedCheckIn, requestedCheckOut,
                      reason, status, reviewedAt, reviewNotes,
                      correctedEvents → attendanceEvent, reviewedBy)     ← CORRECTION
shift             (name, startTime TEXT, endTime TEXT, breakMinutes,
                   graceMinutes, workingDays, isActive)
rosterAssignment  (employee, shift, effectiveFrom, effectiveTo, isActive) ← EFFECTIVE-DATED ✓
```

### 7.2 Verdict — the raw/derived split is correct; the edge cases are not covered

**Correct by design:**
- Raw events are preserved: `attendanceCorrection.correctedEvents` links to `attendanceEvent` rather than mutating them. This satisfies "raw attendance events must not be destroyed".
- Derived attendance is separate (`attendanceDay`), so it can be recomputed.
- Duplicate-day prevention: `attendanceDay.employeeWorkDateUniqueIndex` ✓.
- `rosterAssignment` is effective-dated ✓ — the right pattern, and the model to copy for HR.

**Defects:**

| ID | Severity | Defect |
|---|---|---|
| **H6** | HIGH | **Timezone is not derivable.** `attendanceEvent.timestamp` is `timestamptz` (correct), but `attendanceDay.workDate` is a bare `DATE` with no timezone anchor. `shift.startTime`/`endTime` are `TEXT`, `location.timezone` is `TEXT`, and `employee.workLocation` is `TEXT` **not** a relation to `location`. Nothing reliably answers "which local day does this event belong to?" for a multi-location, multi-timezone tenant |
| **H7** | HIGH | **No duplicate clock-event protection.** `attendanceEvent` has no composite unique key on `(employee, source, timestamp)` or an external device id. A retrying biometric device double-writes punches that then corrupt the derived day |
| **M15** | MEDIUM | **Overnight shifts not modelled.** `startTime`/`endTime` are untyped strings; nothing expresses "crosses midnight". A 22:00–06:00 shift cannot be computed correctly |
| **M16** | MEDIUM | **Correction history is incomplete.** `attendanceCorrection` stores the *requested* values but no snapshot of the *previous computed* day. There is no immutable trail of what the day looked like before/after a correction |
| **M17** | MEDIUM | No explicit working-week / holiday calendar object; `shift.workingDays` is a narrow `SELECT` and there is no holiday list, so "expected working days" cannot be computed for payroll proration |
| **M18** | MEDIUM | `attendanceDay` is derived but has no `computedAt` / recomputation version or `sourceEventsHash`, so staleness is undetectable |
| **L8** | LOW | Attendance index coverage is otherwise complete (`attendanceCorrection`, `attendanceDay`, `attendanceEvent`, `shift`, `rosterAssignment`, `leave*` all have builders) — but `workDate`/`status` composite lookups for approval queues are not indexed |

### 7.3 Fix

- Make timezone explicit: add `employee.timezone` (TEXT/select) and/or convert `employee.workLocation` to a relation to `location`; derive `attendanceDay.workDate` from the employee's timezone.
- Add a composite unique index on `attendanceEvent` for device dedupe, and an `externalEventId` field where the device supplies one.
- Model shifts with integer minutes-from-midnight (`startMinutes`, `endMinutes`) plus an explicit `crossesMidnight` boolean, and validate `endMinutes != startMinutes`.
- Add `attendanceDaySnapshot` (or fold into `attendanceCorrection`) capturing the pre-correction computed day, plus `attendanceDay.computedAt` and `computedVersion`.
- Add a `holidayCalendar` object and `holiday` rows.

---

## 8. Leave (Phase 8)

### 8.1 Current shape

```
leaveType    (name, isPaid, annualQuota, isActive)
leaveBalance (employee, leaveType, year:TEXT, entitled:TEXT, used:TEXT, pending:TEXT)
leaveRequest (employee, leaveType, startDate, endDate, days, reason,
              status, reviewedAt, reviewNotes, reviewedBy)
```

### 8.2 Verdict — **the leave ledger does not exist**

| ID | Severity | Defect |
|---|---|---|
| **C2** | **CRITICAL** | `leaveBalance.entitled`, `.used`, `.pending` are stored as **`TEXT`**. They cannot be summed, compared, or validated by the database or even the ORM's numeric filters. `year` is also `TEXT` |
| **H8** | **HIGH** | **No ledger.** A balance is a single mutable row per (employee, leaveType, year). There is **no record of how a balance reached its value** — no accrual entries, no carry-forward, no manual adjustment, no usage transactions. Phase 8 explicitly requires a transaction/ledger architecture with balance history. Reconstruction is impossible because Twenty has no audit table |
| **H9** | **HIGH** | **No leave policy.** `leaveType.annualQuota` alone cannot express accrual frequency, proration on join/exit, carry-forward caps, encashment, probation eligibility, or per-location differences. There is no policy object |
| **M19** | MEDIUM | **No cancellation/rejection trail.** `leaveRequest` has a single `status` and `reviewedAt`/`reviewNotes`. Cancellation, re-approval, and status transitions are not recorded; there is no `leaveRequestHistory` equivalent to `applicationStageHistory` |
| **M20** | MEDIUM | `leaveRequest.days` is `NUMBER` (float) — leave days should be exact. `startDate`/`endDate` are `DATE` ✓ (good — the correct choice here) |
| **M21** | MEDIUM | No overlap constraint: nothing prevents two approved leave requests for the same employee on the same dates |
| **M22** | MEDIUM | `leaveBalance` has `employeeTypeYearUniqueIndex` ✓ but `year` being `TEXT` means `"2026"` and `"2026 "` are different rows |

### 8.3 Fix

Introduce **`leaveLedgerEntry`** as the source of truth:

```
leaveLedgerEntry
  employee, leaveType
  entryType   ENUM  (ACCRUAL | CARRY_FORWARD | USAGE | ADJUSTMENT | ENCASHMENT | EXPIRY | REVERSAL)
  quantityBasisPoints  NUMBER (integer)   ← exact: 100 bps = 1.00 day
  effectiveDate DATE
  source      ENUM  (SYSTEM | REQUEST | MANUAL | IMPORT)
  sourceRequest, sourceBalance, note
  createdBy
```

Then `leaveBalance` becomes a **derived projection** (or keep it as a cached aggregate rebuilt from the ledger). Store all leave quantities as **integer basis points** — `NUMBER` is a float, so integers are the only exact representation available (Twenty rejects `NUMERIC` for user fields). Add `leavePolicy` (accrual frequency, proration rules, carry-forward cap, expiry months, eligibility) and `leaveRequestHistory` (mirroring `applicationStageHistory`). Replace `leaveBalance.entitled/used/pending/pyear` TEXT with integer/`SELECT` types.

---

## 9. Payroll (Phase 9)

### 9.1 Current shape

```
salaryStructure (employee, effectiveFrom, effectiveTo, currency TEXT,
                 monthlyGross NUMBER, isActive) ──< salaryComponent
salaryComponent (salaryStructure, name, componentType, calculationType,
                 amount NUMBER, percentage NUMBER)
payrollPeriod   (name, startDate, endDate, payDate, status, employeeCount,
                 totalGross, totalDeductions, totalAdjustments, totalNet) ──< payslip
payslip         (payrollPeriod, employee, currency TEXT, grossEarnings,
                 totalDeductions, totalAdjustments, netPay, workingDays,
                 presentDays, paidLeaveDays, unpaidLeaveDays, overtimeMinutes,
                 paymentStatus, paidAt, paymentReference, paymentMethod) ──< payslipLine
payslipLine     (payslip, label, lineType, amount NUMBER, notes)
payrollAdjustment (employee, payrollPeriod, approvedBy, adjustmentType,
                   amount NUMBER, reason, status, approvedAt)
```

### 9.2 Verdict — the shape is right, the arithmetic and immutability are not

**Correct:** `salaryStructure` is effective-dated ✓; `payslipLine` snapshots `label`/`lineType`/`amount`, which is a genuine immutable result snapshot ✓; `periodEmployeeUniqueIndex` prevents duplicate payslips ✓; `payrollAdjustment` has an approval workflow ✓.

**Defects:**

| ID | Severity | Defect |
|---|---|---|
| **C1** | **CRITICAL** | **All money is floating point.** `salaryStructure.monthlyGross`, `salaryComponent.amount/percentage`, every `payrollPeriod` total, every `payslip` total, `payslipLine.amount`, `payrollAdjustment.amount` are `NUMBER` → Postgres `float`. Verified in `field-metadata-type-to-column-type.util.ts`. Floating-point payroll cannot be reconciled; totals will not equal the sum of lines. Meanwhile `candidate.currentSalary`, `requirement.salaryMin/Max`, `placement.placementFee/salary`, `candidateSubmission.expectedSalary/offeredSalary`, `opportunity.amount` correctly use `CURRENCY`. **Two competing money strategies coexist in one workspace** |
| **H2** | **HIGH** | **Payroll is not immutable/finalizable.** `payslip` has no `finalizedAt`, no `lockedBy`, no version, and **no reference to the `salaryStructure` version it was calculated from**. `payrollPeriod.status` exists but nothing enforces "a finalized period cannot be recalculated". Phase 9 requires "Employee salary != Payroll historical result" and immutable finalized payroll. Today, changing a salary and rerunning silently rewrites history with no trace |
| **H10** | **HIGH** | **`payslip.currency` and `salaryStructure.currency` are `TEXT`**, disconnected from the amounts. A payslip in INR with a stray `"USD"` string is valid data |
| **H11** | **HIGH** | **No statutory/tax model.** No tax rule table, no employer contributions, no deduction definitions, no PF/PT/ESI-style structure, and no snapshot of the rules used. Phase 9's "tax rules change" scenario — arguably the single most common real payroll rerun cause — has no representation |
| **M23** | MEDIUM | `payrollAdjustment` and `payslip` share `(employee, payrollPeriod)` but have **no explicit relation** and no "applied to payslip" flag. An adjustment can exist without ever being included, and nothing detects a double-application |
| **M24** | MEDIUM | `payrollPeriod` totals are mutable aggregates with no reconciliation guarantee against child payslips, and no index beyond `nameUniqueIndex` |
| **M25** | MEDIUM | No payslip document link — blocked by **C4** (payslip cannot carry attachments today) |
| **M26** | MEDIUM | `payslip.workingDays/presentDays/paidLeaveDays/unpaidLeaveDays` are `NUMBER` floats and are **not linked to `attendanceDay`/`leaveLedgerEntry`**, so the attendance→payroll→leave chain cannot be verified |
| **L9** | LOW | `payrollPeriod` has no `lockedBy`/`finalizedBy` actor |

### 9.3 Fix

1. **Money:** convert every monetary field to `CURRENCY` (integer micros + currency code). This single change removes the whole float class. `CURRENCY` is composite, so `amount` + `currency` collapse into one field. Migration is additive: add the `CURRENCY` field, backfill `amountMicros = round(amount × 1_000_000)` and `currencyCode` from the text column, keep the old fields read-only for one release, then remove them.
2. **Immutability:** add `payrollPeriod.status` transition enforcement (DRAFT → CALCULATED → APPROVED → PAID → CLOSED), `payrollPeriod.finalizedAt`/`finalizedBy`, `payslip.finalizedAt`, and `payslip.sourcePayrollRun` / a `payrollRun` object so a recalculation is a *new run*, not an overwrite. Prior runs are retained and diffable.
3. **Snapshot:** add `payslip.sourceSalaryStructure` (relation) plus keep `payslipLine` snapshots. Add `payslipLine.componentRef` → `salaryComponent` for traceability.
4. **Statutory:** add `statutoryRule` (jurisdiction, effectiveFrom/To, ruleType, config jsonb, version) and record the `statutoryRuleVersion` used on each payslip. Do **not** hardcode Indian rules in core tables (per the internationalization rule).
5. **Link adjustments:** add `payrollAdjustment.payslip` (nullable, set at calculation) with a unique index on `(payrollPeriod, employee, adjustmentType)` where appropriate, or an `appliedToPayslip` boolean maintained by the run service.
6. **Unblock documents:** implement the `attachment` target inverse for `payslip` and `payrollPeriod` so payslip PDFs and bank files can be stored.

---

## 10. Documents and storage / Cloudflare R2 (Phase 10)

### 10.1 Current state (verified)

- Metadata + relations: `attachment` standard object with `file: FileOutput[]`, `fileCategory`, `type`, `fullPath`, `createdBy`/`updatedBy`, `custom`, and explicit `target*` relations to candidate, candidateSubmission, company, dashboard, employee, interview, invoice, location, note, opportunity, person, requirement, task, team, workflow.
- Binary content: `file` core entity (`workspaceId`, `applicationId`, `path`, `size bigint`, `mimeType`, `status`, `settings jsonb`, `deletedAt`, unique `(workspaceId, applicationId, path)`).
- Drivers: local, S3 (with configurable `endpoint`), and a validating wrapper.
- **No binary content in Postgres** ✓ — the plan's core constraint is already satisfied.

### 10.2 Verdict

Twenty's attachment architecture is **sufficient and should be reused, not replaced**. There is no reason to build the plan's separate `document` / `document_link` objects — that would create the parallel attachment system the plan itself forbids.

**R2:** supported today via the S3 driver. Configure `bucketName`, `region: auto`, and the R2 `endpoint`; no code change. Verify presigned-URL behaviour against R2 during implementation.

**Defects:**

| ID | Severity | Defect |
|---|---|---|
| **C4** | **CRITICAL/HIGH** | 16 objects (incl. `payslip`, `payrollPeriod`, `leaveRequest`, `attendanceCorrection`, `onboardingItem`, `salaryStructure`, `payment`) declare attachment/note/task/timeline relations that will never materialize. HR document storage is **non-functional for exactly the records that need it most** |
| **M27** | MEDIUM | **No persisted checksum.** `file` has no checksum column; `getFileMetadata().checksum` is read-time only (S3 ETag). Integrity verification and dedupe need a stored value |
| **M28** | MEDIUM | **No versioning model.** Re-uploading produces a new `attachment`/`file` row (or overwrites `path`). There is no version chain, no "current version", no restore |
| **M29** | MEDIUM | **No orphan detection.** Nothing references `file` back-links, so files whose attachments were deleted accumulate silently. Needs a reconciliation job |
| **M30** | MEDIUM | `attachment.type` and `name` are marked `@deprecated` in favour of `file[0].label` / `file[0].extension` — but views and code may still read them. Confirm no Achare view depends on deprecated fields |
| **L10** | LOW | `attachment` has no `fileSize`/`mimeType` denormalized for list views (requires a storage call) |

### 10.3 Fix

- Add `attachment` target inverses **only for the objects that need documents** (recommended: `payslip`, `payrollPeriod`, `payrollAdjustment`, `leaveRequest`, `attendanceCorrection`, `onboardingItem`, `payment`, `salaryStructure`, `employee` (already present)). Remove the unused declarations on pure detail objects (`payslipLine`, `salaryComponent`, `rosterAssignment`, `shift`, `leaveType`, `leaveBalance`, `attendanceEvent`, `attendanceDay`) rather than creating 60+ unnecessary relations.
- Persist a **checksum** (store in `file.settings jsonb` or add a column) and capture `size`/`mimeType` on the attachment for list performance.
- Add a `documentVersion` model or accept R2 object versioning plus an `attachment.supersedesId` chain.
- Schedule the orphan reconciliation job.

---

## 11. Multi-tenancy (Phase 11)

### 11.1 Verdict — the architecture is sound; the risk is in the bypass paths

- Every standard object extends `BaseWorkspaceEntity` and is materialized in a per-workspace Postgres schema with `workspaceId` scoping.
- Authorization is enforced in the ORM repository (`permissions.utils.ts`), so a client **cannot** escalate by calling GraphQL directly — verified: read, update, soft-delete, and destroy are all checked at repository level, not in resolvers.
- There is **no Postgres RLS**. Isolation is application-layer only.

**Defects:**

| ID | Severity | Defect |
|---|---|---|
| **M31** | MEDIUM | No RLS means a single raw-SQL query, a migration, or a job using an unscoped repository can cross workspaces. There is no defence in depth |
| **M32** | MEDIUM | Background jobs and the workflow executor resolve permissions from `authContext.application.defaultRoleId`; any job that constructs its own context without a role/workspace can bypass scoping. Needs an explicit audit of every job entry point |
| **M33** | MEDIUM | Imports/exports and the API (REST/GraphQL) paths need explicit tests proving a `workspaceId` in a payload cannot override the caller's workspace |
| **L11** | LOW | `file` deliberately allows `workspaceId IS NULL` when `applicationRegistrationId` is set (server-scoped files). Correct by design, but must be excluded from tenant export/quota logic |

### 11.2 Fix

Add a workspace-isolation test suite (Phase 18 item 12): for every Achare object, attempt cross-workspace read/update/delete with a valid token from a different workspace and assert rejection. Do this **before** exposing APIs. Do not add Postgres RLS.

---

## 12. Smart Roles & Permission Architecture (research + gap analysis)

### 12.1 A — What Twenty already supports (verified in code)

A complete RBAC engine exists. Achare must configure it, not replace it.

**`role`** (unique `label` per workspace): `canUpdateAllSettings`, `canAccessAllTools`, `canReadAllObjectRecords`, `canUpdateAllObjectRecords`, `canSoftDeleteAllObjectRecords`, `canDestroyAllObjectRecords`, `isEditable`, `canBeAssignedTo{Users,Agents,ApiKeys}`, `icon`, `description`.

**`roleTarget`** — assigns a role to **exactly one** principal: a `userWorkspace`, an `agent`, or an `apiKey`. Composite unique per principal, plus a `CHECK` enforcing one principal kind. ⇒ **one role per workspace member.**

**`objectPermission`** — per `(objectMetadataId, roleId)`: `canReadObjectRecords`, `canUpdateObjectRecords`, `canSoftDeleteObjectRecords`, `canDestroyObjectRecords`. **There is no `canCreate` bit** — record creation is gated by `canUpdateObjectRecords` plus object-level `isUICreatable`.

**`fieldPermission`** — per `(fieldMetadataId, roleId)`: `canReadFieldValue`, `canUpdateFieldValue`, with a validator forcing `canUpdate` to be `false`/`null` unless read is allowed (no write-without-read).

**`permissionFlag`** — `settings` and `tool` types, with keys including `WORKSPACE`, `WORKSPACE_MEMBERS`, `ROLES`, `DATA_MODEL`, `SECURITY`, `WORKFLOWS`, `IMPERSONATE`, `SSO_BYPASS`, `APPLICATIONS`, `MARKETPLACE_APPS`, `LAYOUTS`, `BILLING`, `AI_SETTINGS`, `AI`, `VIEWS`, `UPLOAD_FILE`, `DOWNLOAD_FILE`, `API_KEYS_AND_WEBHOOKS`, `SEND_EMAIL_TOOL`. Joined to roles via `rolePermissionFlag`.

**`rowLevelPermissionPredicate`** (+ `rowLevelPermissionPredicateGroup`) — per `(role, object, field)`: an operand, a value, and optionally `workspaceMemberFieldMetadataId` / `workspaceMemberSubFieldName`, i.e. **"only rows related to the current workspace member"**. This is the primitive for recruiter-owns-their-candidates and employee-sees-own-records.

**`recordShare`** — record-level sharing with `principalType` and `accessLevel`.

**Enforcement (server-side, authoritative):**
- `engine/twenty-orm/repository/permissions.utils.ts` — read (L109), update (L126), create (L165), destroy (L191), soft-delete (L208).
- `engine/twenty-orm/utils/compute-permission-intersection.util.ts` — intersection when several role sources apply.
- Guards: `settings-permission.guard`, `custom-permission.guard`, `impersonate-permission.guard`, view-permission guards.
- `permissions.service.ts` — `getUserWorkspacePermissions`, `userHasWorkspaceSettingPermission`, `checkRolesPermissions`, `hasToolPermission`.

**Invitations + role assignment already work:** `SendInvitationsInput` carries an optional `roleId`; on member creation `userWorkspace.service` writes a `roleTarget` with `resolvedRoleId = explicit roleId ?? workspace.defaultRoleId`. `workspace.defaultRoleId` is enforced by a `CHECK` once onboarding completes.

### 12.2 Existing Achare role seeding

Four standard roles are seeded (`create-standard-flat-role-metadata.util.ts`):

| Role | canUpdateAllSettings | canAccessAllTools | read all | update all | softDelete all | destroy all | isEditable |
|---|---|---|---|---|---|---|---|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | false |
| Recruiter | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | **false** |
| HR Manager | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | **false** |
| Finance | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | **false** |

### 12.3 B — Gap analysis: what Achare requires that does not exist

| # | Requirement (from the Smart Roles spec) | Status | Evidence / consequence |
|---|---|---|---|
| B1 | Roles gate **modules** (payroll vs CRM vs recruitment) | **Missing** | All three non-admin roles are identical except label/icon. They differ from Admin only by settings/delete. A **Recruiter can read and update payslips, salary structures and payroll periods today.** This is the single biggest permission defect |
| B2 | Roles are **customizable templates** ("admin customization overrides defaults") | **Missing** | All four seeded roles have `isEditable: false`, so an admin cannot adjust them. Achare must either set `isEditable: true` for the three Achare roles or add editable "Achare role templates" alongside them |
| B3 | Granular **per-object** grants | **Available but unseeded** | The `objectPermission` table exists and is enforced; Achare seeds **zero** object permissions. The mechanism works — the data is missing |
| B4 | Granular **per-field** grants (e.g. hide salary) | **Available but unseeded** | `fieldPermission` exists with read/update flags; nothing is seeded |
| B5 | **Row-level** ("own records only") | **Available but unseeded, and blocked for HR** | RLPP exists. Ownership fields are in place for recruitment: `workspaceMember.ownedCandidates`, `ownedRequirements`, `recruiterOwnedRequirements`, `hrOwnedRequirements`, `submittedSubmissions`, `hrOwnedSubmissions`, `ownedInterviews`, `changedApplicationStageHistories`. **But** no `employee`/`person` → `workspaceMember` relation exists (H5), so "employee sees only their own payslip/attendance/leave" is **not expressible** |
| B6 | Settings permission flags assigned per role | **Not seeded** | `rolePermissionFlagIds: []` and `rolePermissionFlagUniversalIdentifiers: []` in the standard role seeder. The four roles have **no permission flags at all** (they rely on the `canAccessAllTools`/`canUpdateAllSettings` column shortcuts) |
| B7 | Invitation carries role assignment | **Already works** | `SendInvitationsInput.roleId` + `resolvedRoleId ?? workspace.defaultRoleId` |
| B8 | Backend is authoritative; frontend is UX only | **Already true** | Enforcement is in the ORM repository, not resolvers |
| B9 | `canCreate` distinct from `canUpdate` | **Does not exist** | No such bit. Do not fake it in the frontend. If Achare needs "create but not edit", a service-level rule + object permission is the only route |
| B10 | Multiple roles per member | **Does not exist** | `roleTarget` is unique per `userWorkspace`. A person who is both HR and Finance needs a **combined role**. Document this; do not fight the schema |
| B11 | Module **entitlement** (commercial) separate from role permission | **Correctly separate, not built** | Do not encode commercial entitlements in roles. Entitlement is a separate concern (see `UPGRADE_PLAN.md`) |

### 12.4 C — What must be built

1. **Seed object permissions** for each Achare role (B1, B3). Concretely: Recruiter gets CRM + recruitment objects; HR Manager gets HR + attendance + leave + documents + recruitment; Finance gets payroll + invoice + payment + salary structures; none of them get each other's. `canRead/canUpdate/canSoftDelete/canDestroy` per object.
2. **Seed field permissions** to protect salary data (B4): hide/read-only `salaryStructure.monthlyGross`, `salaryComponent.amount`, `payslip.*`, `payrollAdjustment.amount` from roles that should not see them.
3. **Seed permission flags** (B6): e.g. `VIEWS`, `UPLOAD_FILE`, `DOWNLOAD_FILE`, `AI`, `WORKFLOWS` per role; explicitly withhold `ROLES`, `DATA_MODEL`, `SECURITY`, `BILLING`, `WORKSPACE_MEMBERS` from non-admins.
4. **Make the Achare roles editable** (`isEditable: true` for recruiter/hrManager/finance) so admins can customize without being able to edit Admin (B2).
5. **Add `employee.workspaceMember`** (H5) and then seed row-level predicates (B5): recruiter → `candidate.recruiterOwner = me`; hiring manager → `interview.owner = me`; employee self-service → `payslip.employee.workspaceMember = me`, `attendanceDay.employee.workspaceMember = me`, `leaveRequest.employee.workspaceMember = me`. Verify RLPP sub-field traversal depth during implementation.
6. **Add an `Employee` role** (self-service) with read-only access to own records, no settings, no salary of others.
7. **Test that the frontend cannot be bypassed** (Phase 18 item 12): for each role, replay the forbidden mutation as a raw GraphQL request and assert server rejection.

### 12.5 Blocker to highlight

`employee` and `person` have **no link to `workspaceMember`**
(`grep WorkspaceMemberWorkspaceEntity` across `hr/`, `recruitment/`, `person/`, `company/` → `employee: NO`, `person: NO`, `payslip: NO`, `attendanceDay: NO`, `attendanceEvent: NO`, `leaveBalance: NO`, `salaryStructure: NO`).

The login identity and the HR identity are two disconnected graphs. Every employee-self-service requirement in the Smart Roles spec depends on bridging them. **This should be the first permission workstream item, because it is a schema prerequisite, not a config change.**

---

## 13. Index audit (Phase 13)

### 13.1 Method

Indexes only exist if the object is registered in `STANDARD_FLAT_INDEX_METADATA_BUILDERS_BY_OBJECT_NAME`. I compared the 62 declared index sets against the 51 registered builders.

### 13.2 Findings

**Declared indexes with NO registered builder → the index will not exist (7 objects):**

| Object | Declared but not created |
|---|---|
| `designation` | titleIndex, statusIndex |
| `location` | statusIndex, searchVectorGinIndex |
| `placement` | submissionIdIndex, candidateIdIndex, statusIndex, searchVectorGinIndex |
| `interviewParticipant` | interviewIdIndex, personIdIndex, searchVectorGinIndex |
| `personExternalId` | personIdIndex, sourceIndex, searchVectorGinIndex |
| `applicationStageHistory` | submissionIdIndex, changedByIdIndex, toStageIndex, searchVectorGinIndex |
| `companyPersonRelationship` | companyIdIndex, personIdIndex, relationshipOwnerIdIndex, statusIndex, searchVectorGinIndex |

Five of these seven are objects added on the current branch. **Search on these objects is unindexed** (no GIN index on `searchVector`).

**Objects with no declared index at all:** `calendarEvent`, `messageThread`, `department`, `team`. `department` and `team` are Achare objects and both are reverse-looked-up (`department.employees`, `team.members`) — they should be indexed.

**Root cause:** the registry is typed `{ [P in AllStandardObjectName]?: ... }` (optional). The compiler cannot catch a missing index builder. **Fix the type to required** and the entire class disappears.

### 13.3 Existing unique indexes (verified present)

`person.emailsUniqueIndex`, `company.domainNameUniqueIndex`, `workspaceMember.userEmailUniqueIndex`, `employee.employeeCodeUniqueIndex`, `attendanceDay.employeeWorkDateUniqueIndex`, `leaveBalance.employeeTypeYearUniqueIndex`, `payslip.periodEmployeeUniqueIndex`, `payrollPeriod.nameUniqueIndex`, `salaryComponent.structureNameUniqueIndex`, `onboardingItem.employeeTitleUniqueIndex`, `candidateSubmission.candidateRequirementUniqueIndex`, `invoice.invoiceNumberUniqueIndex`, plus Twenty's target-object uniques.

### 13.4 Missing unique constraints (recommended)

| Object | Recommended composite unique | Why |
|---|---|---|
| `companyPersonRelationship` | `(company, person, relationshipType)` | The plan states this rule; no index exists |
| `personExternalId` | `(person, source, externalId)` | Prevents duplicate external mappings |
| `attendanceEvent` | `(employee, source, timestamp)` or `(employee, externalEventId)` | Duplicate clock events corrupt attendance |
| `leaveRequest` | `(employee, startDate, endDate)` for non-cancelled | Prevents overlapping approved leave |
| `employeeAssignment` (new) | at most one open-ended per employee → `(employee)` where `effectiveTo IS NULL` | Prevents conflicting current assignments |
| `payrollPeriod` | `(startDate, endDate)` | Prevents overlapping payroll periods |
| `candidate` | `(person)` | The plan intends one candidate profile per person; today it is not constrained |

### 13.5 Index recommendations for new/derived objects

`leaveLedgerEntry(employee, leaveType, effectiveDate)`, `leaveLedgerEntry(sourceRequest)`, `attendanceDay(workDate)`, `payslip(paymentStatus)`, `employeeAssignment(employee, effectiveFrom)`, `employmentEvent(employee, effectiveDate)`, `payrollRun(startDate, endDate)`. (Note: `attendanceCorrection`, `attendanceDay`, `attendanceEvent`, `shift`, `rosterAssignment`, `payrollAdjustment`, `payslip`, `payrollPeriod`, `salaryStructure`, `salaryComponent`, `leaveType`, `leaveRequest`, `leaveBalance`, `onboardingItem`, `payment`, `invoice` and `employee` **already** ship index builders — verify coverage, do not duplicate.)

### 13.6 Soft-delete interaction with unique indexes

Twenty's unique indexes do not appear to be partial (`WHERE deletedAt IS NULL`). Consequence: a soft-deleted `employee` still occupies its `employeeCode`, and a soft-deleted `attendanceDay` still occupies `(employee, workDate)`. Either confirm partial-index support in the metadata layer or document the business rule ("codes are never reused"). **Do not silently assume reuse works.**

---

## 14. Constraint recommendations (Phase 14)

Because standard objects cannot carry arbitrary `CHECK` constraints, split enforcement:

**Enforceable in the database (composite unique indexes):** every rule in §13.4.

**Must be enforced in services + tests (document each):**
- `effectiveFrom < effectiveTo` on `salaryStructure`, `rosterAssignment`, `employeeAssignment`.
- Status transition machines: `payrollPeriod` (DRAFT→CALCULATED→APPROVED→PAID→CLOSED), `payslip.paymentStatus`, `leaveRequest.status`, `attendanceCorrection.status`, `candidateSubmission.stage`, `placement.status`. Model each on `applicationStageHistory`.
- `requirement.filledCount <= numberOfOpenings`, and `filledCount` derived from placements.
- `payslip.netPay == grossEarnings − totalDeductions ± totalAdjustments`, and `payrollPeriod` totals equal the sum of their payslips. Assert in tests; add a reconciliation report.
- Salary must not change for a finalized payroll period.
- `leaveRequest.days` must equal the working days between `startDate` and `endDate` for the employee's calendar.
- No overlapping leave for the same employee.

**Prefer the database wherever the rule is "at most one" — that is the only class the platform can enforce.**

---

## 15. Findings register (consolidated, by severity)

### CRITICAL

| ID | Finding |
|---|---|
| C1 | Money stored as `NUMBER` (Postgres `float`) across payroll, salary, invoice, payment. `NUMERIC` is unavailable for user fields; `CURRENCY` (micros) is the only exact option. Two competing money strategies coexist |
| C2 | `leaveBalance.entitled`/`used`/`pending`/`year` are `TEXT` — balances cannot be computed or audited |
| C3 | `employee.manager` declared with no inverse → field never created. `team.department` and `team.teamLead` likewise. No org chart, no team↔department |
| C4 | 16 HR/payroll/attendance/leave objects cannot carry attachments/tasks/notes/timeline → HR document storage non-functional where it matters most (incl. payslips) |

### HIGH

| ID | Finding |
|---|---|
| H1 | No employment history and no effective-dated employee assignment — transfers, promotions, manager/dept/location changes and rehires are silently overwritten and unrecoverable (no audit table exists) |
| H2 | Payroll is not immutable: no finalization lock, no version, no link to the salary-structure version used → rerunning rewrites history |
| H3 | 7 objects declare indexes that are never created (5 of them added on this branch); `department`/`team` have no indexes at all. Root cause: the index registry type is optional |
| H4 | Missing uniqueness the model assumes: `companyPersonRelationship(company, person, type)`, `personExternalId(person, source, id)`, `attendanceEvent` dedupe, `candidate(person)` |
| H5 | `employee`/`person` have **no relation to `workspaceMember`** → employee self-service permissions are not expressible |
| H6 | Attendance timezone is not derivable (`workDate` bare DATE, `workLocation` TEXT not a relation, `shift.startTime` TEXT) |
| H7 | No duplicate clock-event protection on `attendanceEvent` |
| H8 | No leave ledger — a balance is one mutable row with no history |
| H9 | No leave policy model (accrual, proration, carry-forward, expiry, eligibility) |
| H10 | Payroll currency is `TEXT`, disconnected from amounts |
| H11 | No statutory/tax rule model or snapshot |
| H12 | 87 declared fields are never instantiated platform-wide; 24 field builders use a loose return type so the compiler cannot catch it |

### MEDIUM

| ID | Finding |
|---|---|
| M1–M3 | Naming/type drift: `candidateSubmission` vs "Application", `requirement` vs "Job Opening"; `invoice.outstanding` TEXT; business dates as `DATE_TIME` (`employee.joiningDate`, `onboardingItem.dueDate`, `requirement.receivedAt`) |
| M4–M6, M12–M14 | `person.roles` collides with the RBAC `role` concept; `department` has no hierarchy or index; `designation` unindexed; `person.company` duplicates `companyPersonRelationship` |
| M7–M11 | `skills` are fixed 10-option MULTI_SELECTs; no placement guarantee lifecycle; `interview.interviewer` TEXT duplicates participants; `requirement.filledCount` unconstrained |
| M15–M18 | Overnight shifts not modelled; no shift/holiday calendar; no pre/post-correction snapshot; derived attendance has no staleness marker |
| M19–M22 | No leave status history; no leave overlap constraint; `leaveRequest.days` float; non-canonical `year` values |
| M23–M26 | Payroll adjustments not linked to payslips; mutable period totals with no reconciliation; payslip has no document link; attendance/leave not linked into payroll |
| M27–M30 | No persisted checksum, no file versioning, no orphan detection, deprecated attachment fields in use |
| M31–M33 | No RLS defence in depth; job/workflow contexts are a bypass risk; imports/exports/API need explicit isolation tests |

### LOW

L1/L6–L11: `invoice.outstanding` duplication, legacy `person.company`, missing `computedAt`/actor fields, timeline target coverage gaps, server-scoped `file` rows excluded from tenant logic.

---

## 16. Target conceptual model (Phase 16)

Preserving every existing object; **additions in bold**.

```
PLATFORM
  workspaceMember ──1:1?── employee                    ← NEW (H5)
  attachment · note · task · timelineActivity · dashboard
  workflow · workflowRun · workflowVersion · recordShare

IDENTITY
  person  (canonical; contexts/roles as MULTI_SELECT; emailNormalized/phoneNormalized)
    ├── personExternalId        (unique: person+source+externalId)     ← constraint
    ├── companyPersonRelationship (unique: company+person+type)        ← constraint
    └── attachments · notes · tasks · timeline                         ✓ works

CRM
  company · opportunity · invoice ──< payment
  (money → CURRENCY; outstanding derived, not stored)

RECRUITMENT
  requirement (job) ──< candidateSubmission (application) ──< placement
                          ├── applicationStageHistory   (append-only)   ✓ pattern to copy
                          └── interview ──< interviewParticipant
  candidate ── person   (unique per person)
  candidateSkill (normalized)                                          ← NEW (M7)

HR
  employee ──< employeeAssignment (effective-dated)
                                        │ dept / designation / location / team / manager
             ──< employmentEvent         (JOINED|TRANSFERRED|PROMOTED|…)
             ──< onboardingItem
  department ──< team ──< employee
  department.parentDepartment                                         ← NEW (hierarchy)
  designation · location
  attachments · notes · tasks · timeline                              ✓ works

ATTENDANCE
  attendanceEvent (RAW, dedupe unique)                                 ← constraint
  attendanceDay   (DERIVED, timezone-anchored, computedAt/version)
  attendanceCorrection ──< attendanceDaySnapshot                       ← NEW (M16)
  shift (startMinutes/endMinutes/crossesMidnight)                      ← NEW (M15)
  rosterAssignment (effective-dated)                                   ✓ pattern to copy
  holidayCalendar ──< holiday                                          ← NEW (M17)

LEAVE
  leaveType ──< leavePolicy                                            ← NEW (H9)
  leaveLedgerEntry  (SINGLE SOURCE OF TRUTH; integer basis points)     ← NEW (H8)
  leaveBalance      (derived projection)
  leaveRequest ──< leaveRequestHistory                                 ← NEW (M19)

PAYROLL
  salaryStructure (effective-dated, CURRENCY) ──< salaryComponent (CURRENCY)
  statutoryRule (jurisdiction, effectiveFrom/To, version)              ← NEW (H11)
  payrollRun (immutable; versioned) ──< payrollPeriod (locked)         ← NEW (H2)
       └──< payslip (finalizedAt, sourceSalaryStructure, CURRENCY)
              └──< payslipLine (snapshot; CURRENCY; componentRef)
  payrollAdjustment (linked to payslip)                                ← NEW (M23)

DOCUMENTS
  attachment + core.file (+ persisted checksum, version chain)         ← extends existing

ANALYTICS
  dashboard (consumes the model; never canonical)
```

**Ownership, lifecycle and history requirements:**

| Object | Owner | Lifecycle | History requirement |
|---|---|---|---|
| `person` | IDENTITY | soft-delete only | archive, never hard-delete if referenced |
| `employee` | HR | draft→active→exited→rehired | via `employeeAssignment` + `employmentEvent` |
| `candidate` / `candidateSubmission` | RECRUITMENT | stage machine | via `applicationStageHistory` ✓ |
| `attendanceEvent` | ATTENDANCE | append-only | never mutate; corrections reference |
| `attendanceDay` | ATTENDANCE | recomputable | snapshot before correction |
| `leaveLedgerEntry` | LEAVE | append-only | is the history |
| `salaryStructure` | PAYROLL | effective-dated | supersede, never edit in place |
| `payslip` | PAYROLL | draft→finalized→paid | immutable after finalize; new run to recalculate |
| `attachment` | DOCUMENTS | versioned | supersede chain + orphan job |

---

## 17. Migration plan (Phase 17)

**Rule for every entry:** additive first, backfill, verify, then remove. Never rewrite a table in place. Never destroy customer data.

### M-1 · Money → CURRENCY (C1, H10)

- **CURRENT:** `NUMBER` amounts + `TEXT` currency on `salaryComponent.amount/percentage`, `salaryStructure.monthlyGross/currency`, `payrollPeriod.total*`, `payslip.grossEarnings/totalDeductions/totalAdjustments/netPay/currency`, `payslipLine.amount`, `payrollAdjustment.amount`, `invoice.amount/amountPaid`, `payment.amount`. `invoice.outstanding` is `TEXT`.
- **TARGET:** `CURRENCY` (`amountMicros NUMERIC` + `currencyCode TEXT`) for every monetary field; `NUMBER` retained only for non-monetary quantities (minutes, days, percentages).
- **MIGRATION:** add the new `CURRENCY` field next to each legacy field; backfill `amountMicros = round(amount × 1 000 000)`, `currencyCode` from the existing text/company default; switch reads and views; keep legacy fields read-only for one release; then remove. `invoice.outstanding` becomes derived.
- **RISK:** micros rounding on legacy floats; mixed-currency legacy rows (a workspace with two currencies in one period). Detect and reconcile before cutover.
- **ROLLBACK:** drop the new field; legacy fields were never modified.

### M-2 · Leave ledger (C2, H8, H9, M19–M22)

- **CURRENT:** `leaveBalance(entitled TEXT, used TEXT, pending TEXT, year TEXT)`.
- **TARGET:** `leaveLedgerEntry` (immutable, integer basis points) as source of truth; `leaveBalance` as a derived projection; `leavePolicy`; `leaveRequestHistory`.
- **MIGRATION:** create `leaveLedgerEntry`; for each existing balance emit one `OPENING_BALANCE` entry from the TEXT values (parse and validate first — expect dirty data); create `leavePolicy` rows from `leaveType.annualQuota`; rebuild balances from the ledger and assert equality before switching reads.
- **RISK:** unparseable TEXT balances; employees with per-type quotas that cannot be represented by the flat `annualQuota`.
- **ROLLBACK:** drop the new objects; `leaveBalance` untouched.

### M-3 · Employee identity bridge + HR history (H5, C3, H1)

- **CURRENT:** `employee` has no `workspaceMember`/`manager`; `team.department`/`teamLead` missing; `employee.{department,designation,team,location}` are mutable current-state FKs.
- **TARGET:** `employee.workspaceMember` + inverse; `employee.manager` self-relation + `directReports`; `team.department` + `team.teamLead`; `department.parentDepartment`; `employeeAssignment`; `employmentEvent`.
- **MIGRATION:** (1) add the relations — purely additive, no data change. (2) Create `employeeAssignment`, backfill **one open-ended row per employee** from current `employee.*` with `effectiveFrom = joiningDate ?? today`. (3) Emit a `JOINED` `employmentEvent` per employee. (4) Move writes to the service layer, keeping `employee.*` as a projection.
- **RISK:** dual source of truth if any code path writes `employee.department` directly. Neutralize by making those fields read-only in the UI and enforced in the service. Backfill for legacy `person.company` mismatches.
- **ROLLBACK:** drop the new objects and relations; `employee` was never altered.

### M-4 · Payroll immutability + statutory (H2, H11, M23–M26)

- **CURRENT:** mutable period totals; no lock, version, or salary-structure reference; adjustments unlinked.
- **TARGET:** `payrollRun` (immutable, versioned) → `payrollPeriod` (locked on approval) → `payslip` (`finalizedAt`, `sourceSalaryStructure`, `statutoryRuleVersion`) → `payslipLine`; `payrollAdjustment.payslip`; `statutoryRule`.
- **MIGRATION:** add nullable fields and the new objects; treat every existing `payrollPeriod` as `CLOSED` (historical, never recalculated); link existing payslips to their best-guess `salaryStructure` where the dates prove it, otherwise leave null and mark "unverified historical".
- **RISK:** historical payslips cannot always be proven to a salary-structure version — do not invent provenance. Mark unverified.
- **ROLLBACK:** drop new objects/fields; existing data unmodified.

### M-5 · Index and uniqueness close-out (H3, H4)

- **CURRENT:** 7 declared index sets unbuilt; `department`/`team` unindexed; several intended unique indexes absent.
- **TARGET:** every standard object registered in the index map; composite uniques added.
- **MIGRATION:** add the 7 index builders + `department`/`team`; add unique indexes. **Before adding each unique index, run a duplicate-detection query** — a unique index will fail if existing data violates it.
- **RISK:** duplicate rows blocking index creation in existing workspaces; unique-on-soft-deleted blocking legitimate reuse.
- **ROLLBACK:** drop the indexes.

### M-6 · HR document targets (C4)

- **CURRENT:** 16 objects declare attachments/tasks/notes/timeline with no inverse.
- **TARGET:** real relations for the 9 objects that need documents; unused declarations removed from the 7 detail objects.
- **MIGRATION:** add the corresponding `target*` fields on `attachment`, `taskTarget`, `noteTarget`, `timelineActivity`; delete the doomed declarations. Additive + deletions of dead declarations only.
- **RISK:** extending `timelineActivity`/`attachment` enlarges already-wide join objects — watch column count and index count.
- **ROLLBACK:** drop the added target fields; restore the declarations.

### M-7 · Non-DB close-out

- **CURRENT:** loose builder return types hide missing fields; optional index registry hides missing indexes.
- **TARGET:** the compiler enforces both.
- **MIGRATION:** tighten `compute-*-standard-flat-field-metadata.util.ts` return types on the 24 loose objects; make `STANDARD_FLAT_INDEX_METADATA_BUILDERS_BY_OBJECT_NAME` required (`{ [P in AllStandardObjectName]: ... }`). Fix every error the tightening reveals (this is how the remaining 87 phantom fields surface).
- **RISK:** a large one-time error burst. Do it **after** M-1…M-6 so the fixes are the final ones, and never ship the tightening half-applied.
- **ROLLBACK:** revert the two type changes.

### M-8 · Storage (M27–M30)

- **CURRENT:** local driver; no checksum/version/orphan handling.
- **TARGET:** S3-compatible driver pointed at R2; persisted checksum; version chain; orphan job.
- **MIGRATION:** configure R2 (`endpoint`, bucket, region `auto`); backfill `size`/`mimeType` metadata; run orphan detection read-only first.
- **RISK:** presigned-URL behaviour differs from AWS S3 — verify before switching production uploads; do not attempt to migrate existing binaries without a verified copy-then-verify step.
- **ROLLBACK:** revert the driver configuration.

---

## 18. Backward compatibility, performance, security

**Backward compatibility**
- All Achare additions are new standard objects and additive fields — no existing Twenty object is removed, so upstream syncs remain viable.
- Highest-risk change is **M-1 (money type)**: it touches fields that views, dashboards, workflows and the front already read. Stage it as add → dual-read → switch → remove.
- **M-7 (type tightening)** will surface latent errors in objects Achare does not own (`calendarEventTarget`, `messageThreadTarget`, `messageCampaign`, `messageChannelMessageAssociation*`). Expect pre-existing Twenty gaps to appear; decide per case (fix or suppress) rather than blanket-reverting.
- Snapshot tests legitimately change when objects are added: `get-standard-object-metadata-related-entity-ids.util.spec.ts` and `standardObjectUniversalIdentifiers.test.ts`. Verify each diff is **purely additive with no removed key or altered existing UUID** before updating.

**Performance**
- The unindexed objects (H3) are on the hottest paths: `interviewParticipant` (every interview), `applicationStageHistory` (every pipeline view), `companyPersonRelationship` (every company page), `placement`, `personExternalId`, `location`, `designation`. Fixing H3 is the highest-leverage performance work.
- Missing `searchVector` GIN indexes on 5 objects means search falls back to sequential scans.
- `timelineActivity` and `attachment` are already wide; extending them (M-6) increases join cost — index every new `target*Id` column.
- Derived `attendanceDay` totals make it cheap to render; keep recomputation bounded to the affected day.

**Security**
- Frontend gating is UX only — verified: enforcement lives in the ORM repository, so manual GraphQL cannot escalate.
- The authentic Achare risk is **role seeding**, not the mechanism: today a Recruiter can read and write payroll (B1). Ship role/object/field/row seeding with the first commercial release, not after.
- Close the bypass surfaces explicitly: background jobs, workflow contexts, imports/exports, and any raw SQL. Add `workspaceId`-override rejection tests.
- Do not add `canCreate` semantics in the frontend — the permission does not exist.
- Salary data currently has **no** row or field protection at all; treat as a confidentiality defect, not a preference.

---

## 19. Implementation plan (Phase 18)

**Only after this report is reviewed and the target model is signed off.** Sequenced so that each step is verifiable and reversible.

**Wave 0 — stop the bleeding (small, high value)**
1. Implement the 3 missing relations (`employee.manager`, `team.department`, `team.teamLead`) + `department.parentDepartment`.
2. Add the 7 missing index builders + `department`/`team` indexes.
3. Keep all three packages typechecking green; add the validation script that asserts every declared index has a builder and every declared field is instantiated, so regressions fail fast.

**Wave 1 — schema prerequisites**
4. `employee.workspaceMember` + inverse, with a reviewable e-mail-match backfill.
5. Money → `CURRENCY` across payroll/salary/invoice/payment (M-1), staged add → dual-read → remove.
6. `employeeAssignment` + `employmentEvent` + backfill.

**Wave 2 — correctness**
7. Leave ledger + policy + request history; rewrite `leaveBalance` as a projection.
8. Payroll `payrollRun`/finalization/lock + `statutoryRule` + adjustment linkage.
9. Attendance dedupe unique, timezone anchoring, shift minutes/overnight, correction snapshot, holiday calendar.

**Wave 3 — permissions**
10. Seed object + field permissions and permission flags per Achare role; make the three Achare roles editable.
11. Add the `Employee` self-service role + row-level predicates (recruiter ownership, hiring-manager, self-service).
12. **Tests for every migration, plus: multi-workspace isolation, historical payroll, employee self-service, recruitment relationships, document/R2 references.** Every permission rule needs a raw-GraphQL rejection test.

**Wave 4 — tightening**
13. Then run M-7 (required index registry, strict builder return types) and resolve every newly visible gap.
14. Storage: R2 configuration, persisted checksum, version chain, orphan reconciliation job.

**Guardrails (non-negotiable)**
- Reuse Twenty's metadata, relation, index, workspace-isolation, permission and attachment architectures. Build no parallel system.
- Business records are never hard-deleted; use archive/deactivate.
- The database stays the source of truth; dashboards, views, widgets and AI consume the model and never become part of it.
- Add an `ApplicationStageHistory`-style history object for every object with a state machine that matters to the business.

---

## 20. Open questions requiring a product decision

1. **Payroll jurisdiction scope for v1** — which statutory rule sets must ship first, and is multi-country in scope? This determines whether `statutoryRule` is a config table or a rules engine.
2. **Leave quantity precision** — is half-day the finest granularity (then store half-day integers) or quarter-day/hours?
3. **Employee self-service depth** — read-only own payslips, or also attendance regularisation and leave application from the workspace? This decides how much of the `Employee` role must be built in wave 3.
4. **Combined roles** — accept "create a combined HR+Finance role" (the schema permits only one role per member) or add a role-composition layer? Recommendation: accept the constraint for v1 and document it.
5. **Historical provenance honesty** — for existing payroll data that cannot be proven to a salary-structure version, confirm that "unverified historical" is the accepted label rather than inventing provenance.
6. **`candidateSubmission` vs `application` naming** — freeze one name before the API surface is public. The API, docs and customer-facing language should agree.

---

*No database change was made to produce this audit. Generated from the built metadata registry, the field/index builder registry, the metadata entities, the ORM permission layer and the storage drivers at the audited revision.*
