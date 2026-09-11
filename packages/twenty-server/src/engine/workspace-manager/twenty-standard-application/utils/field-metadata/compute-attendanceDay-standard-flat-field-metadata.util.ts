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

export const buildAttendanceDayStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'attendanceDay', FieldMetadataType>,
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
          message: `Attendance employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBriefcase',
      isNullable: false,
      targetObjectName: 'employee',
      targetFieldName: 'attendanceDays',
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
  workDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'workDate',
      type: FieldMetadataType.DATE,
      label: i18nLabel(
              msg({ message: `Work Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Work Date`,
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
                      "id": "c0a8b6d9-4f1e-4b8c-8000-00a8b6d94f1e",
                      "position": 0,
                      "value": "PENDING",
                      "label": "Pending",
                      "color": "gray"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-01a8b6d94f1e",
                      "position": 1,
                      "value": "PRESENT",
                      "label": "Present",
                      "color": "green"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-02a8b6d94f1e",
                      "position": 2,
                      "value": "LATE",
                      "label": "Late",
                      "color": "yellow"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-03a8b6d94f1e",
                      "position": 3,
                      "value": "HALF_DAY",
                      "label": "Half Day",
                      "color": "orange"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-04a8b6d94f1e",
                      "position": 4,
                      "value": "ABSENT",
                      "label": "Absent",
                      "color": "red"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-05a8b6d94f1e",
                      "position": 5,
                      "value": "ON_LEAVE",
                      "label": "On Leave",
                      "color": "blue"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-06a8b6d94f1e",
                      "position": 6,
                      "value": "HOLIDAY",
                      "label": "Holiday",
                      "color": "purple"
              },
              {
                      "id": "c0a8b6d9-4f1e-4b8c-8000-07a8b6d94f1e",
                      "position": 7,
                      "value": "WEEKLY_OFF",
                      "label": "Weekly Off",
                      "color": "sky"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  firstCheckIn: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'firstCheckIn',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `First Check In`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `First Check In`,
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
  lastCheckOut: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'lastCheckOut',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Last Check Out`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Last Check Out`,
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
  workedMinutes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'workedMinutes',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Worked Minutes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Worked Minutes`,
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
  breakMinutes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'breakMinutes',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Break Minutes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Break Minutes`,
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
  lateMinutes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'lateMinutes',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Late Minutes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Late Minutes`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconNumbers',
      isNullable: true,
      defaultValue: 'now',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  earlyDepartureMinutes: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'earlyDepartureMinutes',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
              msg({ message: `Early Departure Minutes`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Early Departure Minutes`,
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
});