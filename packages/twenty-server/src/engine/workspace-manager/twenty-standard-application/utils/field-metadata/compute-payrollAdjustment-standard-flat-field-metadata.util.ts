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

export const buildPayrollAdjustmentStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'payrollAdjustment', FieldMetadataType>,
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
  employee: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'employee',
      
      label: i18nLabel(
        msg({ message: `Employee`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBriefcase',
      isNullable: false,
      targetObjectName: 'employee',
      targetFieldName: 'payrollAdjustments',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'employeeId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  payrollPeriod: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'payrollPeriod',
      label: i18nLabel(
        msg({ message: `Payroll Period`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Payroll Period`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarMoney',
      isNullable: false,
      targetObjectName: 'payrollPeriod',
      targetFieldName: 'payrollAdjustments',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'payrollPeriodId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  approvedBy: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'approvedBy',
      label: i18nLabel(
        msg({ message: `Approved by`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Workspace member who approved this adjustment`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCheck',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'approvedPayrollAdjustments',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'approvedById',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  adjustmentType: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'adjustmentType',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
              msg({ message: `Type`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Type`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: false,
      defaultValue: null,
      options: [
              {
                      "id": "f9d0abf8-0a7e-4b4c-8000-00d0abf80a7e",
                      "position": 0,
                      "value": "BONUS",
                      "label": "Bonus",
                      "color": "green"
              },
              {
                      "id": "f9d0abf8-0a7e-4b4c-8000-01d0abf80a7e",
                      "position": 1,
                      "value": "OVERTIME",
                      "label": "Overtime",
                      "color": "sky"
              },
              {
                      "id": "f9d0abf8-0a7e-4b4c-8000-02d0abf80a7e",
                      "position": 2,
                      "value": "DEDUCTION",
                      "label": "Deduction",
                      "color": "red"
              },
              {
                      "id": "f9d0abf8-0a7e-4b4c-8000-03d0abf80a7e",
                      "position": 3,
                      "value": "LOP_REVERSAL",
                      "label": "LOP Reversal",
                      "color": "blue"
              },
              {
                      "id": "f9d0abf8-0a7e-4b4c-8000-04d0abf80a7e",
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
  reason: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'reason',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Reason`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Reason`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: false,
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
      label: i18nLabel(
              msg({ message: `Status`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Status`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: false,
      defaultValue: 'PENDING',
      options: [
              {
                      "id": "a0e1bca9-0000-4000-8000-00e1bca90000",
                      "position": 0,
                      "value": "PENDING",
                      "label": "Pending",
                      "color": "yellow"
              },
              {
                      "id": "a0e1bca9-0000-4000-8000-01e1bca90000",
                      "position": 1,
                      "value": "APPROVED",
                      "label": "Approved",
                      "color": "green"
              },
              {
                      "id": "a0e1bca9-0000-4000-8000-02e1bca90000",
                      "position": 2,
                      "value": "REJECTED",
                      "label": "Rejected",
                      "color": "red"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  approvedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'approvedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Approved At`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Approved At`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconCalendarClock',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});