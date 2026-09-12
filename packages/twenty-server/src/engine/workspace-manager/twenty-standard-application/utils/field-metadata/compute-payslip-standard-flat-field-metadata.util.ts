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

export const buildPayslipStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'payslip', FieldMetadataType>,
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
      targetFieldName: 'payslips',
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
      targetFieldName: 'payslips',
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
  currency: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'currency',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Currency`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Currency`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: false,
      defaultValue: "'INR'",
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  grossEarnings: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'grossEarnings',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Gross Earnings`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Gross Earnings`,
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
  totalDeductions: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'totalDeductions',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Total Deductions`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Total Deductions`,
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
  totalAdjustments: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'totalAdjustments',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Total Adjustments`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Total Adjustments`,
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
  netPay: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'netPay',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Net Pay`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Net Pay`,
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
  workingDays: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'workingDays',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Working Days`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Working Days`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  presentDays: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'presentDays',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Present Days`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Present Days`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  paidLeaveDays: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paidLeaveDays',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Paid Leave Days`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Paid Leave Days`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  unpaidLeaveDays: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'unpaidLeaveDays',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Unpaid Leave Days`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Unpaid Leave Days`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  overtimeMinutes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'overtimeMinutes',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Overtime Minutes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Overtime Minutes`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  paymentStatus: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paymentStatus',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
              msg({ message: `Payment Status`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Payment Status`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: false,
      defaultValue: "'PENDING'",
      options: [
              {
                      "id": "c6abcde5-7d4b-4e1f-8000-00abcde57d4b",
                      "position": 0,
                      "value": "PENDING",
                      "label": "Pending",
                      "color": "yellow"
              },
              {
                      "id": "c6abcde5-7d4b-4e1f-8000-01abcde57d4b",
                      "position": 1,
                      "value": "PAID",
                      "label": "Paid",
                      "color": "green"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  paidAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paidAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Paid At`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Paid At`,
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
  paymentReference: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paymentReference',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Payment Reference`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Payment Reference`,
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
  paymentMethod: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'paymentMethod',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
              msg({ message: `Payment Method`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Payment Method`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: true,
      defaultValue: null,
      options: [
              {
                      "id": "d7bcefd6-8e5c-4f2a-8000-00bcefd68e5c",
                      "position": 0,
                      "value": "BANK_TRANSFER",
                      "label": "Bank Transfer",
                      "color": "sky"
              },
              {
                      "id": "d7bcefd6-8e5c-4f2a-8000-01bcefd68e5c",
                      "position": 1,
                      "value": "CHEQUE",
                      "label": "Cheque",
                      "color": "orange"
              },
              {
                      "id": "d7bcefd6-8e5c-4f2a-8000-02bcefd68e5c",
                      "position": 2,
                      "value": "CASH",
                      "label": "Cash",
                      "color": "green"
              },
              {
                      "id": "d7bcefd6-8e5c-4f2a-8000-03bcefd68e5c",
                      "position": 3,
                      "value": "UPI",
                      "label": "UPI",
                      "color": "purple"
              },
              {
                      "id": "d7bcefd6-8e5c-4f2a-8000-04bcefd68e5c",
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
  lines: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'lines',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Lines`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Payslip line items`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListNumbers',
      isNullable: true,
      targetObjectName: 'payslipLine',
      targetFieldName: 'payslip',
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