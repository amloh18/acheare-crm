import { type FieldMetadataType } from 'twenty-shared/types';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { buildAttachmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-attachment-standard-flat-field-metadata.util';
import { buildBlocklistStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-blocklist-standard-flat-field-metadata.util';
import { buildCalendarChannelEventAssociationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-channel-event-association-standard-flat-field-metadata.util';
import { buildCandidateStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-candidate-standard-flat-field-metadata.util';
import { buildCandidateSubmissionStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-candidate-submission-standard-flat-field-metadata.util';
import { buildCalendarEventParticipantStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-event-participant-standard-flat-field-metadata.util';
import { buildCalendarEventStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-event-standard-flat-field-metadata.util';
import { buildCalendarEventTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-event-target-standard-flat-field-metadata.util';
import { buildCallRecordingStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-call-recording-standard-flat-field-metadata.util';
import { buildCompanyStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-company-standard-flat-field-metadata.util';
import { buildInterviewStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-interview-standard-flat-field-metadata.util';
import { buildDashboardStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-dashboard-standard-flat-field-metadata.util';
import { buildMessageCampaignStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-campaign-standard-flat-field-metadata.util';
import { buildMessageListStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-list-standard-flat-field-metadata.util';
import { buildMessageListMemberStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-list-member-standard-flat-field-metadata.util';
import { buildMessageChannelMessageAssociationMessageFolderStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-channel-message-association-message-folder-standard-flat-field-metadata.util';
import { buildMessageChannelMessageAssociationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-channel-message-association-standard-flat-field-metadata.util';
import { buildMessageParticipantStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-participant-standard-flat-field-metadata.util';
import { buildMessageStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-standard-flat-field-metadata.util';
import { buildMessageThreadStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-thread-standard-flat-field-metadata.util';
import { buildMessageThreadTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-thread-target-standard-flat-field-metadata.util';
import { buildNoteStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-note-standard-flat-field-metadata.util';
import { buildNoteTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-note-target-standard-flat-field-metadata.util';
import { buildOpportunityStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-opportunity-standard-flat-field-metadata.util';
import { buildPersonStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-person-standard-flat-field-metadata.util';
import { buildRecordShareStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-record-share-standard-flat-field-metadata.util';
import { buildRequirementStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-requirement-standard-flat-field-metadata.util';
import { buildTaskStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-task-standard-flat-field-metadata.util';
import { buildTaskTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-task-target-standard-flat-field-metadata.util';
import { buildTimelineActivityStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-timeline-activity-standard-flat-field-metadata.util';
import { buildWorkflowAutomatedTriggerStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-automated-trigger-standard-flat-field-metadata.util';
import { buildWorkflowRunStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-run-standard-flat-field-metadata.util';
import { buildWorkflowStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-standard-flat-field-metadata.util';
import { buildWorkflowVersionStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-version-standard-flat-field-metadata.util';
import { buildWorkspaceMemberStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workspace-member-standard-flat-field-metadata.util';
import { type CreateStandardFieldArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';import { buildDesignationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-designation-standard-flat-field-metadata.util';
import { buildEmployeeStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-employee-standard-flat-field-metadata.util';
import { buildDepartmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-department-standard-flat-field-metadata.util';
import { buildOnboardingItemStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-onboardingItem-standard-flat-field-metadata.util';
import { buildShiftStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-shift-standard-flat-field-metadata.util';
import { buildRosterAssignmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-rosterAssignment-standard-flat-field-metadata.util';
import { buildAttendanceEventStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-attendanceEvent-standard-flat-field-metadata.util';
import { buildAttendanceDayStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-attendanceDay-standard-flat-field-metadata.util';
import { buildAttendanceCorrectionStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-attendanceCorrection-standard-flat-field-metadata.util';
import { buildLeaveTypeStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-leaveType-standard-flat-field-metadata.util';
import { buildLeaveRequestStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-leaveRequest-standard-flat-field-metadata.util';
import { buildLeaveBalanceStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-leaveBalance-standard-flat-field-metadata.util';
import { buildSalaryStructureStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-salaryStructure-standard-flat-field-metadata.util';
import { buildSalaryComponentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-salaryComponent-standard-flat-field-metadata.util';
import { buildPayrollPeriodStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-payrollPeriod-standard-flat-field-metadata.util';
import { buildPayslipStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-payslip-standard-flat-field-metadata.util';
import { buildPayslipLineStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-payslipLine-standard-flat-field-metadata.util';
import { buildPayrollAdjustmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-payrollAdjustment-standard-flat-field-metadata.util';
import { buildInvoiceStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-invoice-standard-flat-field-metadata.util';
import { buildPaymentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-payment-standard-flat-field-metadata.util';
import { buildLocationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-location-standard-flat-field-metadata.util';
import { buildTeamStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-team-standard-flat-field-metadata.util';


type StandardFieldBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardFieldArgs<P, FieldMetadataType>, 'context'>,
) => Record<string, FlatFieldMetadata>;

const STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME = {
  payment: buildPaymentStandardFlatFieldMetadatas,
  invoice: buildInvoiceStandardFlatFieldMetadatas,
  payrollAdjustment: buildPayrollAdjustmentStandardFlatFieldMetadatas,
  payslipLine: buildPayslipLineStandardFlatFieldMetadatas,
  payslip: buildPayslipStandardFlatFieldMetadatas,
  payrollPeriod: buildPayrollPeriodStandardFlatFieldMetadatas,
  salaryComponent: buildSalaryComponentStandardFlatFieldMetadatas,
  salaryStructure: buildSalaryStructureStandardFlatFieldMetadatas,
  leaveBalance: buildLeaveBalanceStandardFlatFieldMetadatas,
  leaveRequest: buildLeaveRequestStandardFlatFieldMetadatas,
  leaveType: buildLeaveTypeStandardFlatFieldMetadatas,
  attendanceCorrection: buildAttendanceCorrectionStandardFlatFieldMetadatas,
  attendanceDay: buildAttendanceDayStandardFlatFieldMetadatas,
  attendanceEvent: buildAttendanceEventStandardFlatFieldMetadatas,
  rosterAssignment: buildRosterAssignmentStandardFlatFieldMetadatas,
  shift: buildShiftStandardFlatFieldMetadatas,
  onboardingItem: buildOnboardingItemStandardFlatFieldMetadatas,
  designation: buildDesignationStandardFlatFieldMetadatas,
  employee: buildEmployeeStandardFlatFieldMetadatas,
  department: buildDepartmentStandardFlatFieldMetadatas,
  attachment: buildAttachmentStandardFlatFieldMetadatas,
  blocklist: buildBlocklistStandardFlatFieldMetadatas,
  candidate: buildCandidateStandardFlatFieldMetadatas,
  candidateSubmission: buildCandidateSubmissionStandardFlatFieldMetadatas,
  calendarChannelEventAssociation:
    buildCalendarChannelEventAssociationStandardFlatFieldMetadatas,
  calendarEventParticipant:
    buildCalendarEventParticipantStandardFlatFieldMetadatas,
  calendarEvent: buildCalendarEventStandardFlatFieldMetadatas,
  calendarEventTarget: buildCalendarEventTargetStandardFlatFieldMetadatas,
  callRecording: buildCallRecordingStandardFlatFieldMetadatas,
  company: buildCompanyStandardFlatFieldMetadatas,
  interview: buildInterviewStandardFlatFieldMetadatas,
  dashboard: buildDashboardStandardFlatFieldMetadatas,
  messageCampaign: buildMessageCampaignStandardFlatFieldMetadatas,
  messageList: buildMessageListStandardFlatFieldMetadatas,
  messageListMember: buildMessageListMemberStandardFlatFieldMetadatas,
  message: buildMessageStandardFlatFieldMetadatas,
  messageChannelMessageAssociation:
    buildMessageChannelMessageAssociationStandardFlatFieldMetadatas,
  messageChannelMessageAssociationMessageFolder:
    buildMessageChannelMessageAssociationMessageFolderStandardFlatFieldMetadatas,
  messageParticipant: buildMessageParticipantStandardFlatFieldMetadatas,
  messageThread: buildMessageThreadStandardFlatFieldMetadatas,
  messageThreadTarget: buildMessageThreadTargetStandardFlatFieldMetadatas,
  note: buildNoteStandardFlatFieldMetadatas,
  noteTarget: buildNoteTargetStandardFlatFieldMetadatas,
  opportunity: buildOpportunityStandardFlatFieldMetadatas,
  person: buildPersonStandardFlatFieldMetadatas,
  recordShare: buildRecordShareStandardFlatFieldMetadatas,
  requirement: buildRequirementStandardFlatFieldMetadatas,
  task: buildTaskStandardFlatFieldMetadatas,
  taskTarget: buildTaskTargetStandardFlatFieldMetadatas,
  timelineActivity: buildTimelineActivityStandardFlatFieldMetadatas,
  workflow: buildWorkflowStandardFlatFieldMetadatas,
  workflowAutomatedTrigger:
    buildWorkflowAutomatedTriggerStandardFlatFieldMetadatas,
  workflowRun: buildWorkflowRunStandardFlatFieldMetadatas,
  workflowVersion: buildWorkflowVersionStandardFlatFieldMetadatas,
  workspaceMember: buildWorkspaceMemberStandardFlatFieldMetadatas,
  team: buildTeamStandardFlatFieldMetadatas,
  location: buildLocationStandardFlatFieldMetadatas,
} satisfies {
  [P in AllStandardObjectName]: StandardFieldBuilder<P>;
};

export const buildStandardFlatFieldMetadataMaps = (
  args: Omit<
    CreateStandardFieldArgs<AllStandardObjectName, FieldMetadataType>,
    'context' | 'objectName'
  >,
): FlatEntityMaps<FlatFieldMetadata> => {
  const allFieldMetadatas: FlatFieldMetadata[] = (
    Object.keys(
      STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardFieldBuilder<typeof objectName> =
      STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result);
  });

  let flatFieldMetadataMaps = createEmptyFlatEntityMaps();

  for (const fieldMetadata of allFieldMetadatas) {
    flatFieldMetadataMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: fieldMetadata,
      flatEntityMaps: flatFieldMetadataMaps,
    });
  }

  return flatFieldMetadataMaps;
};
