import { msg } from '@lingui/core/macro';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT } from 'src/engine/metadata-modules/object-metadata/constants/standard-relation-field-properties.constant';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';

// Stable option ids so option labels can be edited and options reordered
// without breaking stored values or view filters.
const REQUIREMENT_STATUS_OPTIONS = [
  {
    id: '9880415b-0983-423e-bdc4-05b2db4b3d6d',
    value: 'DRAFT',
    label: i18nLabel(msg({ message: `Draft`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: '529a2c1b-69fd-44f6-a4f4-f42ca3e17341',
    value: 'RECEIVED',
    label: i18nLabel(
      msg({ message: `Requirement Received`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'sky',
  },
  {
    id: '4fbcd55a-3b6a-4cb9-82c0-f50fec4d285a',
    value: 'CONFIRMED',
    label: i18nLabel(
      msg({ message: `Confirmed`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'blue',
  },
  {
    id: 'b9431163-db87-401f-a897-ceee6a1c2f36',
    value: 'COMMERCIAL_AGREED',
    label: i18nLabel(
      msg({ message: `Commercial Agreed`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'purple',
  },
  {
    id: 'f0956fd3-08ac-406c-a300-ee08bb4cdaae',
    value: 'ASSIGNED_TO_HR',
    label: i18nLabel(
      msg({ message: `Assigned to HR`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'turquoise',
  },
  {
    id: 'ecdd3d21-fa4d-4b8f-b9e2-d3fdbed61b7a',
    value: 'IN_PROGRESS',
    label: i18nLabel(
      msg({ message: `In Progress`, context: 'fieldMetadata.label' }),
    ),
    position: 5,
    color: 'yellow',
  },
  {
    id: 'bfc32acb-66bf-4c64-b38d-6332668be93c',
    value: 'PARTIALLY_FILLED',
    label: i18nLabel(
      msg({ message: `Partially Filled`, context: 'fieldMetadata.label' }),
    ),
    position: 6,
    color: 'orange',
  },
  {
    id: '1b5f53d3-6407-4062-8a5e-88906b65d284',
    value: 'FILLED',
    label: i18nLabel(
      msg({ message: `Filled`, context: 'fieldMetadata.label' }),
    ),
    position: 7,
    color: 'green',
  },
  {
    id: '8b197a21-57a2-478f-bbf7-ed4e48148257',
    value: 'CLOSED',
    label: i18nLabel(
      msg({ message: `Closed`, context: 'fieldMetadata.label' }),
    ),
    position: 8,
    color: 'gray',
  },
  {
    id: '64384500-09c4-4d7c-98d0-daffab5e275c',
    value: 'CANCELLED',
    label: i18nLabel(
      msg({ message: `Cancelled`, context: 'fieldMetadata.label' }),
    ),
    position: 9,
    color: 'red',
  },
];

const REQUIREMENT_PRIORITY_OPTIONS = [
  {
    id: 'bb19827a-91a7-42f9-94e6-2e596738c78d',
    value: 'LOW',
    label: i18nLabel(msg({ message: `Low`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: '39237043-35ef-4d16-9912-631ba1190752',
    value: 'MEDIUM',
    label: i18nLabel(msg({ message: `Medium`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'sky',
  },
  {
    id: '54b7e70d-9c41-410f-b29c-b34c13ac64ed',
    value: 'HIGH',
    label: i18nLabel(msg({ message: `High`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'orange',
  },
  {
    id: '537134c2-1a5f-4e17-bdcf-68401ca54ce3',
    value: 'URGENT',
    label: i18nLabel(msg({ message: `Urgent`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'red',
  },
];

const WORK_MODE_OPTIONS = [
  {
    id: 'e44b56b8-89a9-4c61-b814-876b3527b278',
    value: 'ON_SITE',
    label: i18nLabel(msg({ message: `On-site`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'blue',
  },
  {
    id: '4622b015-46a6-447a-bfbe-b1b9d7a4c618',
    value: 'HYBRID',
    label: i18nLabel(msg({ message: `Hybrid`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'purple',
  },
  {
    id: '9eb26b9d-f1af-42eb-afb3-bdd390f25c77',
    value: 'REMOTE',
    label: i18nLabel(msg({ message: `Remote`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'green',
  },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  {
    id: '1a7e066b-fec2-43ac-bfd5-aa9dc87ef52d',
    value: 'FULL_TIME',
    label: i18nLabel(
      msg({ message: `Full-time`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'blue',
  },
  {
    id: 'a7a70e7d-6906-4698-bf99-e5d7657af6b7',
    value: 'PART_TIME',
    label: i18nLabel(
      msg({ message: `Part-time`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'sky',
  },
  {
    id: 'be353eb6-35a3-4d0b-b1bb-1b90fe49f2a8',
    value: 'CONTRACT',
    label: i18nLabel(
      msg({ message: `Contract`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'orange',
  },
  {
    id: '7ee89dce-a330-41b0-a12f-81f9baefabe4',
    value: 'INTERN',
    label: i18nLabel(
      msg({ message: `Internship`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'yellow',
  },
];

const EDUCATION_OPTIONS = [
  {
    id: 'd5a1c3e9-4bd8-4fcb-93b7-27cb4c3f0c19',
    value: 'ANY',
    label: i18nLabel(msg({ message: `Any`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: '7e5714fa-2ea2-4cbb-b7fe-a4bdf1c2a093',
    value: 'DIPLOMA',
    label: i18nLabel(msg({ message: `Diploma`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'sky',
  },
  {
    id: 'ee9a53b9-73d5-4012-89b8-93de5e0766f0',
    value: 'BACHELORS',
    label: i18nLabel(
      msg({ message: `Bachelors`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'blue',
  },
  {
    id: 'c5b2e0fa-9c62-4a3f-847f-8ff7ba71c0e4',
    value: 'MASTERS',
    label: i18nLabel(msg({ message: `Masters`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'purple',
  },
  {
    id: 'e38a9d13-9d6d-45bb-8c1f-a4e0d59af6a0',
    value: 'DOCTORATE',
    label: i18nLabel(
      msg({ message: `Doctorate`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'turquoise',
  },
];

export const buildRequirementStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'requirement', FieldMetadataType>,
  'context'
>): Record<AllStandardObjectFieldName<'requirement'>, FlatFieldMetadata> => ({
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

  title: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'title',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `Title`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Client requirement title`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  rolePosition: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'rolePosition',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Role Position`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Position to be filled at the client`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBriefcase',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  numberOfOpenings: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'numberOfOpenings',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Openings`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Number of positions to fill`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUsersGroup',
      isNullable: true,
      defaultValue: 1,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  filledCount: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'filledCount',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Filled`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Positions filled so far`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCheck',
      isNullable: true,
      isUIEditable: false,
      defaultValue: 0,
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
          message: `Client company with the requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: true,
      targetObjectName: 'company',
      targetFieldName: 'requirements',
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
  pointOfContact: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'pointOfContact',
      label: i18nLabel(
        msg({ message: `Point of Contact`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Client point of contact`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
      targetObjectName: 'person',
      targetFieldName: 'requirements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'pointOfContactId',
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
      label: i18nLabel(msg({ message: `Deal`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Opportunity this requirement originated from`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconTargetArrow',
      isNullable: true,
      targetObjectName: 'opportunity',
      targetFieldName: 'requirements',
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
  location: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'location',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Location`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Job location`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconMap',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  workMode: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'workMode',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Work Mode`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `On-site, hybrid or remote`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingStadium',
      isNullable: true,
      options: WORK_MODE_OPTIONS,
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
          message: `Type of employment`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBriefcase',
      isNullable: true,
      options: EMPLOYMENT_TYPE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  experienceMin: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'experienceMin',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Min Experience`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Minimum experience in years`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconChartLine',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  experienceMax: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'experienceMax',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Max Experience`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Maximum experience in years`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconChartLine',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  salaryMin: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'salaryMin',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Salary Min`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Minimum salary offered`,
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
  salaryMax: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'salaryMax',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Salary Max`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Maximum salary offered`,
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
  skills: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'skills',
      type: FieldMetadataType.MULTI_SELECT,
      label: i18nLabel(
        msg({ message: `Skills`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Skills required for the position`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSparkles',
      isNullable: true,
      options: [
        {
          id: 'c5d6e7f8-a9b0-4c1d-8e2f-3a4b5c6d7e8f',
          value: 'REACT',
          label: i18nLabel(msg({ message: `React`, context: 'fieldMetadata.label' })),
          position: 0,
          color: 'sky',
        },
        {
          id: 'd6e7f8a9-b0c1-4d2e-9f3a-4b5c6d7e8f9a',
          value: 'NODE_JS',
          label: i18nLabel(msg({ message: `Node.js`, context: 'fieldMetadata.label' })),
          position: 1,
          color: 'green',
        },
        {
          id: 'e7f8a9b0-c1d2-4e3f-8a4b-5c6d7e8f9a0b',
          value: 'PYTHON',
          label: i18nLabel(msg({ message: `Python`, context: 'fieldMetadata.label' })),
          position: 2,
          color: 'blue',
        },
        {
          id: 'f8a9b0c1-d2e3-4f4a-9b5c-6d7e8f9a0b1c',
          value: 'JAVA',
          label: i18nLabel(msg({ message: `Java`, context: 'fieldMetadata.label' })),
          position: 3,
          color: 'orange',
        },
        {
          id: 'a9b0c1d2-e3f4-4a5b-8c6d-7e8f9a0b1c2d',
          value: 'SALES',
          label: i18nLabel(msg({ message: `Sales`, context: 'fieldMetadata.label' })),
          position: 4,
          color: 'yellow',
        },
        {
          id: 'b0c1d2e3-f4a5-4b6c-9d7e-8f9a0b1c2d3e',
          value: 'MARKETING',
          label: i18nLabel(msg({ message: `Marketing`, context: 'fieldMetadata.label' })),
          position: 5,
          color: 'pink',
        },
        {
          id: 'c1d2e3f4-a5b6-4c7d-8e8f-9a0b1c2d3e4f',
          value: 'DESIGN',
          label: i18nLabel(msg({ message: `Design`, context: 'fieldMetadata.label' })),
          position: 6,
          color: 'purple',
        },
        {
          id: 'd2e3f4a5-b6c7-4d8e-9f9a-0b1c2d3e4f5a',
          value: 'HR',
          label: i18nLabel(msg({ message: `HR`, context: 'fieldMetadata.label' })),
          position: 7,
          color: 'turquoise',
        },
        {
          id: 'e3f4a5b6-c7d8-4e9f-8a0b-1c2d3e4f5a6b',
          value: 'FINANCE',
          label: i18nLabel(msg({ message: `Finance`, context: 'fieldMetadata.label' })),
          position: 8,
          color: 'crimson',
        },
        {
          id: 'f4a5b6c7-d8e9-4f0a-9b1c-2d3e4f5a6b7c',
          value: 'OPERATIONS',
          label: i18nLabel(msg({ message: `Operations`, context: 'fieldMetadata.label' })),
          position: 9,
          color: 'violet',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  education: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'education',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Education`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Minimum education requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSchool',
      isNullable: true,
      options: EDUCATION_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  description: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'description',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Description`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Job description`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFileText',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  responsibilities: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'responsibilities',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Responsibilities`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Role responsibilities`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListCheck',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  requirementsText: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'requirementsText',
      type: FieldMetadataType.RICH_TEXT,
      label: i18nLabel(
        msg({ message: `Requirements`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Detailed requirements from the client`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconListDetails',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  priority: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'priority',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Priority`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Requirement priority`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconFlame',
      isNullable: true,
      defaultValue: "'MEDIUM'",
      options: REQUIREMENT_PRIORITY_OPTIONS,
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
          message: `Requirement status`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: false,
      defaultValue: "'RECEIVED'",
      options: REQUIREMENT_STATUS_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  bdeOwner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'bdeOwner',
      label: i18nLabel(
        msg({ message: `BDE Owner`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Business development executive owning the client`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'ownedRequirements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'bdeOwnerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  hrOwner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'hrOwner',
      label: i18nLabel(
        msg({ message: `HR Owner`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `HR owning the delivery of this requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCog',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'hrOwnedRequirements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'hrOwnerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  recruiterOwner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'recruiterOwner',
      label: i18nLabel(
        msg({ message: `Recruiter`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Recruiter working on this requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserSearch',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'recruiterOwnedRequirements',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'recruiterOwnerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  receivedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'receivedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Received At`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the requirement was received from the client`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarIn',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  targetDate: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'targetDate',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Target Date`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Client expected fulfilment date`,
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
  closedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'closedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(
        msg({ message: `Closed At`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `When the requirement was closed`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarX',
      isNullable: true,
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
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'taskTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.label,
      ),
      description: i18nLabel(
        msg({
          message: `Tasks tied to the requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget
        .icon,
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetRequirement',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
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
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'noteTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget.label,
      ),
      description: i18nLabel(
        msg({
          message: `Notes tied to the requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget
        .icon,
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetRequirement',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
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
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'attachments',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment.label,
      ),
      description: i18nLabel(
        msg({
          message: `Attachments linked to the requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment
        .icon,
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetRequirement',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
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
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'timelineActivities',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.timelineActivity
          .label,
      ),
      description: i18nLabel(
        msg({
          message: `Timeline Activities linked to the requirement.`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT
        .timelineActivity.icon,
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetRequirement',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  candidateSubmissions: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'candidateSubmissions',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Submissions`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate submissions for this requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: true,
      targetObjectName: 'candidateSubmission',
      targetFieldName: 'requirement',
      settings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  interviews: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'interviews',
      isSystemSideEffect: true,
      label: i18nLabel(
        msg({ message: `Interviews`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Interviews for this requirement`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarStats',
      isNullable: true,
      targetObjectName: 'interview',
      targetFieldName: 'requirement',
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
