import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { NavigationMenuItemType } from 'src/engine/metadata-modules/navigation-menu-item/enums/navigation-menu-item-type.enum';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

export const STANDARD_NAVIGATION_MENU_ITEMS = {
  allCompanies: {
    universalIdentifier: '20202020-b001-4b01-8b01-c0aba11c0001',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.company.views.allCompanies.universalIdentifier,
    position: 0,
  },
  allPeople: {
    universalIdentifier: '20202020-b005-4b05-8b05-c0aba11c0005',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.person.views.allPeople.universalIdentifier,
    position: 1,
  },
  allOpportunities: {
    universalIdentifier: '20202020-b004-4b04-8b04-c0aba11c0004',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.opportunity.views.allOpportunities.universalIdentifier,
    position: 2,
  },
  allTasks: {
    universalIdentifier: '20202020-b006-4b06-8b06-c0aba11c0006',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.task.views.allTasks.universalIdentifier,
    position: 3,
  },
  allNotes: {
    universalIdentifier: '20202020-b003-4b03-8b03-c0aba11c0003',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.note.views.allNotes.universalIdentifier,
    position: 4,
  },
  allDashboards: {
    universalIdentifier: '20202020-b002-4b02-8b02-c0aba11c0002',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.views.allDashboards.universalIdentifier,
    position: 5,
  },
  allMessageCampaigns: {
    universalIdentifier: '20202020-b00b-4b0b-8b0b-c0aba11c000b',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.messageCampaign.views.allMessageCampaigns
        .universalIdentifier,
    position: 7,
  },
  workflowsFolder: {
    universalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    type: NavigationMenuItemType.FOLDER,
    name: i18nLabel(
      msg({ message: `Workflows`, context: 'navigationMenuItem.name' }),
    ),
    icon: 'IconSettingsAutomation',
    position: 6,
  },
  workflowsFolderAllWorkflows: {
    universalIdentifier: '20202020-b008-4b08-8b08-c0aba11c0008',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflow.views.allWorkflows.universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 0,
  },
  workflowsFolderAllWorkflowRuns: {
    universalIdentifier: '20202020-b009-4b09-8b09-c0aba11c0009',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.views.allWorkflowRuns.universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 1,
  },
  workflowsFolderAllWorkflowVersions: {
    universalIdentifier: '20202020-b00a-4b0a-8b0a-c0aba11c000a',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.views.allWorkflowVersions
        .universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 2,
  },
  allRequirements: {
    universalIdentifier: '20202020-c001-4c01-8c01-c0aba11c0101',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.requirement.views.allRequirements.universalIdentifier,
    position: 9,
  },
  allCandidates: {
    universalIdentifier: '20202020-c002-4c02-8c02-c0aba11c0102',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.candidate.views.allCandidates.universalIdentifier,
    position: 10,
  },
  allCandidateSubmissions: {
    universalIdentifier: '20202020-c003-4c03-8c03-c0aba11c0103',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.candidateSubmission.views.allSubmissions
        .universalIdentifier,
    position: 11,
  },
  allInterviews: {
    universalIdentifier: '20202020-c004-4c04-8c04-c0aba11c0104',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.interview.views.allInterviews.universalIdentifier,
    position: 12,
  },
  allEmployees: {
    universalIdentifier: '20202020-c005-4c05-8c05-c0aba11c0105',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.employee.views.allEmployees.universalIdentifier,
    position: 13,
  },
  allDepartments: {
    universalIdentifier: '20202020-c006-4c06-8c06-c0aba11c0106',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.department.views.allDepartments.universalIdentifier,
    position: 14,
  },
  allTeams: {
    universalIdentifier: '20202020-c007-4c07-8c07-c0aba11c0107',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.team.views.allTeams.universalIdentifier,
    position: 15,
  },
  allDesignations: {
    universalIdentifier: '20202020-c008-4c08-8c08-c0aba11c0108',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.designation.views.allDesignations.universalIdentifier,
    position: 16,
  },
  allAttendanceDays: {
    universalIdentifier: '20202020-c009-4c09-8c09-c0aba11c0109',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.attendanceDay.views.allAttendanceDays.universalIdentifier,
    position: 17,
  },
  allLeaveRequests: {
    universalIdentifier: '20202020-c00a-4c0a-8c0a-c0aba11c010a',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.leaveRequest.views.allLeaveRequests.universalIdentifier,
    position: 18,
  },
  allShifts: {
    universalIdentifier: '20202020-c00b-4c0b-8c0b-c0aba11c010b',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.shift.views.allShifts.universalIdentifier,
    position: 19,
  },
  allRosterAssignments: {
    universalIdentifier: '20202020-c00c-4c0c-8c0c-c0aba11c010c',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.rosterAssignment.views.allRosterAssignments
        .universalIdentifier,
    position: 20,
  },
  allOnboardingItems: {
    universalIdentifier: '20202020-c00d-4c0d-8c0d-c0aba11c010d',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.onboardingItem.views.allOnboardingItems
        .universalIdentifier,
    position: 21,
  },
  allSalaryStructures: {
    universalIdentifier: '20202020-c00e-4c0e-8c0e-c0aba11c010e',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.salaryStructure.views.allSalaryStructures
        .universalIdentifier,
    position: 22,
  },
  allPayrollPeriods: {
    universalIdentifier: '20202020-c00f-4c0f-8c0f-c0aba11c010f',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payrollPeriod.views.allPayrollPeriods.universalIdentifier,
    position: 23,
  },
  allPayslips: {
    universalIdentifier: '20202020-c010-4c10-8c10-c0aba11c0110',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payslip.views.allPayslips.universalIdentifier,
    position: 24,
  },
  allPayrollAdjustments: {
    universalIdentifier: '20202020-c011-4c11-8c11-c0aba11c0111',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payrollAdjustment.views.allPayrollAdjustments
        .universalIdentifier,
    position: 25,
  },
  allInvoices: {
    universalIdentifier: '20202020-c012-4c12-8c12-c0aba11c0112',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.invoice.views.allInvoices.universalIdentifier,
    position: 26,
  },
  allPayments: {
    universalIdentifier: '20202020-c013-4c13-8c13-c0aba11c0113',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.payment.views.allPayments.universalIdentifier,
    position: 27,
  },
} as const;

export const STANDARD_NAVIGATION_MENU_ITEM_DEFAULT_COLORS: Partial<
  Record<keyof typeof STANDARD_NAVIGATION_MENU_ITEMS, string>
> = {
  allCompanies: 'blue',
  allPeople: 'blue',
  allTasks: 'turquoise',
  allNotes: 'turquoise',
  allOpportunities: 'red',
  workflowsFolder: 'orange',
  allMessageCampaigns: 'gray',
  allDashboards: 'gray',
  workflowsFolderAllWorkflows: 'gray',
  workflowsFolderAllWorkflowRuns: 'gray',
  workflowsFolderAllWorkflowVersions: 'gray',
  allRequirements: 'green',
  allCandidates: 'green',
  allCandidateSubmissions: 'green',
  allInterviews: 'green',
  allEmployees: 'blue',
  allDepartments: 'blue',
  allTeams: 'blue',
  allDesignations: 'blue',
  allAttendanceDays: 'orange',
  allLeaveRequests: 'orange',
  allShifts: 'orange',
  allRosterAssignments: 'orange',
  allOnboardingItems: 'orange',
  allSalaryStructures: 'purple',
  allPayrollPeriods: 'purple',
  allPayslips: 'purple',
  allPayrollAdjustments: 'purple',
  allInvoices: 'red',
  allPayments: 'red',
};
