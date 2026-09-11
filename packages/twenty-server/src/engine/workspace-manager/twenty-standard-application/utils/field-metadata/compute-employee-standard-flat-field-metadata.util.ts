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

export const buildEmployeeStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'employee', FieldMetadataType>,
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
  employeeCode: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'employeeCode',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Employee Code`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Unique employee code`,
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
      defaultValue: 'PRE_JOINING',
      options: [
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-00f1a9c27e4d",
                      "position": 0,
                      "value": "PRE_JOINING",
                      "label": "Pre-Joining",
                      "color": "yellow"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-01f1a9c27e4d",
                      "position": 1,
                      "value": "DOCUMENTS_PENDING",
                      "label": "Documents Pending",
                      "color": "orange"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-02f1a9c27e4d",
                      "position": 2,
                      "value": "ONBOARDING",
                      "label": "Onboarding",
                      "color": "sky"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-03f1a9c27e4d",
                      "position": 3,
                      "value": "ACTIVE",
                      "label": "Active",
                      "color": "green"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-04f1a9c27e4d",
                      "position": 4,
                      "value": "ON_LEAVE",
                      "label": "On Leave",
                      "color": "blue"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-05f1a9c27e4d",
                      "position": 5,
                      "value": "EXIT_INITIATED",
                      "label": "Exit Initiated",
                      "color": "violet"
              },
              {
                      "id": "b3f1a9c2-7e4d-4a1b-8000-06f1a9c27e4d",
                      "position": 6,
                      "value": "EXITED",
                      "label": "Exited",
                      "color": "gray"
              }
      ]
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  department: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'department',
      label: i18nLabel(
        msg({ message: `Department`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Department`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuilding',
      isNullable: true,
      targetObjectName: 'department',
      targetFieldName: 'employees',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'departmentId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  designation: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'designation',
      label: i18nLabel(
        msg({ message: `Designation`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Job title within the agency`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBadge',
      isNullable: true,
      targetObjectName: 'designation',
      targetFieldName: 'employees',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'designationId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  employmentType: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'employmentType',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
              msg({ message: `Employment Type`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Employment Type`,
                context: 'fieldMetadata.description',
              }),
            ),
      icon: 'IconTag',
      isNullable: true,
      defaultValue: null,
      options: [
              {
                      "id": "c4a2b0d3-8f5e-4b2c-8000-00a2b0d38f5e",
                      "position": 0,
                      "value": "FULL_TIME",
                      "label": "Full Time",
                      "color": "green"
              },
              {
                      "id": "c4a2b0d3-8f5e-4b2c-8000-01a2b0d38f5e",
                      "position": 1,
                      "value": "PART_TIME",
                      "label": "Part Time",
                      "color": "sky"
              },
              {
                      "id": "c4a2b0d3-8f5e-4b2c-8000-02a2b0d38f5e",
                      "position": 2,
                      "value": "CONTRACT",
                      "label": "Contract",
                      "color": "orange"
              },
              {
                      "id": "c4a2b0d3-8f5e-4b2c-8000-03a2b0d38f5e",
                      "position": 3,
                      "value": "INTERN",
                      "label": "Intern",
                      "color": "purple"
              }
      ]
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
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Joining Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Date the employee joined`,
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
  exitDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'exitDate',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
              msg({ message: `Exit Date`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Date the employee exited`,
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
  workLocation: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'workLocation',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
              msg({ message: `Work Location`, context: 'fieldMetadata.label' }),
            ),
      description: i18nLabel(
              msg({
                message: `Primary work location`,
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
  team: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'team',
      label: i18nLabel(
        msg({ message: `Team`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Team`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsersGroup',
      isNullable: true,
      targetObjectName: 'team',
      targetFieldName: 'members',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'teamId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  location: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'location',
      label: i18nLabel(
        msg({ message: `Location`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Work location`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconMapPin',
      isNullable: true,
      targetObjectName: 'location',
      targetFieldName: 'employees',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'locationId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  onboardingItems: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'onboardingItems',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Onboarding`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Onboarding checklist items`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListCheck',
      isNullable: true,
      targetObjectName: 'onboardingItem',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  rosterAssignments: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'rosterAssignments',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Roster`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Shift roster assignments`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarTime',
      isNullable: true,
      targetObjectName: 'rosterAssignment',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  attendanceDays: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'attendanceDays',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Attendance Days`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Daily attendance records`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarStats',
      isNullable: true,
      targetObjectName: 'attendanceDay',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  attendanceEvents: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'attendanceEvents',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Attendance Events`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Raw check-in/break/check-out event ledger`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconHistory',
      isNullable: true,
      targetObjectName: 'attendanceEvent',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  attendanceCorrections: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'attendanceCorrections',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Corrections`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Attendance correction requests`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileImport',
      isNullable: true,
      targetObjectName: 'attendanceCorrection',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  leaveRequests: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'leaveRequests',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Leave Requests`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Leave requests`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconVacation',
      isNullable: true,
      targetObjectName: 'leaveRequest',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  leaveBalances: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'leaveBalances',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Leave Balances`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Yearly leave balances per type`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconScale',
      isNullable: true,
      targetObjectName: 'leaveBalance',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  salaryStructures: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'salaryStructures',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Salary Structures`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Versioned salary structures`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCurrencyDollar',
      isNullable: true,
      targetObjectName: 'salaryStructure',
      targetFieldName: 'employee',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
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
          message: `Payslips`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconReceipt',
      isNullable: true,
      targetObjectName: 'payslip',
      targetFieldName: 'employee',
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
          message: `Payroll adjustments`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSettings',
      isNullable: true,
      targetObjectName: 'payrollAdjustment',
      targetFieldName: 'employee',
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
          message: `Task targets for this employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetEmployee',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetEmployeeId',
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
          message: `Note targets for this employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetEmployee',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetEmployeeId',
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
          message: `Attachments for this employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetEmployee',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'targetEmployeeId',
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
          message: `Timeline activities for this employee`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconLink',
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetEmployee',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'targetEmployeeId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});