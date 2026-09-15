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

const INTERVIEW_ROUND_OPTIONS = [
  {
    id: 'fa399b8b-e129-45e7-a83b-93b1bcf33fea',
    value: 'ROUND_1',
    label: i18nLabel(
      msg({ message: `Round 1`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'sky',
  },
  {
    id: '877afea4-b4ea-420c-9b69-0e42874a6c92',
    value: 'ROUND_2',
    label: i18nLabel(
      msg({ message: `Round 2`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'blue',
  },
  {
    id: '0b5d6c58-9864-4d0b-9c01-4bbc397baece',
    value: 'ROUND_3',
    label: i18nLabel(
      msg({ message: `Round 3`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'purple',
  },
  {
    id: '24220fd4-db35-464e-85b1-b2a39db01d0c',
    value: 'FINAL',
    label: i18nLabel(
      msg({ message: `Final`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'orange',
  },
  {
    id: 'fd4b9a85-f0e3-4873-90ee-ec4258d498f9',
    value: 'HR_ROUND',
    label: i18nLabel(
      msg({ message: `HR Round`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'turquoise',
  },
];

const INTERVIEW_MODE_OPTIONS = [
  {
    id: '4c46b4a1-4c0c-46a9-8151-ccf3fc023128',
    value: 'PHONE',
    label: i18nLabel(msg({ message: `Phone`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: 'a339cda5-a02d-4dae-b962-f4996ee4be9a',
    value: 'VIDEO',
    label: i18nLabel(msg({ message: `Video`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'blue',
  },
  {
    id: 'cc69dc5f-d9fc-44d2-8e79-ee75200452b2',
    value: 'ONSITE',
    label: i18nLabel(msg({ message: `On-site`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'green',
  },
];

const INTERVIEW_STATUS_OPTIONS = [
  {
    id: '6534e73f-3345-4bcc-99ab-c6022680fb1b',
    value: 'SCHEDULED',
    label: i18nLabel(
      msg({ message: `Scheduled`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'blue',
  },
  {
    id: '907011d6-0ee8-4d84-b1a8-7969c3bdd0b5',
    value: 'RESCHEDULED',
    label: i18nLabel(
      msg({ message: `Rescheduled`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'yellow',
  },
  {
    id: '334e5999-b7e7-40e5-aa3a-e3fe0a6b6d24',
    value: 'COMPLETED',
    label: i18nLabel(
      msg({ message: `Completed`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'green',
  },
  {
    id: '826ac85d-39d6-437c-adfa-c898f8402fe3',
    value: 'CANCELLED',
    label: i18nLabel(
      msg({ message: `Cancelled`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'gray',
  },
  {
    id: '290b977c-67cf-41a1-bb63-be54c919514f',
    value: 'NO_SHOW',
    label: i18nLabel(
      msg({ message: `No Show`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'red',
  },
];

const INTERVIEW_RESULT_OPTIONS = [
  {
    id: '90c27faf-6dc5-40aa-b98b-ced2ab0012f4',
    value: 'PENDING',
    label: i18nLabel(
      msg({ message: `Pending`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'gray',
  },
  {
    id: 'd83408aa-6ea5-4919-8ba7-59da501b030e',
    value: 'PASSED',
    label: i18nLabel(msg({ message: `Passed`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'green',
  },
  {
    id: '7b59eec8-fdf9-4c54-9f99-3e13449782c7',
    value: 'FAILED',
    label: i18nLabel(msg({ message: `Failed`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'red',
  },
];

export const buildInterviewStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'interview', FieldMetadataType>,
  'context'
>): Record<AllStandardObjectFieldName<'interview'>, FlatFieldMetadata> => ({
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

  title: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'title',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `Title`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview title`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarStats',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  submission: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'submission',
      label: i18nLabel(
        msg({ message: `Submission`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Submission this interview belongs to`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: true,
      targetObjectName: 'candidateSubmission',
      targetFieldName: 'interviews',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'submissionId',
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
          message: `Requirement for this interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: true,
      targetObjectName: 'requirement',
      targetFieldName: 'interviews',
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
          message: `Candidate being interviewed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
      targetObjectName: 'candidate',
      targetFieldName: 'interviews',
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
  company: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'company',
      label: i18nLabel(
        msg({ message: `Company`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Client company where the interview happens`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: true,
      targetObjectName: 'company',
      targetFieldName: 'interviews',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  round: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'round',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Round`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview round`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListNumbers',
      isNullable: true,
      options: INTERVIEW_ROUND_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  owner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'owner',
      label: i18nLabel(msg({ message: `Owner`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview owner`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'ownedInterviews',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'ownerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  interviewer: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'interviewer',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Interviewer`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Interviewer name`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  scheduledAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'scheduledAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Scheduled At`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the interview is scheduled`,
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
  mode: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'mode',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Mode`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview mode`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconVideo',
      isNullable: true,
      options: INTERVIEW_MODE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  meetingLink: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'meetingLink',
      type: FieldMetadataType.LINKS,
      label: i18nLabel(
        msg({ message: `Meeting Link`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Meeting link or location`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  status: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'status',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Status`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview status`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'SCHEDULED'",
      options: INTERVIEW_STATUS_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  result: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'result',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Result`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Interview result`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCircleCheck',
      isNullable: true,
      defaultValue: "'PENDING'",
      options: INTERVIEW_RESULT_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  feedback: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'feedback',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Feedback`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Interview feedback`,
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

  interviewParticipants: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'interviewParticipants',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Participants`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `People taking part in this interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsers',
      isNullable: true,
      targetObjectName: 'interviewParticipant',
      targetFieldName: 'interview',
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
          message: `Tasks tied to the interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget
        .icon,
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetInterview',
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
          message: `Notes tied to the interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget
        .icon,
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetInterview',
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
          message: `Attachments linked to the interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment
        .icon,
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetInterview',
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
          message: `Timeline Activities linked to the interview.`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT
        .timelineActivity.icon,
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetInterview',
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
