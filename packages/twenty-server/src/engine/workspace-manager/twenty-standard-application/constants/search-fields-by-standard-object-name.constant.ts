import { FieldMetadataType } from 'twenty-shared/types';

import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';

export const SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME = {
  attachment: [{ name: 'name', type: FieldMetadataType.TEXT }],
  blocklist: [{ name: 'handle', type: FieldMetadataType.TEXT }],
  calendarChannelEventAssociation: [
    { name: 'eventExternalId', type: FieldMetadataType.TEXT },
  ],
  candidate: [{ name: 'name', type: FieldMetadataType.FULL_NAME }],
  candidateSubmission: [{ name: 'id', type: FieldMetadataType.UUID }],
  calendarEvent: [{ name: 'title', type: FieldMetadataType.TEXT }],
  calendarEventTarget: [{ name: 'id', type: FieldMetadataType.UUID }],
  calendarEventParticipant: [{ name: 'handle', type: FieldMetadataType.TEXT }],
  callRecording: [{ name: 'title', type: FieldMetadataType.TEXT }],
  company: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'domainName', type: FieldMetadataType.LINKS },
  ],
  dashboard: [{ name: 'title', type: FieldMetadataType.TEXT }],
  interview: [
    { name: 'title', type: FieldMetadataType.TEXT },
    { name: 'meetingLink', type: FieldMetadataType.LINKS },
  ],
  message: [{ name: 'subject', type: FieldMetadataType.TEXT }],
  messageCampaign: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'subject', type: FieldMetadataType.TEXT },
  ],
  messageChannelMessageAssociation: [
    { name: 'messageExternalId', type: FieldMetadataType.TEXT },
  ],
  messageChannelMessageAssociationMessageFolder: [],
  messageList: [{ name: 'name', type: FieldMetadataType.TEXT }],
  messageListMember: [{ name: 'id', type: FieldMetadataType.UUID }],
  messageParticipant: [{ name: 'handle', type: FieldMetadataType.TEXT }],
  messageThread: [{ name: 'subject', type: FieldMetadataType.TEXT }],
  messageThreadTarget: [{ name: 'id', type: FieldMetadataType.UUID }],
  note: [
    { name: 'title', type: FieldMetadataType.TEXT },
    { name: 'bodyV2', type: FieldMetadataType.RICH_TEXT },
  ],
  noteTarget: [{ name: 'id', type: FieldMetadataType.UUID }],
  opportunity: [{ name: 'name', type: FieldMetadataType.TEXT }],
  requirement: [
    { name: 'title', type: FieldMetadataType.TEXT },
    { name: 'rolePosition', type: FieldMetadataType.TEXT },
  ],
  person: [
    { name: 'name', type: FieldMetadataType.FULL_NAME },
    { name: 'emails', type: FieldMetadataType.EMAILS },
    { name: 'phones', type: FieldMetadataType.PHONES },
    { name: 'jobTitle', type: FieldMetadataType.TEXT },
  ],
  employee: [
    { name: 'employeeCode', type: FieldMetadataType.TEXT },
    { name: 'workLocation', type: FieldMetadataType.TEXT },
  ],
  shift: [
    { name: 'name', type: FieldMetadataType.TEXT },
  ],
  leaveType: [
    { name: 'name', type: FieldMetadataType.TEXT },
  ],
  payrollPeriod: [
    { name: 'name', type: FieldMetadataType.TEXT },
  ],
  invoice: [
    { name: 'invoiceNumber', type: FieldMetadataType.TEXT },
    { name: 'notes', type: FieldMetadataType.TEXT },
  ],
  recordShare: [],
  task: [
    { name: 'title', type: FieldMetadataType.TEXT },
    { name: 'bodyV2', type: FieldMetadataType.RICH_TEXT },
  ],
  taskTarget: [{ name: 'id', type: FieldMetadataType.UUID }],
  timelineActivity: [
    { name: 'linkedRecordCachedName', type: FieldMetadataType.TEXT },
  ],
  workflow: [{ name: 'name', type: FieldMetadataType.TEXT }],
  workflowAutomatedTrigger: [{ name: 'id', type: FieldMetadataType.UUID }],
  workflowRun: [{ name: 'name', type: FieldMetadataType.TEXT }],
  workflowVersion: [{ name: 'name', type: FieldMetadataType.TEXT }],
  workspaceMember: [
    { name: 'name', type: FieldMetadataType.FULL_NAME },
    { name: 'userEmail', type: FieldMetadataType.TEXT },
  ],
  team: [{ name: 'name', type: FieldMetadataType.TEXT }],
  department: [{ name: 'name', type: FieldMetadataType.TEXT }],
  designation: [{ name: 'title', type: FieldMetadataType.TEXT }],
  location: [{ name: 'name', type: FieldMetadataType.TEXT }],
  onboardingItem: [{ name: 'title', type: FieldMetadataType.TEXT }],
  rosterAssignment: [{ name: 'id', type: FieldMetadataType.UUID }],
  attendanceEvent: [{ name: 'id', type: FieldMetadataType.UUID }],
  attendanceDay: [{ name: 'id', type: FieldMetadataType.UUID }],
  attendanceCorrection: [
    { name: 'id', type: FieldMetadataType.UUID },
    { name: 'reason', type: FieldMetadataType.TEXT },
    { name: 'reviewNotes', type: FieldMetadataType.TEXT },
  ],
  leaveRequest: [
    { name: 'id', type: FieldMetadataType.UUID },
    { name: 'reason', type: FieldMetadataType.TEXT },
  ],
  leaveBalance: [{ name: 'id', type: FieldMetadataType.UUID }],
  salaryStructure: [{ name: 'id', type: FieldMetadataType.UUID }],
  salaryComponent: [{ name: 'name', type: FieldMetadataType.TEXT }],
  payslip: [
    { name: 'id', type: FieldMetadataType.UUID },
    { name: 'paymentReference', type: FieldMetadataType.TEXT },
  ],
  payslipLine: [{ name: 'label', type: FieldMetadataType.TEXT }],
  payrollAdjustment: [{ name: 'id', type: FieldMetadataType.UUID }],
  payment: [
    { name: 'id', type: FieldMetadataType.UUID },
    { name: 'reference', type: FieldMetadataType.TEXT },
    { name: 'notes', type: FieldMetadataType.TEXT },
  ],
} satisfies {
  [ObjectName in AllStandardObjectName]: {
    name: AllStandardObjectFieldName<ObjectName>;
    type: FieldMetadataType;
  }[];
};
