import { AchareFeatureKey } from '../types/AchareFeatureKey';
import { type AchareFeatureDefinition } from '../types/AchareFeatureDefinition';
import { AchareModuleKey } from '../types/AchareModuleKey';

/**
 * The Achare feature catalogue — the single source of truth for what a
 * workspace can enable.
 *
 * Ordered array: this order is used for display in feature-selection UI.
 * `ACHARE_FEATURES` is the exhaustive keyed lookup derived from it.
 */
export const ACHARE_FEATURE_DEFINITIONS: AchareFeatureDefinition[] = [
  // ── CRM ───────────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.COMPANIES,
    moduleKey: AchareModuleKey.CRM,
    label: 'Companies',
    description: 'Accounts and organisations you work with.',
    icon: 'IconBuildingSkyscraper',
    standardObjectKey: 'company',
    navigationMenuItemKey: 'allCompanies',
  },
  {
    key: AchareFeatureKey.CONTACTS,
    moduleKey: AchareModuleKey.CRM,
    label: 'Contacts',
    description: 'People you deal with at those companies.',
    icon: 'IconUser',
    standardObjectKey: 'person',
    navigationMenuItemKey: 'allPeople',
  },
  {
    key: AchareFeatureKey.OPPORTUNITIES,
    moduleKey: AchareModuleKey.CRM,
    label: 'Opportunities',
    description: 'Deals and revenue in progress.',
    icon: 'IconTargetArrow',
    standardObjectKey: 'opportunity',
    navigationMenuItemKey: 'allOpportunities',
  },

  // ── Recruitment ───────────────────────────────────────────────────
  {
    key: AchareFeatureKey.REQUIREMENTS,
    moduleKey: AchareModuleKey.RECRUITMENT,
    label: 'Requirements',
    description: 'Roles you are hiring for.',
    icon: 'IconBriefcase',
    standardObjectKey: 'requirement',
    navigationMenuItemKey: 'allRequirements',
  },
  {
    key: AchareFeatureKey.CANDIDATES,
    moduleKey: AchareModuleKey.RECRUITMENT,
    label: 'Candidates',
    description: 'People in your talent pipeline.',
    icon: 'IconUserSearch',
    standardObjectKey: 'candidate',
    navigationMenuItemKey: 'allCandidates',
  },
  {
    key: AchareFeatureKey.SUBMISSIONS,
    moduleKey: AchareModuleKey.RECRUITMENT,
    label: 'Submissions',
    description: 'Candidates put forward for a requirement.',
    icon: 'IconSend',
    standardObjectKey: 'candidateSubmission',
    navigationMenuItemKey: 'allCandidateSubmissions',
  },
  {
    key: AchareFeatureKey.INTERVIEWS,
    moduleKey: AchareModuleKey.RECRUITMENT,
    label: 'Interviews',
    description: 'Scheduled interviews and their outcomes.',
    icon: 'IconCalendarEvent',
    standardObjectKey: 'interview',
    navigationMenuItemKey: 'allInterviews',
  },
  {
    key: AchareFeatureKey.PLACEMENTS,
    moduleKey: AchareModuleKey.RECRUITMENT,
    label: 'Placements',
    description: 'Successful hires and placement records.',
    icon: 'IconUserCheck',
    standardObjectKey: 'placement',
    navigationMenuItemKey: 'allPlacements',
  },

  // ── Team ──────────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.EMPLOYEES,
    moduleKey: AchareModuleKey.TEAM,
    label: 'Employees',
    description: 'Your people and their employment details.',
    icon: 'IconUsers',
    standardObjectKey: 'employee',
    navigationMenuItemKey: 'allEmployees',
  },
  {
    key: AchareFeatureKey.DEPARTMENTS,
    moduleKey: AchareModuleKey.TEAM,
    label: 'Departments',
    description: 'How your company is organised.',
    icon: 'IconSitemap',
    standardObjectKey: 'department',
    navigationMenuItemKey: 'allDepartments',
  },
  {
    key: AchareFeatureKey.TEAMS,
    moduleKey: AchareModuleKey.TEAM,
    label: 'Teams',
    description: 'Working groups inside departments.',
    icon: 'IconUsersGroup',
    standardObjectKey: 'team',
    navigationMenuItemKey: 'allTeams',
  },
  {
    key: AchareFeatureKey.DESIGNATIONS,
    moduleKey: AchareModuleKey.TEAM,
    label: 'Designations',
    description: 'Job titles and levels.',
    icon: 'IconBadge',
    standardObjectKey: 'designation',
    navigationMenuItemKey: 'allDesignations',
  },

  // ── HR ────────────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.ONBOARDING,
    moduleKey: AchareModuleKey.HR,
    label: 'Onboarding',
    description: 'Track joining tasks for new employees.',
    icon: 'IconChecklist',
    standardObjectKey: 'onboardingItem',
    navigationMenuItemKey: 'allOnboardingItems',
  },
  {
    key: AchareFeatureKey.ATTENDANCE,
    moduleKey: AchareModuleKey.HR,
    label: 'Attendance',
    description: 'Daily attendance, check-in and check-out.',
    icon: 'IconCalendarStats',
    standardObjectKey: 'attendanceDay',
    navigationMenuItemKey: 'allAttendanceDays',
  },
  {
    key: AchareFeatureKey.LEAVE,
    moduleKey: AchareModuleKey.HR,
    label: 'Leave',
    description: 'Leave types, requests and balances.',
    icon: 'IconBeach',
    standardObjectKey: 'leaveRequest',
    navigationMenuItemKey: 'allLeaveRequests',
  },
  {
    key: AchareFeatureKey.ROSTERS,
    moduleKey: AchareModuleKey.HR,
    label: 'Rosters',
    description: 'Shift rosters and assignments.',
    icon: 'IconCalendarTime',
    standardObjectKey: 'rosterAssignment',
    navigationMenuItemKey: 'allRosterAssignments',
  },
  {
    key: AchareFeatureKey.SHIFTS,
    moduleKey: AchareModuleKey.HR,
    label: 'Shifts',
    description: 'Shift definitions and timings.',
    icon: 'IconClock',
    standardObjectKey: 'shift',
    navigationMenuItemKey: 'allShifts',
  },

  // ── Payroll ───────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.SALARY,
    moduleKey: AchareModuleKey.PAYROLL,
    label: 'Salary',
    description: 'Salary structures and components.',
    icon: 'IconCoin',
    standardObjectKey: 'salaryStructure',
    navigationMenuItemKey: 'allSalaryStructures',
  },
  {
    key: AchareFeatureKey.PAYROLL,
    moduleKey: AchareModuleKey.PAYROLL,
    label: 'Payroll',
    description: 'Payroll periods and processing runs.',
    icon: 'IconCash',
    standardObjectKey: 'payrollPeriod',
    navigationMenuItemKey: 'allPayrollPeriods',
  },
  {
    key: AchareFeatureKey.PAYSLIPS,
    moduleKey: AchareModuleKey.PAYROLL,
    label: 'Payslips',
    description: 'Generated payslips and their lines.',
    icon: 'IconReceipt',
    standardObjectKey: 'payslip',
    navigationMenuItemKey: 'allPayslips',
  },
  {
    key: AchareFeatureKey.PAYROLL_ADJUSTMENTS,
    moduleKey: AchareModuleKey.PAYROLL,
    label: 'Adjustments',
    description: 'Bonuses, deductions and one-off adjustments.',
    icon: 'IconAdjustments',
    standardObjectKey: 'payrollAdjustment',
    navigationMenuItemKey: 'allPayrollAdjustments',
  },

  // ── Finance ───────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.INVOICES,
    moduleKey: AchareModuleKey.FINANCE,
    label: 'Invoices',
    description: 'Raise and track invoices.',
    icon: 'IconFileInvoice',
    standardObjectKey: 'invoice',
    navigationMenuItemKey: 'allInvoices',
  },
  {
    key: AchareFeatureKey.PAYMENTS,
    moduleKey: AchareModuleKey.FINANCE,
    label: 'Payments',
    description: 'Record payments against invoices.',
    icon: 'IconCreditCard',
    standardObjectKey: 'payment',
    navigationMenuItemKey: 'allPayments',
  },

  // ── Documents ─────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.DOCUMENTS,
    moduleKey: AchareModuleKey.DOCUMENTS,
    label: 'Documents',
    description: 'Company and employee documents.',
    icon: 'IconFile',
    standardObjectKey: 'attachment',
  },

  // ── Collaboration ─────────────────────────────────────────────────
  {
    key: AchareFeatureKey.TASKS,
    moduleKey: AchareModuleKey.COLLABORATION,
    label: 'Tasks',
    description: 'Internal work items.',
    icon: 'IconCheckbox',
    standardObjectKey: 'task',
    navigationMenuItemKey: 'allTasks',
  },
  {
    key: AchareFeatureKey.NOTES,
    moduleKey: AchareModuleKey.COLLABORATION,
    label: 'Notes',
    description: 'Shared notes on records.',
    icon: 'IconNotes',
    standardObjectKey: 'note',
    navigationMenuItemKey: 'allNotes',
  },
  {
    key: AchareFeatureKey.ANNOUNCEMENTS,
    moduleKey: AchareModuleKey.COLLABORATION,
    label: 'Announcements',
    description: 'Company-wide announcements.',
    icon: 'IconSpeakerphone',
    standardObjectKey: 'announcement',
  },

  // ── Analytics ─────────────────────────────────────────────────────
  {
    key: AchareFeatureKey.DASHBOARDS,
    moduleKey: AchareModuleKey.ANALYTICS,
    label: 'Dashboards',
    description: 'Role-based dashboards and metrics.',
    icon: 'IconChartBar',
    standardObjectKey: 'dashboard',
    navigationMenuItemKey: 'allDashboards',
  },
];

/**
 * Exhaustive keyed lookup of every Achare feature definition.
 */
export const ACHARE_FEATURES = ACHARE_FEATURE_DEFINITIONS.reduce<
  Record<AchareFeatureKey, AchareFeatureDefinition>
>(
  (accumulator, definition) => ({
    ...accumulator,
    [definition.key]: definition,
  }),
  {} as Record<AchareFeatureKey, AchareFeatureDefinition>,
);
