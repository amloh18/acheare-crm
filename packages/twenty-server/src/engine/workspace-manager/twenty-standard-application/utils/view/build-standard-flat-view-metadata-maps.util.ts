import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { computeStandardAttachmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attachment-views.util';
import { computeStandardBlocklistViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-blocklist-views.util';
import { computeStandardCalendarChannelEventAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-channel-event-association-views.util';
import { computeStandardCalendarEventParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-participant-views.util';
import { computeStandardCandidateViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-candidate-views.util';
import { computeStandardCandidateSubmissionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-candidate-submission-views.util';
import { computeStandardCalendarEventViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-views.util';
import { computeStandardCallRecordingViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-call-recording-views.util';
import { computeStandardCompanyViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-company-views.util';
import { computeStandardInterviewViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-interview-views.util';
import { computeStandardDashboardViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-dashboard-views.util';
import { computeStandardMessageCampaignViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-campaign-views.util';
import { computeStandardMessageChannelMessageAssociationMessageFolderViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-message-folder-views.util';
import { computeStandardMessageChannelMessageAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-views.util';
import { computeStandardMessageListViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-list-views.util';
import { computeStandardMessageListMemberViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-list-member-views.util';
import { computeStandardMessageParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-participant-views.util';
import { computeStandardMessageThreadViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-thread-views.util';
import { computeStandardMessageViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-views.util';
import { computeStandardNoteTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-target-views.util';
import { computeStandardNoteViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-views.util';
import { computeStandardOpportunityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-opportunity-views.util';
import { computeStandardPersonViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-person-views.util';
import { computeStandardRequirementViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-requirement-views.util';
import { computeStandardTaskTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-target-views.util';
import { computeStandardTaskViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-views.util';
import { computeStandardTimelineActivityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-timeline-activity-views.util';
import { computeStandardWorkflowAutomatedTriggerViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-automated-trigger-views.util';
import { computeStandardWorkflowRunViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-run-views.util';
import { computeStandardWorkflowVersionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-version-views.util';
import { computeStandardWorkflowViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-views.util';
import { computeStandardWorkspaceMemberViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workspace-member-views.util';
import { type CreateStandardViewArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';import { computeStandardEmployeeViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-employee-views.util';
import { computeStandardOnboardingItemViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-onboardingItem-views.util';
import { computeStandardShiftViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-shift-views.util';
import { computeStandardRosterAssignmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-rosterAssignment-views.util';
import { computeStandardAttendanceEventViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attendanceEvent-views.util';
import { computeStandardAttendanceDayViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attendanceDay-views.util';
import { computeStandardAttendanceCorrectionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attendanceCorrection-views.util';
import { computeStandardLeaveTypeViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-leaveType-views.util';
import { computeStandardLeaveRequestViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-leaveRequest-views.util';
import { computeStandardLeaveBalanceViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-leaveBalance-views.util';
import { computeStandardSalaryStructureViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-salaryStructure-views.util';
import { computeStandardSalaryComponentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-salaryComponent-views.util';
import { computeStandardPayrollPeriodViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-payrollPeriod-views.util';
import { computeStandardPayslipViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-payslip-views.util';
import { computeStandardPayslipLineViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-payslipLine-views.util';
import { computeStandardPayrollAdjustmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-payrollAdjustment-views.util';
import { computeStandardInvoiceViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-invoice-views.util';
import { computeStandardPaymentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-payment-views.util';


type StandardViewBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardViewArgs<P>, 'context'>,
) => Record<string, FlatView>;

const STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME = {
  payment: computeStandardPaymentViews,
  invoice: computeStandardInvoiceViews,
  payrollAdjustment: computeStandardPayrollAdjustmentViews,
  payslipLine: computeStandardPayslipLineViews,
  payslip: computeStandardPayslipViews,
  payrollPeriod: computeStandardPayrollPeriodViews,
  salaryComponent: computeStandardSalaryComponentViews,
  salaryStructure: computeStandardSalaryStructureViews,
  leaveBalance: computeStandardLeaveBalanceViews,
  leaveRequest: computeStandardLeaveRequestViews,
  leaveType: computeStandardLeaveTypeViews,
  attendanceCorrection: computeStandardAttendanceCorrectionViews,
  attendanceDay: computeStandardAttendanceDayViews,
  attendanceEvent: computeStandardAttendanceEventViews,
  rosterAssignment: computeStandardRosterAssignmentViews,
  shift: computeStandardShiftViews,
  onboardingItem: computeStandardOnboardingItemViews,
  employee: computeStandardEmployeeViews,
  attachment: computeStandardAttachmentViews,
  blocklist: computeStandardBlocklistViews,
  candidate: computeStandardCandidateViews,
  candidateSubmission: computeStandardCandidateSubmissionViews,
  calendarChannelEventAssociation:
    computeStandardCalendarChannelEventAssociationViews,
  calendarEvent: computeStandardCalendarEventViews,
  calendarEventParticipant: computeStandardCalendarEventParticipantViews,
  callRecording: computeStandardCallRecordingViews,
  company: computeStandardCompanyViews,
  interview: computeStandardInterviewViews,
  dashboard: computeStandardDashboardViews,
  message: computeStandardMessageViews,
  messageCampaign: computeStandardMessageCampaignViews,
  messageChannelMessageAssociation:
    computeStandardMessageChannelMessageAssociationViews,
  messageChannelMessageAssociationMessageFolder:
    computeStandardMessageChannelMessageAssociationMessageFolderViews,
  messageList: computeStandardMessageListViews,
  messageListMember: computeStandardMessageListMemberViews,
  messageParticipant: computeStandardMessageParticipantViews,
  messageThread: computeStandardMessageThreadViews,
  note: computeStandardNoteViews,
  noteTarget: computeStandardNoteTargetViews,
  opportunity: computeStandardOpportunityViews,
  person: computeStandardPersonViews,
  requirement: computeStandardRequirementViews,
  task: computeStandardTaskViews,
  taskTarget: computeStandardTaskTargetViews,
  timelineActivity: computeStandardTimelineActivityViews,
  workflow: computeStandardWorkflowViews,
  workflowAutomatedTrigger: computeStandardWorkflowAutomatedTriggerViews,
  workflowRun: computeStandardWorkflowRunViews,
  workflowVersion: computeStandardWorkflowVersionViews,
  workspaceMember: computeStandardWorkspaceMemberViews,
} as const satisfies {
  [P in AllStandardObjectName]?: StandardViewBuilder<P>;
};

export type BuildStandardFlatViewMetadataMapsArgs = Omit<
  CreateStandardViewArgs,
  'context' | 'objectName'
>;

export const buildStandardFlatViewMetadataMaps = (
  args: BuildStandardFlatViewMetadataMapsArgs,
): FlatEntityMaps<FlatView> => {
  const allViewMetadatas: FlatView[] = (
    Object.keys(
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardViewBuilder<typeof objectName> =
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result);
  });

  let flatViewMaps = createEmptyFlatEntityMaps();

  for (const viewMetadata of allViewMetadatas) {
    flatViewMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: viewMetadata,
      flatEntityMaps: flatViewMaps,
    });
  }

  return flatViewMaps;
};
