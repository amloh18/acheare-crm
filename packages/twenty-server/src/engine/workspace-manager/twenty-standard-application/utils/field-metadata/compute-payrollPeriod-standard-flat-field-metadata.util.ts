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

export const buildPayrollPeriodStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'payrollPeriod', FieldMetadataType>,
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
  name: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'name',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Name`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `e.g. September 2026`,
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
  startDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'startDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Start Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Start Date`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconCalendarEvent',
      isNullable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  endDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'endDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `End Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `End Date`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconCalendarEvent',
      isNullable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  payDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'payDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Pay Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Pay Date`,
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
      defaultValue: 'DRAFT',
      options: [
              {
                      "id": "b5fdabc4-0000-4000-8000-00fdabc40000",
                      "position": 0,
                      "value": "DRAFT",
                      "label": "Draft",
                      "color": "gray"
              },
              {
                      "id": "b5fdabc4-0000-4000-8000-01fdabc40000",
                      "position": 1,
                      "value": "CALCULATED",
                      "label": "Calculated",
                      "color": "sky"
              },
              {
                      "id": "b5fdabc4-0000-4000-8000-02fdabc40000",
                      "position": 2,
                      "value": "UNDER_REVIEW",
                      "label": "Under Review",
                      "color": "yellow"
              },
              {
                      "id": "b5fdabc4-0000-4000-8000-03fdabc40000",
                      "position": 3,
                      "value": "APPROVED",
                      "label": "Approved",
                      "color": "green"
              },
              {
                      "id": "b5fdabc4-0000-4000-8000-04fdabc40000",
                      "position": 4,
                      "value": "PAID",
                      "label": "Paid",
                      "color": "blue"
              },
              {
                      "id": "b5fdabc4-0000-4000-8000-05fdabc40000",
                      "position": 5,
                      "value": "LOCKED",
                      "label": "Locked",
                      "color": "purple"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  employeeCount: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'employeeCount',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Employees`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Employees`,
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
  totalGross: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'totalGross',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Total Gross`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Total Gross`,
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
  totalNet: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'totalNet',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Total Net`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Total Net`,
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
  payslips: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'payslips',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Payslips`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Payslips in this period`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconReceipt',
      isNullable: true,
      targetObjectName: 'payslip',
      targetFieldName: 'payrollPeriod',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  payrollAdjustments: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'payrollAdjustments',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Adjustments`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Payroll adjustments in this period`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSettings',
      isNullable: true,
      targetObjectName: 'payrollAdjustment',
      targetFieldName: 'payrollPeriod',
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