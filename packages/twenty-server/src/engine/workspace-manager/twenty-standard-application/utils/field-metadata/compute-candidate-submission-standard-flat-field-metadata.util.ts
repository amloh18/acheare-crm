import { msg } from '@lingui/core/macro';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT } from 'src/engine/metadata-modules/object-metadata/constants/standard-relation-field-properties.constant';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

const SUBMISSION_STAGE_OPTIONS = [
  {
    id: '3870cd90-ca8c-44fc-88ce-e7db13f24d8b',
    value: 'SOURCED',
    label: i18nLabel(msg({ message: `Sourced`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: '6696acc0-86ca-4836-bb91-a9f32f220f09',
    value: 'SCREENING',
    label: i18nLabel(
      msg({ message: `Screening`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'sky',
  },
  {
    id: '9c280d3a-8bd6-45cc-89cf-ab68b0ce1649',
    value: 'SHORTLISTED',
    label: i18nLabel(
      msg({ message: `Shortlisted`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'blue',
  },
  {
    id: 'c0b9421e-1b01-4575-bf7b-49110f5479f7',
    value: 'SUBMITTED_TO_CLIENT',
    label: i18nLabel(
      msg({ message: `Submitted to Client`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'purple',
  },
  {
    id: 'c4a2ceae-5c14-4fed-9730-af3481df73d6',
    value: 'CLIENT_REVIEW',
    label: i18nLabel(
      msg({ message: `Client Review`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'turquoise',
  },
  {
    id: '8f27adbc-2018-48b3-bc7e-ff93ec177d7c',
    value: 'INTERVIEW',
    label: i18nLabel(
      msg({ message: `Interview`, context: 'fieldMetadata.label' }),
    ),
    position: 5,
    color: 'yellow',
  },
  {
    id: '8dd90648-943f-4264-baf7-23c1e9cea242',
    value: 'SELECTED',
    label: i18nLabel(
      msg({ message: `Selected`, context: 'fieldMetadata.label' }),
    ),
    position: 6,
    color: 'orange',
  },
  {
    id: 'dc18dce6-49a8-41a0-becc-31d7d07ea0b0',
    value: 'OFFER',
    label: i18nLabel(msg({ message: `Offer`, context: 'fieldMetadata.label' })),
    position: 7,
    color: 'pink',
  },
  {
    id: '31420dcf-7738-48e3-8888-1eca3b0f6c92',
    value: 'OFFER_ACCEPTED',
    label: i18nLabel(
      msg({ message: `Offer Accepted`, context: 'fieldMetadata.label' }),
    ),
    position: 8,
    color: 'green',
  },
  {
    id: '05d43a64-c785-41e6-bc8a-7b9b836b8eb7',
    value: 'JOINED',
    label: i18nLabel(msg({ message: `Joined`, context: 'fieldMetadata.label' })),
    position: 9,
    color: 'green',
  },
  {
    id: '7bee727a-3696-46fc-9ac7-c45206a2b230',
    value: 'REJECTED',
    label: i18nLabel(
      msg({ message: `Rejected`, context: 'fieldMetadata.label' }),
    ),
    position: 10,
    color: 'red',
  },
  {
    id: '46d781b9-d0de-413f-96c3-4a96de55785d',
    value: 'DROPPED',
    label: i18nLabel(msg({ message: `Dropped`, context: 'fieldMetadata.label' })),
    position: 11,
    color: 'red',
  },
];

const REJECTION_REASON_OPTIONS = [
  {
    id: '2ab7172b-ce34-4497-9546-cd4f2a94675f',
    value: 'SKILLS_MISMATCH',
    label: i18nLabel(
      msg({ message: `Skills Mismatch`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'orange',
  },
  {
    id: '43dbb095-059f-4f8c-a0fd-221fa9caa4cf',
    value: 'SALARY_MISMATCH',
    label: i18nLabel(
      msg({ message: `Salary Mismatch`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'orange',
  },
  {
    id: 'b3a4dd14-1fbe-44a5-8bbc-d6122b65bb01',
    value: 'NO_SHOW',
    label: i18nLabel(
      msg({ message: `No Show`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'red',
  },
  {
    id: '947d6f45-aa77-4a77-ba3e-980997409c92',
    value: 'CLIENT_REJECTED',
    label: i18nLabel(
      msg({ message: `Client Rejected`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'red',
  },
  {
    id: '2affb3f2-ce5a-48ec-9644-568935d86531',
    value: 'CANDIDATE_DECLINED',
    label: i18nLabel(
      msg({ message: `Candidate Declined`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'yellow',
  },
  {
    id: 'c5abee0a-bfef-4d2d-aa4a-59e9b36b77a1',
    value: 'OTHER',
    label: i18nLabel(msg({ message: `Other`, context: 'fieldMetadata.label' })),
    position: 5,
    color: 'gray',
  },
];

export const buildCandidateSubmissionStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'candidateSubmission', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'candidateSubmission'>,
  FlatFieldMetadata
> => ({
  id: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'id',
      type: FieldMetadataType.UUID,
      label: i18nLabel(msg({ message: `Id`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Id`, context: 'fieldMetadata.description' }),
      ),
      icon: 'Icon123',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'uuid',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({ message: `Creation date`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconCalendar',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Last update`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Last time the record was changed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarClock',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  deletedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'deletedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Deleted at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Date when the record was deleted`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarMinus',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  position: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'position',
      type: FieldMetadataType.POSITION,
      label: i18nLabel(
        msg({ message: `Position`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Record position`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconHierarchy2',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Created by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The creator of the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(
        msg({ message: `Updated by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `The workspace member who last updated the record`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isUIEditable: false,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  searchVector: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'searchVector',
      type: FieldMetadataType.TS_VECTOR,
      label: i18nLabel(
        msg({ message: `Search vector`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Field used for full-text search`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isSystem: true,
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  name: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'name',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `Name`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Submission display name`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  candidate: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'candidate',
      label: i18nLabel(
        msg({ message: `Candidate`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Submitted candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: false,
      targetObjectName: 'candidate',
      targetFieldName: 'candidateSubmissions',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'candidateId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  requirement: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'requirement',
      label: i18nLabel(
        msg({ message: `Requirement`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Requirement the candidate is submitted against`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: false,
      targetObjectName: 'requirement',
      targetFieldName: 'candidateSubmissions',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'requirementId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  recruiter: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'recruiter',
      label: i18nLabel(
        msg({ message: `Recruiter`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Recruiter handling this submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserSearch',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'submittedSubmissions',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'recruiterId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  hrOwner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'hrOwner',
      label: i18nLabel(
        msg({ message: `HR Owner`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `HR owning this submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCog',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'hrOwnedSubmissions',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'hrOwnerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  stage: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'stage',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Stage`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Hiring pipeline stage`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: "'SOURCED'",
      options: SUBMISSION_STAGE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  resumeSent: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'resumeSent',
      type: FieldMetadataType.BOOLEAN,
      label: i18nLabel(
        msg({ message: `Resume Sent`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Whether the resume was sent to the client`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileCheck',
      isNullable: true,
      defaultValue: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  clientFeedback: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'clientFeedback',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Client Feedback`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Latest client feedback on the candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconMessage',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  expectedSalary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'expectedSalary',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Expected Salary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate expected salary for this position`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCurrencyDollar',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  offeredSalary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'offeredSalary',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Offered Salary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Salary offered to the candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCurrencyDollar',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  joiningDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'joiningDate',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Joining Date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate joining date`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarEvent',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  rejectionReason: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'rejectionReason',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Rejection Reason`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Why the candidate was rejected`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCircleX',
      isNullable: true,
      options: REJECTION_REASON_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  dropReason: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'dropReason',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Drop Reason`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Why the candidate dropped out`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconArrowBackUp',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  interviews: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'interviews',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Interviews`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Interviews for this submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarStats',
      isNullable: true,
      targetObjectName: 'interview',
      targetFieldName: 'submission',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  taskTargets: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'taskTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.label,
      ),
      description: i18nLabel(
        msg({
          message: `Tasks tied to the submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget
        .icon,
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetSubmission',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  noteTargets: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'noteTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget.label,
      ),
      description: i18nLabel(
        msg({
          message: `Notes tied to the submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget
        .icon,
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetSubmission',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  attachments: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'attachments',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment.label,
      ),
      description: i18nLabel(
        msg({
          message: `Attachments linked to the submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment
        .icon,
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetSubmission',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  timelineActivities: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'timelineActivities',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.timelineActivity
          .label,
      ),
      description: i18nLabel(
        msg({
          message: `Timeline Activities linked to the submission.`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT
        .timelineActivity.icon,
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetSubmission',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
