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

const FEE_STATUS_OPTIONS = [
  {
    id: 'f4a5b6c7-0001-4000-8000-00000000d001',
    value: 'PENDING',
    label: i18nLabel(msg({ message: `Pending`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0002-4000-8000-00000000d002',
    value: 'INVOICED',
    label: i18nLabel(msg({ message: `Invoiced`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'blue',
  },
  {
    id: 'f4a5b6c7-0003-4000-8000-00000000d003',
    value: 'PARTIALLY_PAID',
    label: i18nLabel(
      msg({ message: `Partially paid`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'yellow',
  },
  {
    id: 'f4a5b6c7-0004-4000-8000-00000000d004',
    value: 'PAID',
    label: i18nLabel(msg({ message: `Paid`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0005-4000-8000-00000000d005',
    value: 'WAIVED',
    label: i18nLabel(msg({ message: `Waived`, context: 'fieldMetadata.label' })),
    position: 4,
    color: 'orange',
  },
];

const PLACEMENT_STATUS_OPTIONS = [
  {
    id: 'f4a5b6c7-0011-4000-8000-00000000d011',
    value: 'ACTIVE',
    label: i18nLabel(msg({ message: `Active`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0012-4000-8000-00000000d012',
    value: 'COMPLETED',
    label: i18nLabel(
      msg({ message: `Completed`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'turquoise',
  },
  {
    id: 'f4a5b6c7-0013-4000-8000-00000000d013',
    value: 'REPLACED',
    label: i18nLabel(msg({ message: `Replaced`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'orange',
  },
  {
    id: 'f4a5b6c7-0014-4000-8000-00000000d014',
    value: 'CANCELLED',
    label: i18nLabel(
      msg({ message: `Cancelled`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'red',
  },
];

export const buildPlacementStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'placement', FieldMetadataType>,
  'context'
>): Record<AllStandardObjectFieldName<'placement'>, FlatFieldMetadata> => ({
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
          message: `Submission that resulted in this placement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: true,
      targetObjectName: 'candidateSubmission',
      targetFieldName: 'placements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'submissionId',
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
          message: `Candidate who was placed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
      targetObjectName: 'candidate',
      targetFieldName: 'placements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'candidateId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  placementDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'placementDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
        msg({ message: `Placement date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Date the placement was confirmed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTrophy',
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
      type: FieldMetadataType.DATE,
      label: i18nLabel(
        msg({ message: `Joining date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Date the candidate joins the client company`,
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
  replacementDueDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'replacementDueDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
        msg({ message: `Replacement due`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `End of the replacement guarantee window`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconRepeat',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  placementFee: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'placementFee',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Placement fee`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Fee charged for this placement`,
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
  salary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'salary',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Annual salary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Salary agreed for the placement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCoin',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  feeStatus: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'feeStatus',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Fee status`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Invoicing status of the placement fee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconReceipt',
      isNullable: true,
      defaultValue: "'PENDING'",
      options: FEE_STATUS_OPTIONS,
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
          message: `Placement lifecycle status`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'ACTIVE'",
      options: PLACEMENT_STATUS_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  notes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'notes',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(msg({ message: `Notes`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Internal notes about the placement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconNotes',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
