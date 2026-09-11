import { msg } from '@lingui/core/macro';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

export const buildInvoiceStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'invoice', FieldMetadataType>,
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
  invoiceNumber: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'invoiceNumber',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Invoice Number`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Invoice Number`,
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
  invoiceDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'invoiceDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Invoice Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Invoice Date`,
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
  dueDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'dueDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Due Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Due Date`,
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
                      "id": "b1f2cd1a-1b8f-4c5d-8000-00f2cd1a1b8f",
                      "position": 0,
                      "value": "DRAFT",
                      "label": "Draft",
                      "color": "gray"
              },
              {
                      "id": "b1f2cd1a-1b8f-4c5d-8000-01f2cd1a1b8f",
                      "position": 1,
                      "value": "ISSUED",
                      "label": "Issued",
                      "color": "sky"
              },
              {
                      "id": "b1f2cd1a-1b8f-4c5d-8000-02f2cd1a1b8f",
                      "position": 2,
                      "value": "PARTIALLY_PAID",
                      "label": "Partially Paid",
                      "color": "yellow"
              },
              {
                      "id": "b1f2cd1a-1b8f-4c5d-8000-03f2cd1a1b8f",
                      "position": 3,
                      "value": "PAYMENT_PROMISED",
                      "label": "Payment Promised",
                      "color": "orange"
              },
              {
                      "id": "b1f2cd1a-1b8f-4c5d-8000-04f2cd1a1b8f",
                      "position": 4,
                      "value": "PAID",
                      "label": "Paid",
                      "color": "green"
              },
              {
                      "id": "b1f2cd1a-1b8f-4c5d-8000-05f2cd1a1b8f",
                      "position": 5,
                      "value": "OVERDUE",
                      "label": "Overdue",
                      "color": "red"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  amountPaid: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'amountPaid',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Amount Paid`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Derived from payments — maintained by service`,
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
  outstanding: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'outstanding',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Outstanding`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Derived from payments — maintained by service`,
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
          message: `Client company for this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: true,
      targetObjectName: 'company',
      targetFieldName: 'invoices',
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
  deal: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'deal',
      label: i18nLabel(
        msg({ message: `Deal`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Opportunity this invoice is linked to`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: true,
      targetObjectName: 'opportunity',
      targetFieldName: 'invoices',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'dealId',
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
          message: `Requirement this invoice is linked to`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconClipboardList',
      isNullable: true,
      targetObjectName: 'requirement',
      targetFieldName: 'invoices',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'requirementId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  payments: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'payments',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Payments`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Payments against this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCreditCard',
      isNullable: true,
      targetObjectName: 'payment',
      targetFieldName: 'invoice',
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
      type: FieldMetadataType.MORPH_RELATION,
      morphId:
        STANDARD_OBJECTS.taskTarget.morphIds.targetMorphId.morphId,
      fieldName: 'taskTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Tasks`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Task targets for this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetInvoice',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetInvoiceId',
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
      type: FieldMetadataType.MORPH_RELATION,
      morphId:
        STANDARD_OBJECTS.noteTarget.morphIds.targetMorphId.morphId,
      fieldName: 'noteTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Notes`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Note targets for this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetInvoice',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetInvoiceId',
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
      type: FieldMetadataType.MORPH_RELATION,
      morphId:
        STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
      fieldName: 'attachments',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Attachments`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Attachments for this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetInvoice',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetInvoiceId',
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
      type: FieldMetadataType.MORPH_RELATION,
      morphId:
        STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
      fieldName: 'timelineActivities',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Timeline`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Timeline activities for this invoice`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetInvoice',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetInvoiceId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});