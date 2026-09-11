import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { NavigationMenuItemType } from 'src/engine/metadata-modules/navigation-menu-item/enums/navigation-menu-item-type.enum';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

// Folder UUIDs
const FOLDER_MY_WORK = '20202020-d001-4d01-8d01-c0aba11c0001';
const FOLDER_CRM = '20202020-d002-4d02-8d02-c0aba11c0002';
const FOLDER_RECRUITMENT = '20202020-d003-4d03-8d03-c0aba11c0003';
const FOLDER_TEAM = '20202020-d004-4d04-8d04-c0aba11c0004';
const FOLDER_HR = '20202020-d005-4d05-8d05-c0aba11c0005';
const FOLDER_PAYROLL = '20202020-d006-4d06-8d06-c0aba11c0006';
const FOLDER_DOCUMENTS = '20202020-d007-4d07-8d07-c0aba11c0007';
const FOLDER_FINANCE = '20202020-d008-4d08-8d08-c0aba11c0008';
const FOLDER_ANALYTICS = '20202020-d009-4d09-8d09-c0aba11c0009';
const FOLDER_ADMIN = '20202020-d00a-4d0a-8d0a-c0aba11c000a';
const FOLDER_WORKFLOWS = '20202020-b007-4b07-8b07-c0aba11c0007';

