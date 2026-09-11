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

export const buildPaymentStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'payment', FieldMetadataType>,
  'context'
>): Record<string, FlatFieldMetadata> => ({
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
      label: i18nLabel(msg({ message: `Creation date`, context: 'fieldMetadata.label' })),
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
      label: i18nLabel(msg({ message: `Last update`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Last update`, context: 'fieldMetadata.description' }),
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
      label: i18nLabel(msg({ message: `Deleted at`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Deleted at`, context: 'fieldMetadata.description' }),
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
      label: i18nLabel(msg({ message: `Position`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Position`, context: 'fieldMetadata.description' }),
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
      label: i18nLabel(msg({ message: `Created by`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Created by`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
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
      label: i18nLabel(msg({ message: `Updated by`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Updated by`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isNullable: false,
      isUIEditable: false,
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
      label: i18nLabel(msg({ message: `Search vector`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({ message: `Search vector`, context: 'fieldMetadata.description' }),
      ),
      icon: 'IconSearch',
      isSystem: true,
      isNullable: true,
      isUIEditable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  invoice: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'invoice',
      
      label: i18nLabel(
        msg({ message: `Invoice`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileInvoice',
      isNullable: false,
      targetObjectName: 'invoice',
      targetFieldName: 'payments',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'invoiceId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  amount: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'amount',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Amount`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Amount`,
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
  paidDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paidDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Paid Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Paid Date`,
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
  method: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'method',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
              msg({ message: `Method`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Method`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: true,
      defaultValue: null,
      options: [
              {
                      "id": "c2a3de2b-2c9a-4d6e-8000-00a3de2b2c9a",
                      "position": 0,
                      "value": "BANK_TRANSFER",
                      "label": "Bank Transfer",
                      "color": "sky"
              },
              {
                      "id": "c2a3de2b-2c9a-4d6e-8000-01a3de2b2c9a",
                      "position": 1,
                      "value": "CHEQUE",
                      "label": "Cheque",
                      "color": "orange"
              },
              {
                      "id": "c2a3de2b-2c9a-4d6e-8000-02a3de2b2c9a",
                      "position": 2,
                      "value": "CASH",
                      "label": "Cash",
                      "color": "green"
              },
              {
                      "id": "c2a3de2b-2c9a-4d6e-8000-03a3de2b2c9a",
                      "position": 3,
                      "value": "UPI",
                      "label": "UPI",
                      "color": "purple"
              },
              {
                      "id": "c2a3de2b-2c9a-4d6e-8000-04a3de2b2c9a",
                      "position": 4,
                      "value": "OTHER",
                      "label": "Other",
                      "color": "gray"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  reference: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'reference',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Reference`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Reference`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: true,
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
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Notes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Notes`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});