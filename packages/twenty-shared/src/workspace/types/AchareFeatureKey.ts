/**
 * Achare product feature keys.
 *
 * These are the granular, customer-toggleable capabilities of an Achare
 * workspace. They are NOT developer feature flags (see `FeatureFlagKey`) —
 * they describe what a company has chosen to use, and are configured by the
 * workspace admin from onboarding and the Setup Center.
 *
 * Features are grouped into modules (see `AchareModuleKey`) which map to the
 * top-level navigation folders.
 */
export enum AchareFeatureKey {
  // ── CRM ───────────────────────────────────────────────────────────
  COMPANIES = 'COMPANIES',
  CONTACTS = 'CONTACTS',
  OPPORTUNITIES = 'OPPORTUNITIES',

  // ── Recruitment ───────────────────────────────────────────────────
  REQUIREMENTS = 'REQUIREMENTS',
  CANDIDATES = 'CANDIDATES',
  SUBMISSIONS = 'SUBMISSIONS',
  INTERVIEWS = 'INTERVIEWS',
  PLACEMENTS = 'PLACEMENTS',

  // ── Team ──────────────────────────────────────────────────────────
  EMPLOYEES = 'EMPLOYEES',
  DEPARTMENTS = 'DEPARTMENTS',
  TEAMS = 'TEAMS',
  DESIGNATIONS = 'DESIGNATIONS',

  // ── HR ────────────────────────────────────────────────────────────
  ONBOARDING = 'ONBOARDING',
  ATTENDANCE = 'ATTENDANCE',
  LEAVE = 'LEAVE',
  ROSTERS = 'ROSTERS',
  SHIFTS = 'SHIFTS',

  // ── Payroll ───────────────────────────────────────────────────────
  SALARY = 'SALARY',
  PAYROLL = 'PAYROLL',
  PAYSLIPS = 'PAYSLIPS',
  PAYROLL_ADJUSTMENTS = 'PAYROLL_ADJUSTMENTS',

  // ── Finance ───────────────────────────────────────────────────────
  INVOICES = 'INVOICES',
  PAYMENTS = 'PAYMENTS',

  // ── Documents ─────────────────────────────────────────────────────
  DOCUMENTS = 'DOCUMENTS',

  // ── Collaboration ─────────────────────────────────────────────────
  TASKS = 'TASKS',
  NOTES = 'NOTES',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',

  // ── Analytics ─────────────────────────────────────────────────────
  DASHBOARDS = 'DASHBOARDS',
}
