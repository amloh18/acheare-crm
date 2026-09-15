import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import {
  MetadataReadability,
  MetadataWritability,
  ObjectOpenRecordIn,
} from 'twenty-shared/types';

import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import {
  type CreateStandardObjectArgs,
  createStandardObjectFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/object-metadata/create-standard-object-flat-metadata.util';

export const STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attachment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attachment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attachment.universalIdentifier,
        nameSingular: 'attachment',
        namePlural: 'attachments',
        labelSingular: i18nLabel(
          msg({
            message: `Attachment`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Attachments`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An attachment`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconFileImport',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  placement: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'placement'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'placement',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.placement.universalIdentifier,
        nameSingular: 'placement',
        namePlural: 'placements',
        labelSingular: i18nLabel(
          msg({
            message: `Placement`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Placements`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A candidate placed into a client company`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconTrophy',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  interviewParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'interviewParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'interviewParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.interviewParticipant.universalIdentifier,
        nameSingular: 'interviewParticipant',
        namePlural: 'interviewParticipants',
        labelSingular: i18nLabel(
          msg({
            message: `Interview participant`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Interview participants`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A person taking part in an interview`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUsers',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  personExternalId: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'personExternalId'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'personExternalId',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.personExternalId.universalIdentifier,
        nameSingular: 'personExternalId',
        namePlural: 'personExternalIds',
        labelSingular: i18nLabel(
          msg({
            message: `External identifier`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `External identifiers`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `External system identifier used for import deduplication`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconDatabase',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  applicationStageHistory: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'applicationStageHistory'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'applicationStageHistory',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.applicationStageHistory.universalIdentifier,
        nameSingular: 'applicationStageHistory',
        namePlural: 'applicationStageHistories',
        labelSingular: i18nLabel(
          msg({
            message: `Stage history`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Stage histories`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Audit trail of a submission moving through the recruitment pipeline`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconHistory',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  companyPersonRelationship: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'companyPersonRelationship'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'companyPersonRelationship',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.companyPersonRelationship.universalIdentifier,
        nameSingular: 'companyPersonRelationship',
        namePlural: 'companyPersonRelationships',
        labelSingular: i18nLabel(
          msg({
            message: `Company relationship`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Company relationships`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A person's role and relationship inside a company`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconAffiliate',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  blocklist: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'blocklist'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'blocklist',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.blocklist.universalIdentifier,
        nameSingular: 'blocklist',
        namePlural: 'blocklists',
        labelSingular: i18nLabel(
          msg({
            message: `Blocklist`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Blocklists`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `Blocklist`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconForbid2',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarChannelEventAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarChannelEventAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarChannelEventAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarChannelEventAssociation.universalIdentifier,
        nameSingular: 'calendarChannelEventAssociation',
        namePlural: 'calendarChannelEventAssociations',
        labelSingular: i18nLabel(
          msg({
            message: `Calendar Channel Event Association`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Calendar Channel Event Associations`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Calendar Channel Event Associations`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        writability: MetadataWritability.SYSTEM,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarEventParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEventParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEventParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarEventParticipant.universalIdentifier,
        nameSingular: 'calendarEventParticipant',
        namePlural: 'calendarEventParticipants',
        labelSingular: i18nLabel(
          msg({
            message: `Calendar event participant`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Calendar event participants`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Calendar event participants`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarEvent: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEvent'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEvent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        nameSingular: 'calendarEvent',
        openRecordIn: ObjectOpenRecordIn.SIDE_PANEL,
        namePlural: 'calendarEvents',
        labelSingular: i18nLabel(
          msg({
            message: `Calendar event`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Calendar events`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Calendar events`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarEventTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEventTarget'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEventTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarEventTarget.universalIdentifier,
        nameSingular: 'calendarEventTarget',
        namePlural: 'calendarEventTargets',
        labelSingular: i18nLabel(
          msg({
            message: `Calendar Event Target`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Calendar Event Targets`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A calendar event target`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  callRecording: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'callRecording'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'callRecording',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.callRecording.universalIdentifier,
        nameSingular: 'callRecording',
        namePlural: 'callRecordings',
        labelSingular: i18nLabel(
          msg({
            message: `Call Recording`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Call Recordings`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A recording of a meeting`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconVideo',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  company: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'company'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'company',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.company.universalIdentifier,
        nameSingular: 'company',
        namePlural: 'companies',
        labelSingular: i18nLabel(
          msg({ message: `Company`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Companies`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `A company`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconBuildingSkyscraper',
        isSearchable: true,
        shortcut: 'C',
        duplicateCriteria: [['name'], ['domainNamePrimaryLinkUrl']],
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'domainName',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  candidate: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'candidate'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'candidate',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.candidate.universalIdentifier,
        nameSingular: 'candidate',
        namePlural: 'candidates',
        labelSingular: i18nLabel(
          msg({
            message: `Candidate`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Candidates`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A candidate`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUserPlus',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  candidateSubmission: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'candidateSubmission'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'candidateSubmission',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.candidateSubmission.universalIdentifier,
        nameSingular: 'candidateSubmission',
        namePlural: 'candidateSubmissions',
        labelSingular: i18nLabel(
          msg({
            message: `Candidate Submission`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Candidate Submissions`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A candidate submitted against a requirement`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconSend',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  designation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'designation'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'designation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.designation.universalIdentifier,
        nameSingular: 'designation',
        namePlural: 'designations',
        labelSingular: i18nLabel(
          msg({
            message: `Designation`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Designations`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A job designation or role`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconBadge',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  employee: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'employee'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'employee',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.employee.universalIdentifier,
        nameSingular: 'employee',
        namePlural: 'employees',
        labelSingular: i18nLabel(
          msg({
            message: `Employee`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Employees`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A person employed by the agency`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconBriefcase',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'employeeCode',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  department: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'department'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'department',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.department.universalIdentifier,
        nameSingular: 'department',
        namePlural: 'departments',
        labelSingular: i18nLabel(
          msg({
            message: `Department`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Departments`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An organizational department`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconBuilding',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  onboardingItem: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'onboardingItem'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'onboardingItem',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.onboardingItem.universalIdentifier,
        nameSingular: 'onboardingItem',
        namePlural: 'onboardingItems',
        labelSingular: i18nLabel(
          msg({
            message: `Onboarding Item`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Onboarding Items`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A checklist item in an employee onboarding workflow`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconListCheck',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  shift: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'shift'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'shift',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.shift.universalIdentifier,
        nameSingular: 'shift',
        namePlural: 'shifts',
        labelSingular: i18nLabel(
          msg({
            message: `Shift`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Shifts`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A work shift definition (times, break, grace, working days)`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendarTime',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  rosterAssignment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'rosterAssignment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'rosterAssignment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.rosterAssignment.universalIdentifier,
        nameSingular: 'rosterAssignment',
        namePlural: 'rosterAssignments',
        labelSingular: i18nLabel(
          msg({
            message: `Roster Assignment`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Roster Assignments`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Assigns a shift to an employee for a date range`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendarTime',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  attendanceEvent: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attendanceEvent'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attendanceEvent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attendanceEvent.universalIdentifier,
        nameSingular: 'attendanceEvent',
        namePlural: 'attendanceEvents',
        labelSingular: i18nLabel(
          msg({
            message: `Attendance Event`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Attendance Events`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Append-only attendance event (check-in, break, check-out)`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconHistory',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  attendanceDay: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attendanceDay'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attendanceDay',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attendanceDay.universalIdentifier,
        nameSingular: 'attendanceDay',
        namePlural: 'attendanceDays',
        labelSingular: i18nLabel(
          msg({
            message: `Attendance Day`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Attendance Days`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Aggregated attendance for an employee workday`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendarStats',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  attendanceCorrection: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attendanceCorrection'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attendanceCorrection',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attendanceCorrection.universalIdentifier,
        nameSingular: 'attendanceCorrection',
        namePlural: 'attendanceCorrections',
        labelSingular: i18nLabel(
          msg({
            message: `Attendance Correction`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Attendance Corrections`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Employee attendance correction request with HR review`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconFileImport',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  leaveType: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'leaveType'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'leaveType',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.leaveType.universalIdentifier,
        nameSingular: 'leaveType',
        namePlural: 'leaveTypes',
        labelSingular: i18nLabel(
          msg({
            message: `Leave Type`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Leave Types`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A type of leave with quota and paid flag`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconVacation',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  leaveRequest: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'leaveRequest'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'leaveRequest',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.leaveRequest.universalIdentifier,
        nameSingular: 'leaveRequest',
        namePlural: 'leaveRequests',
        labelSingular: i18nLabel(
          msg({
            message: `Leave Request`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Leave Requests`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An employee leave request with approval workflow`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconVacation',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  leaveBalance: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'leaveBalance'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'leaveBalance',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.leaveBalance.universalIdentifier,
        nameSingular: 'leaveBalance',
        namePlural: 'leaveBalances',
        labelSingular: i18nLabel(
          msg({
            message: `Leave Balance`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Leave Balances`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Yearly leave balance for an employee and leave type`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconScale',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  salaryStructure: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'salaryStructure'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'salaryStructure',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.salaryStructure.universalIdentifier,
        nameSingular: 'salaryStructure',
        namePlural: 'salaryStructures',
        labelSingular: i18nLabel(
          msg({
            message: `Salary Structure`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Salary Structures`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Versioned salary structure effective for a date range`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCurrencyDollar',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  salaryComponent: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'salaryComponent'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'salaryComponent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.salaryComponent.universalIdentifier,
        nameSingular: 'salaryComponent',
        namePlural: 'salaryComponents',
        labelSingular: i18nLabel(
          msg({
            message: `Salary Component`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Salary Components`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An earning or deduction line of a salary structure`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconDynamics',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  payrollPeriod: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'payrollPeriod'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'payrollPeriod',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.payrollPeriod.universalIdentifier,
        nameSingular: 'payrollPeriod',
        namePlural: 'payrollPeriods',
        labelSingular: i18nLabel(
          msg({
            message: `Payroll Period`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Payroll Periods`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A payroll period with lifecycle status and totals`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendarMoney',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  payslip: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'payslip'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'payslip',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.payslip.universalIdentifier,
        nameSingular: 'payslip',
        namePlural: 'payslips',
        labelSingular: i18nLabel(
          msg({
            message: `Payslip`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Payslips`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Immutable payroll result snapshot for an employee and period`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconReceipt',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  payslipLine: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'payslipLine'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'payslipLine',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.payslipLine.universalIdentifier,
        nameSingular: 'payslipLine',
        namePlural: 'payslipLines',
        labelSingular: i18nLabel(
          msg({
            message: `Payslip Line`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Payslip Lines`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A labeled earning/deduction/adjustment line of a payslip`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconListNumbers',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'label',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  payrollAdjustment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'payrollAdjustment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'payrollAdjustment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.payrollAdjustment.universalIdentifier,
        nameSingular: 'payrollAdjustment',
        namePlural: 'payrollAdjustments',
        labelSingular: i18nLabel(
          msg({
            message: `Payroll Adjustment`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Payroll Adjustments`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Approved bonus/deduction/LOP adjustment entering payroll`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconSettings',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  invoice: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'invoice'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'invoice',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.invoice.universalIdentifier,
        nameSingular: 'invoice',
        namePlural: 'invoices',
        labelSingular: i18nLabel(
          msg({
            message: `Invoice`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Invoices`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A client invoice with derived paid/outstanding amounts`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconFileInvoice',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'invoiceNumber',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  payment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'payment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'payment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.payment.universalIdentifier,
        nameSingular: 'payment',
        namePlural: 'payments',
        labelSingular: i18nLabel(
          msg({
            message: `Payment`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Payments`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A payment recorded against an invoice`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCreditCard',
        isSearchable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  location: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'location'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'location',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.location.universalIdentifier,
        nameSingular: 'location',
        namePlural: 'locations',
        labelSingular: i18nLabel(
          msg({
            message: `Location`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Locations`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A physical location or office`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconMapPin',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  dashboard: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'dashboard'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'dashboard',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.dashboard.universalIdentifier,
        nameSingular: 'dashboard',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        namePlural: 'dashboards',
        labelSingular: i18nLabel(
          msg({
            message: `Dashboard`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Dashboards`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({
            message: `A dashboard`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconLayoutDashboard',
        isSearchable: true,
        shortcut: 'D',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageCampaign: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageCampaign'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageCampaign',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        nameSingular: 'messageCampaign',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        namePlural: 'messageCampaigns',
        labelSingular: i18nLabel(
          msg({ message: `Campaign`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Campaigns`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({
            message: `A bulk email send to an audience, with delivery stats`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconSend',
        isSystem: true,
        isSearchable: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageList: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'messageList'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageList',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageList.universalIdentifier,
        nameSingular: 'messageList',
        namePlural: 'messageLists',
        labelSingular: i18nLabel(
          msg({ message: `List`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Lists`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({
            message: `A hand-picked audience of people`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUsersGroup',
        isSystem: true,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageListMember: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageListMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageListMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageListMember.universalIdentifier,
        nameSingular: 'messageListMember',
        namePlural: 'messageListMembers',
        labelSingular: i18nLabel(
          msg({
            message: `List Member`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `List Members`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A person's membership in a list`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUser',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociation.universalIdentifier,
        nameSingular: 'messageChannelMessageAssociation',
        namePlural: 'messageChannelMessageAssociations',
        labelSingular: i18nLabel(
          msg({
            message: `Message Channel Message Association`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Message Channel Message Associations`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Message Synced with a Message Channel`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        writability: MetadataWritability.SYSTEM,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociationMessageFolder: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociationMessageFolder'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociationMessageFolder',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder
            .universalIdentifier,
        nameSingular: 'messageChannelMessageAssociationMessageFolder',
        namePlural: 'messageChannelMessageAssociationMessageFolders',
        labelSingular: i18nLabel(
          msg({
            message: `Message Channel Message Association Message Folder`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Message Channel Message Association Message Folders`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Join table linking message channel message associations to message folders`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconFolder',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        writability: MetadataWritability.SYSTEM,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageParticipant.universalIdentifier,
        nameSingular: 'messageParticipant',
        namePlural: 'messageParticipants',
        labelSingular: i18nLabel(
          msg({
            message: `Message Participant`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Message Participants`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Message Participants`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUserCircle',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageThread: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageThread'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageThread',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageThread.universalIdentifier,
        nameSingular: 'messageThread',
        namePlural: 'messageThreads',
        labelSingular: i18nLabel(
          msg({
            message: `Message Thread`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Message Threads`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Message Thread`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageThreadTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageThreadTarget'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageThreadTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageThreadTarget.universalIdentifier,
        nameSingular: 'messageThreadTarget',
        namePlural: 'messageThreadTargets',
        labelSingular: i18nLabel(
          msg({
            message: `Message Thread Target`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Message Thread Targets`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A message thread target`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  message: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'message'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'message',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.message.universalIdentifier,
        nameSingular: 'message',
        namePlural: 'messages',
        labelSingular: i18nLabel(
          msg({ message: `Message`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Messages`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `Message`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  note: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'note'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'note',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.note.universalIdentifier,
        nameSingular: 'note',
        namePlural: 'notes',
        labelSingular: i18nLabel(
          msg({ message: `Note`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Notes`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `A note`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconNotes',
        isSearchable: true,
        shortcut: 'N',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  noteTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'noteTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'noteTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.noteTarget.universalIdentifier,
        nameSingular: 'noteTarget',
        namePlural: 'noteTargets',
        labelSingular: i18nLabel(
          msg({
            message: `Note Target`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Note Targets`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A note target`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCheckbox',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  opportunity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'opportunity'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'opportunity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.opportunity.universalIdentifier,
        nameSingular: 'opportunity',
        namePlural: 'opportunities',
        labelSingular: i18nLabel(
          msg({
            message: `Opportunity`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Opportunities`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An opportunity`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconTargetArrow',
        isSearchable: true,
        shortcut: 'O',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  person: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'person'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'person',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.person.universalIdentifier,
        nameSingular: 'person',
        namePlural: 'people',
        labelSingular: i18nLabel(
          msg({ message: `Person`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `People`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `A person`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconUser',
        isSearchable: true,
        shortcut: 'P',
        duplicateCriteria: [
          ['nameFirstName', 'nameLastName'],
          ['linkedinLinkPrimaryLinkUrl'],
          ['emailsPrimaryEmail'],
        ],
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarFile',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  recordShare: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'recordShare'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'recordShare',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.recordShare.universalIdentifier,
        nameSingular: 'recordShare',
        namePlural: 'recordShares',
        labelSingular: i18nLabel(
          msg({
            message: `Record share`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Record shares`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Who may read a record of a private object`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconLock',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUIEditable: false,
        isUICreatable: false,
        writability: MetadataWritability.SYSTEM,
        readability: MetadataReadability.SYSTEM,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  interview: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'interview'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'interview',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.interview.universalIdentifier,
        nameSingular: 'interview',
        namePlural: 'interviews',
        labelSingular: i18nLabel(
          msg({
            message: `Interview`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Interviews`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `An interview for a candidate submission`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCalendarEvent',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  requirement: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'requirement'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'requirement',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.requirement.universalIdentifier,
        nameSingular: 'requirement',
        namePlural: 'requirements',
        labelSingular: i18nLabel(
          msg({
            message: `Requirement`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Requirements`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A client hiring requirement`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconBriefcase',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  task: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'task'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'task',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.task.universalIdentifier,
        nameSingular: 'task',
        namePlural: 'tasks',
        labelSingular: i18nLabel(
          msg({ message: `Task`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Tasks`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `A task`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconCheckbox',
        isSearchable: true,
        shortcut: 'T',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  taskTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'taskTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'taskTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.taskTarget.universalIdentifier,
        nameSingular: 'taskTarget',
        namePlural: 'taskTargets',
        labelSingular: i18nLabel(
          msg({
            message: `Task Target`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Task Targets`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A task target`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconCheckbox',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  timelineActivity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'timelineActivity'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'timelineActivity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.timelineActivity.universalIdentifier,
        nameSingular: 'timelineActivity',
        namePlural: 'timelineActivities',
        labelSingular: i18nLabel(
          msg({
            message: `Timeline Activity`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Timeline Activities`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `Aggregated / filtered event to be displayed on the timeline`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconTimelineEvent',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'linkedRecordCachedName',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflow: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflow'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflow',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflow.universalIdentifier,
        nameSingular: 'workflow',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        namePlural: 'workflows',
        labelSingular: i18nLabel(
          msg({ message: `Workflow`, context: 'objectMetadata.labelSingular' }),
        ),
        labelPlural: i18nLabel(
          msg({ message: `Workflows`, context: 'objectMetadata.labelPlural' }),
        ),
        description: i18nLabel(
          msg({ message: `A workflow`, context: 'objectMetadata.description' }),
        ),
        icon: 'IconSettingsAutomation',
        isSearchable: true,
        shortcut: 'W',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowAutomatedTrigger: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowAutomatedTrigger'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowAutomatedTrigger',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier,
        nameSingular: 'workflowAutomatedTrigger',
        namePlural: 'workflowAutomatedTriggers',
        labelSingular: i18nLabel(
          msg({
            message: `Workflow Automated Trigger`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Workflow Automated Triggers`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A workflow automated trigger`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconSettingsAutomation',
        isSystem: true,
        isUICreatable: false,
        writability: MetadataWritability.SYSTEM,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowRun: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflowRun'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowRun',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflowRun.universalIdentifier,
        nameSingular: 'workflowRun',
        namePlural: 'workflowRuns',
        labelSingular: i18nLabel(
          msg({
            message: `Workflow Run`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Workflow Runs`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A workflow run`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconHistoryToggle',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowVersion: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowVersion'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowVersion',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        nameSingular: 'workflowVersion',
        openRecordIn: ObjectOpenRecordIn.RECORD_PAGE,
        namePlural: 'workflowVersions',
        labelSingular: i18nLabel(
          msg({
            message: `Workflow Version`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Workflow Versions`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A workflow version`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconVersions',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workspaceMember: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workspaceMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workspaceMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workspaceMember.universalIdentifier,
        nameSingular: 'workspaceMember',
        namePlural: 'workspaceMembers',
        labelSingular: i18nLabel(
          msg({
            message: `Workspace Member`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Workspace Members`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A workspace member`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUserCircle',
        isSystem: true,
        isSearchable: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarUrl',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  team: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'team'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'team',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.team.universalIdentifier,
        nameSingular: 'team',
        namePlural: 'teams',
        labelSingular: i18nLabel(
          msg({
            message: `Team`,
            context: 'objectMetadata.labelSingular',
          }),
        ),
        labelPlural: i18nLabel(
          msg({
            message: `Teams`,
            context: 'objectMetadata.labelPlural',
          }),
        ),
        description: i18nLabel(
          msg({
            message: `A team within the organization`,
            context: 'objectMetadata.description',
          }),
        ),
        icon: 'IconUsersGroup',
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
} satisfies {
  [P in AllStandardObjectName]: (
    args: Omit<CreateStandardObjectArgs<P>, 'context' | 'objectName'>,
  ) => FlatObjectMetadata;
};
