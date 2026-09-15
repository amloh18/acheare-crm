import { msg } from '@lingui/core/macro';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

const PARTICIPANT_ROLE_OPTIONS = [
  {
    id: 'f4a5b6c7-0001-4000-8000-00000000e001',
    value: 'INTERVIEWER',
    label: i18nLabel(
      msg({ message: `Interviewer`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'blue',
  },
  {
    id: 'f4a5b6c7-0002-4000-8000-00000000e002',
    value: 'HIRING_MANAGER',
    label: i18nLabel(
      msg({ message: `Hiring manager`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'purple',
  },
  {
    id: 'f4a5b6c7-0003-4000-8000-00000000e003',
    value: 'RECRUITER',
    label: i18nLabel(msg({ message: `Recruiter`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'turquoise',
  },
  {
    id: 'f4a5b6c7-0004-4000-8000-00000000e004',
    value: 'HR',
    label: i18nLabel(msg({ message: `HR`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'pink',
  },
  {
    id: 'f4a5b6c7-0005-4000-8000-00000000e005',
    value: 'OBSERVER',
    label: i18nLabel(msg({ message: `Observer`, context: 'fieldMetadata.label' })),
    position: 4,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0006-4000-8000-00000000e006',
    value: 'OTHER',
    label: i18nLabel(msg({ message: `Other`, context: 'fieldMetadata.label' })),
    position: 5,
    color: 'gray',
  },
];

const PARTICIPANT_RESPONSE_OPTIONS = [
  {
    id: 'f4a5b6c7-0011-4000-8000-00000000e011',
    value: 'PENDING',
    label: i18nLabel(msg({ message: `Pending`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0012-4000-8000-00000000e012',
    value: 'ACCEPTED',
    label: i18nLabel(msg({ message: `Accepted`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0013-4000-8000-00000000e013',
    value: 'TENTATIVE',
    label: i18nLabel(
      msg({ message: `Tentative`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'yellow',
  },
  {
    id: 'f4a5b6c7-0014-4000-8000-00000000e014',
    value: 'DECLINED',
    label: i18nLabel(msg({ message: `Declined`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'red',
  },
];

export const buildInterviewParticipantStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'interviewParticipant', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'interviewParticipant'>,
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

  interview: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'interview',
      label: i18nLabel(
        msg({ message: `Interview`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Interview the person participates in`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarEvent',
      isNullable: false,
      targetObjectName: 'interview',
      targetFieldName: 'interviewParticipants',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'interviewId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  person: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'person',
      label: i18nLabel(msg({ message: `Person`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Person taking part in the interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: false,
      targetObjectName: 'person',
      targetFieldName: 'interviewParticipants',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'personId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  role: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'role',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Role`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Role of the participant in the interview`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsers',
      isNullable: true,
      defaultValue: "'INTERVIEWER'",
      options: PARTICIPANT_ROLE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  response: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'response',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Response`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Participant response to the interview invitation`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconMessageCheck',
      isNullable: true,
      defaultValue: "'PENDING'",
      options: PARTICIPANT_RESPONSE_OPTIONS,
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
          message: `Feedback from this participant`,
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
});
