import { registerEnumType } from '@nestjs/graphql';

import { type APP_LOCALES } from 'twenty-shared/translations';
import { type FullNameMetadata } from 'twenty-shared/types';
import { type Relation } from 'typeorm';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type BlocklistWorkspaceEntity } from 'src/modules/blocklist/standard-objects/blocklist.workspace-entity';
import { type CalendarEventParticipantWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type CompanyPersonRelationshipWorkspaceEntity } from 'src/modules/company/standard-objects/company-person-relationship.workspace-entity';
import { type PayrollAdjustmentWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollAdjustment.workspace-entity';
import { type OnboardingItemWorkspaceEntity } from 'src/modules/hr/standard-objects/onboardingItem.workspace-entity';
import { type AttendanceCorrectionWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceCorrection.workspace-entity';
import { type LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { type DepartmentWorkspaceEntity } from 'src/modules/hr/standard-objects/department.workspace-entity';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type ApplicationStageHistoryWorkspaceEntity } from 'src/modules/recruitment/standard-objects/application-stage-history.workspace-entity';
import { type CandidateWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate.workspace-entity';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { type InterviewWorkspaceEntity } from 'src/modules/recruitment/standard-objects/interview.workspace-entity';
import { type RequirementWorkspaceEntity } from 'src/modules/recruitment/standard-objects/requirement.workspace-entity';
import { type TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

export enum WorkspaceMemberDateFormatEnum {
  SYSTEM = 'SYSTEM',
  MONTH_FIRST = 'MONTH_FIRST',
  DAY_FIRST = 'DAY_FIRST',
  YEAR_FIRST = 'YEAR_FIRST',
}

export enum WorkspaceMemberTimeFormatEnum {
  SYSTEM = 'SYSTEM',
  HOUR_12 = 'HOUR_12',
  HOUR_24 = 'HOUR_24',
}

export enum WorkspaceMemberNumberFormatEnum {
  SYSTEM = 'SYSTEM',
  COMMAS_AND_DOT = 'COMMAS_AND_DOT',
  SPACES_AND_COMMA = 'SPACES_AND_COMMA',
  DOTS_AND_COMMA = 'DOTS_AND_COMMA',
  APOSTROPHE_AND_DOT = 'APOSTROPHE_AND_DOT',
}

registerEnumType(WorkspaceMemberNumberFormatEnum, {
  name: 'WorkspaceMemberNumberFormatEnum',
  description: 'Number format for displaying numbers',
});

registerEnumType(WorkspaceMemberTimeFormatEnum, {
  name: 'WorkspaceMemberTimeFormatEnum',
  description: 'Time time as Military, Standard or system as default',
});

registerEnumType(WorkspaceMemberDateFormatEnum, {
  name: 'WorkspaceMemberDateFormatEnum',
  description:
    'Date format as Month first, Day first, Year first or system as default',
});

export class WorkspaceMemberWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  name: FullNameMetadata;
  colorScheme: string;
  uiScale: string;
  openRecordIn: string;
  locale: keyof typeof APP_LOCALES;
  avatarUrl: string | null;
  userEmail: string | null;
  jobTitle: string | null;
  calendarStartDay: number;
  userId: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  assignedTasks: Relation<TaskWorkspaceEntity[]>;
  accountOwnerForCompanies: Relation<CompanyWorkspaceEntity[]>;
  authoredAttachments: Relation<AttachmentWorkspaceEntity[]>;
  messageParticipants: Relation<MessageParticipantWorkspaceEntity[]>;
  blocklist: Relation<BlocklistWorkspaceEntity[]>;
  calendarEventParticipants: Relation<
    CalendarEventParticipantWorkspaceEntity[]
  >;
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
  ownedOpportunities: Relation<OpportunityWorkspaceEntity[]>;
  ownedRequirements: Relation<RequirementWorkspaceEntity[]>;
  hrOwnedRequirements: Relation<RequirementWorkspaceEntity[]>;
  recruiterOwnedRequirements: Relation<RequirementWorkspaceEntity[]>;
  ownedCandidates: Relation<CandidateWorkspaceEntity[]>;
  submittedSubmissions: Relation<CandidateSubmissionWorkspaceEntity[]>;
  hrOwnedSubmissions: Relation<CandidateSubmissionWorkspaceEntity[]>;
  ownedInterviews: Relation<InterviewWorkspaceEntity[]>;
  ownedCompanyPersonRelationships: Relation<
    CompanyPersonRelationshipWorkspaceEntity[]
  >;
  changedApplicationStageHistories: Relation<
    ApplicationStageHistoryWorkspaceEntity[]
  >;
  approvedPayrollAdjustments: Relation<PayrollAdjustmentWorkspaceEntity[]>;
  onboardingItems: Relation<OnboardingItemWorkspaceEntity[]>;
  attendanceCorrections: Relation<AttendanceCorrectionWorkspaceEntity[]>;
  leaveRequests: Relation<LeaveRequestWorkspaceEntity[]>;
  departments: Relation<DepartmentWorkspaceEntity[]>;
  searchVector: string;
  numberFormat: string;
}
