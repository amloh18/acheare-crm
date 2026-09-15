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

const PIPELINE_STAGE_OPTIONS = [
  {
    id: 'f4a5b6c7-0001-4000-8000-00000000c001',
    value: 'SOURCED',
    label: i18nLabel(msg({ message: `Sourced`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0002-4000-8000-00000000c002',
    value: 'SCREENING',
    label: i18nLabel(
      msg({ message: `Screening`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'sky',
  },
  {
    id: 'f4a5b6c7-0003-4000-8000-00000000c003',
    value: 'SHORTLISTED',
    label: i18nLabel(
      msg({ message: `Shortlisted`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'blue',
  },
  {
    id: 'f4a5b6c7-0004-4000-8000-00000000c004',
    value: 'SUBMITTED_TO_CLIENT',
    label: i18nLabel(
      msg({ message: `Submitted to client`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'turquoise',
  },
  {
    id: 'f4a5b6c7-0005-4000-8000-00000000c005',
    value: 'CLIENT_REVIEW',
    label: i18nLabel(
      msg({ message: `Client review`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'purple',
  },
  {
    id: 'f4a5b6c7-0006-4000-8000-00000000c006',
    value: 'INTERVIEW',
    label: i18nLabel(
      msg({ message: `Interview`, context: 'fieldMetadata.label' }),
    ),
    position: 5,
    color: 'pink',
  },
  {
    id: 'f4a5b6c7-0007-4000-8000-00000000c007',
    value: 'SELECTED',
    label: i18nLabel(msg({ message: `Selected`, context: 'fieldMetadata.label' })),
    position: 6,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0008-4000-8000-00000000c008',
    value: 'OFFER',
    label: i18nLabel(msg({ message: `Offer`, context: 'fieldMetadata.label' })),
    position: 7,
    color: 'yellow',
  },
  {
    id: 'f4a5b6c7-0009-4000-8000-00000000c009',
    value: 'OFFER_ACCEPTED',
    label: i18nLabel(
      msg({ message: `Offer accepted`, context: 'fieldMetadata.label' }),
    ),
    position: 8,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0010-4000-8000-00000000c00a',
    value: 'JOINED',
    label: i18nLabel(msg({ message: `Joined`, context: 'fieldMetadata.label' })),
    position: 9,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0011-4000-8000-00000000c00b',
    value: 'REJECTED',
    label: i18nLabel(msg({ message: `Rejected`, context: 'fieldMetadata.label' })),
    position: 10,
    color: 'red',
  },
  {
    id: 'f4a5b6c7-0012-4000-8000-00000000c00c',
    value: 'DROPPED',
    label: i18nLabel(msg({ message: `Dropped`, context: 'fieldMetadata.label' })),
    position: 11,
    color: 'orange',
  },
];

export const buildApplicationStageHistoryStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'applicationStageHistory', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'applicationStageHistory'>,
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
          message: `Submission whose stage changed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: false,
      targetObjectName: 'candidateSubmission',
      targetFieldName: 'applicationStageHistories',
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
  changedBy: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'changedBy',
      label: i18nLabel(
        msg({ message: `Changed by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Workspace member who moved the submission`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'changedApplicationStageHistories',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'changedById',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  fromStage: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'fromStage',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `From stage`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Stage the submission moved from`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconArrowBackUp',
      isNullable: true,
      options: PIPELINE_STAGE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  toStage: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'toStage',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `To stage`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Stage the submission moved to`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconArrowForwardUp',
      isNullable: false,
      options: PIPELINE_STAGE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  changedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'changedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Changed at`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the stage change happened`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconClock',
      isNullable: false,
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
  reason: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'reason',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `Reason`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Reason for the stage change`,
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