export const STANDARD_NAVIGATION_MENU_ITEMS = {
  // ── FOLDERS ──────────────────────────────────────────────────────
  myWorkFolder: {
    universalIdentifier: '20202020-d001-4d01-8d01-c0aba11c0001',
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `My Work`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconHome',
    position: 0,
  },
  crmFolder: {
    universalIdentifier: FOLDER_CRM,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `CRM`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconBuildingSkyscraper',
    position: 1,
  },
  recruitmentFolder: {
    universalIdentifier: FOLDER_RECRUITMENT,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Recruitment`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconUserSearch',
    position: 2,
  },
  teamFolder: {
    universalIdentifier: FOLDER_TEAM,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Team`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconUsers',
    position: 3,
  },
  hrFolder: {
    universalIdentifier: FOLDER_HR,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `HR`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconHeart',
    position: 4,
  },
  payrollFolder: {
    universalIdentifier: FOLDER_PAYROLL,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Payroll`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconCash',
    position: 5,
  },
  documentsFolder: {
    universalIdentifier: FOLDER_DOCUMENTS,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Documents`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconFile',
    position: 6,
  },
  financeFolder: {
    universalIdentifier: FOLDER_FINANCE,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Finance`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconReceipt',
    position: 7,
  },
  analyticsFolder: {
    universalIdentifier: FOLDER_ANALYTICS,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Analytics`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconChartBar',
    position: 8,
  },
  adminFolder: {
    universalIdentifier: FOLDER_ADMIN,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Admin`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconSettings',
    position: 9,
  },

  // ── MY WORK ──────────────────────────────────────────────────────
  allTasks: {
    universalIdentifier: '20202020-b006-4b06-8b06-c0aba11c0006',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.task.views.allTasks.universalIdentifier,
    folderUniversalIdentifier: FOLDER_MY_WORK,
    position: 0,
  },
  // ── CRM ──────────────────────────────────────────────────────────
  allCompanies: {
    universalIdentifier: '20202020-b001-4b01-8b01-c0aba11c0001',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.company.views.allCompanies.universalIdentifier,
    folderUniversalIdentifier: FOLDER_CRM,
    position: 0,
  },
  allPeople: {
    universalIdentifier: '20202020-b005-4b05-8b05-c0aba11c0005',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.person.views.allPeople.universalIdentifier,
    folderUniversalIdentifier: FOLDER_CRM,
    position: 1,
  },
  allOpportunities: {
    universalIdentifier: '20202020-b004-4b04-8b04-c0aba11c0004',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.opportunity.views.allOpportunities.universalIdentifier,
    folderUniversalIdentifier: FOLDER_CRM,
    position: 2,
  },

  // ── RECRUITMENT ──────────────────────────────────────────────────
  allRequirements: {
    universalIdentifier: '20202020-c001-4c01-8c01-c0aba11c0101',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.requirement.views.allRequirements.universalIdentifier,
    folderUniversalIdentifier: FOLDER_RECRUITMENT,
    position: 0,
  },
  allCandidates: {
    universalIdentifier: '20202020-c002-4c02-8c02-c0aba11c0102',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.candidate.views.allCandidates.universalIdentifier,
    folderUniversalIdentifier: FOLDER_RECRUITMENT,
    position: 1,
  },
  allCandidateSubmissions: {
    universalIdentifier: '20202020-c003-4c03-8c03-c0aba11c0103',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.candidateSubmission.views.allSubmissions
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_RECRUITMENT,
    position: 2,
  },
  allInterviews: {
    universalIdentifier: '20202020-c004-4c04-8c04-c0aba11c0104',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.interview.views.allInterviews.universalIdentifier,
    folderUniversalIdentifier: FOLDER_RECRUITMENT,
    position: 3,
  },

  // ── TEAM ─────────────────────────────────────────────────────────
  allEmployees: {
    universalIdentifier: '20202020-c005-4c05-8c05-c0aba11c0105',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.employee.views.allEmployees.universalIdentifier,
    folderUniversalIdentifier: FOLDER_TEAM,
    position: 0,
  },
  allDepartments: {
    universalIdentifier: '20202020-c006-4c06-8c06-c0aba11c0106',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.department.views.allDepartments.universalIdentifier,
    folderUniversalIdentifier: FOLDER_TEAM,
    position: 1,
  },
  allTeams: {
    universalIdentifier: '20202020-c007-4c07-8c07-c0aba11c0107',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.team.views.allTeams.universalIdentifier,
    folderUniversalIdentifier: FOLDER_TEAM,
    position: 2,
  },
  allDesignations: {
    universalIdentifier: '20202020-c008-4c08-8c08-c0aba11c0108',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.designation.views.allDesignations.universalIdentifier,
    folderUniversalIdentifier: FOLDER_TEAM,
    position: 3,
  },

  // ── HR ───────────────────────────────────────────────────────────
  allOnboardingItems: {
    universalIdentifier: '20202020-c00d-4c0d-8c0d-c0aba11c010d',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.onboardingItem.views.allOnboardingItems
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_HR,
    position: 0,
  },
  allAttendanceDays: {
    universalIdentifier: '20202020-c009-4c09-8c09-c0aba11c0109',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.attendanceDay.views.allAttendanceDays.universalIdentifier,
    folderUniversalIdentifier: FOLDER_HR,
    position: 1,
  },
  allLeaveRequests: {
    universalIdentifier: '20202020-c00a-4c0a-8c0a-c0aba11c010a',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.leaveRequest.views.allLeaveRequests.universalIdentifier,
    folderUniversalIdentifier: FOLDER_HR,
    position: 2,
  },
  allRosterAssignments: {
    universalIdentifier: '20202020-c00c-4c0c-8c0c-c0aba11c010c',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.rosterAssignment.views.allRosterAssignments
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_HR,
    position: 3,
  },
  allShifts: {
    universalIdentifier: '20202020-c00b-4c0b-8c0b-c0aba11c010b',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.shift.views.allShifts.universalIdentifier,
    folderUniversalIdentifier: FOLDER_HR,
    position: 4,
  },

  // ── PAYROLL ──────────────────────────────────────────────────────
  allSalaryStructures: {
    universalIdentifier: '20202020-c00e-4c0e-8c0e-c0aba11c010e',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.salaryStructure.views.allSalaryStructures
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_PAYROLL,
    position: 0,
  },
  allPayrollPeriods: {
    universalIdentifier: '20202020-c00f-4c0f-8c0f-c0aba11c010f',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payrollPeriod.views.allPayrollPeriods.universalIdentifier,
    folderUniversalIdentifier: FOLDER_PAYROLL,
    position: 1,
  },
  allPayslips: {
    universalIdentifier: '20202020-c010-4c10-8c10-c0aba11c0110',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payslip.views.allPayslips.universalIdentifier,
    folderUniversalIdentifier: FOLDER_PAYROLL,
    position: 2,
  },
  allPayrollAdjustments: {
    universalIdentifier: '20202020-c011-4c11-8c11-c0aba11c0111',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payrollAdjustment.views.allPayrollAdjustments
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_PAYROLL,
    position: 3,
  },

  // ── DOCUMENTS ────────────────────────────────────────────────────
  allNotes: {
    universalIdentifier: '20202020-b003-4b03-8b03-c0aba11c0003',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.note.views.allNotes.universalIdentifier,
    folderUniversalIdentifier: FOLDER_DOCUMENTS,
    position: 0,
  },

  // ── FINANCE ──────────────────────────────────────────────────────
  allInvoices: {
    universalIdentifier: '20202020-c012-4c12-8c12-c0aba11c0112',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.invoice.views.allInvoices.universalIdentifier,
    folderUniversalIdentifier: FOLDER_FINANCE,
    position: 0,
  },
  allPayments: {
    universalIdentifier: '20202020-c013-4c13-8c13-c0aba11c0113',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payment.views.allPayments.universalIdentifier,
    folderUniversalIdentifier: FOLDER_FINANCE,
    position: 1,
  },

  // ── ANALYTICS ────────────────────────────────────────────────────
  allDashboards: {
    universalIdentifier: '20202020-b002-4b02-8b02-c0aba11c0002',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.views.allDashboards.universalIdentifier,
    folderUniversalIdentifier: FOLDER_ANALYTICS,
    position: 0,
  },

  // ── ADMIN ────────────────────────────────────────────────────────
  workflowsFolder: {
    universalIdentifier: FOLDER_WORKFLOWS,
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Workflows`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconSettingsAutomation',
    folderUniversalIdentifier: FOLDER_ADMIN,
    position: 0,
  },
  workflowsFolderAllWorkflows: {
    universalIdentifier: '20202020-b008-4b08-8b08-c0aba11c0008',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflow.views.allWorkflows.universalIdentifier,
    folderUniversalIdentifier: FOLDER_WORKFLOWS,
    position: 0,
  },
  workflowsFolderAllWorkflowRuns: {
    universalIdentifier: '20202020-b009-4b09-8b09-c0aba11c0009',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.views.allWorkflowRuns.universalIdentifier,
    folderUniversalIdentifier: FOLDER_WORKFLOWS,
    position: 1,
  },
  workflowsFolderAllWorkflowVersions: {
    universalIdentifier: '20202020-b00a-4b0a-8b0a-c0aba11c000a',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.views.allWorkflowVersions
        .universalIdentifier,
    folderUniversalIdentifier: FOLDER_WORKFLOWS,
    position: 2,
  },
} as const;

export const STANDARD_NAVIGATION_MENU_ITEM_DEFAULT_COLORS: Partial<
  Record<keyof typeof STANDARD_NAVIGATION_MENU_ITEMS, string>
> = {
  // Folders
  myWorkFolder: 'turquoise',
  crmFolder: 'blue',
  recruitmentFolder: 'green',
  teamFolder: 'blue',
  hrFolder: 'orange',
  payrollFolder: 'purple',
  documentsFolder: 'gray',
  financeFolder: 'red',
  analyticsFolder: 'gray',
  adminFolder: 'gray',

  // My Work
  allTasks: 'turquoise',

  // CRM
  allCompanies: 'blue',
  allPeople: 'blue',
  allOpportunities: 'red',

  // Recruitment
  allRequirements: 'green',
  allCandidates: 'green',
  allCandidateSubmissions: 'green',
  allInterviews: 'green',

  // Team
  allEmployees: 'blue',
  allDepartments: 'blue',
  allTeams: 'blue',
  allDesignations: 'blue',

  // HR
  allOnboardingItems: 'orange',
  allAttendanceDays: 'orange',
  allLeaveRequests: 'orange',
  allRosterAssignments: 'orange',
  allShifts: 'orange',

  // Payroll
  allSalaryStructures: 'purple',
  allPayrollPeriods: 'purple',
  allPayslips: 'purple',
  allPayrollAdjustments: 'purple',

  // Documents
  allNotes: 'gray',

  // Finance
  allInvoices: 'red',
  allPayments: 'red',

  // Analytics
  allDashboards: 'gray',

  // Admin
  workflowsFolder: 'orange',
  workflowsFolderAllWorkflows: 'gray',
  workflowsFolderAllWorkflowRuns: 'gray',
  workflowsFolderAllWorkflowVersions: 'gray',
};
