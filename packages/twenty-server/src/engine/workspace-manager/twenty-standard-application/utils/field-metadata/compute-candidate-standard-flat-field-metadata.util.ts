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

const CANDIDATE_SOURCE_OPTIONS = [
  {
    id: '05d45e89-d9ea-465d-bcfb-30061174d106',
    value: 'LINKEDIN',
    label: i18nLabel(
      msg({ message: `LinkedIn`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'blue',
  },
  {
    id: 'afe8c0e1-5814-4861-8715-5730b217922d',
    value: 'JOB_PORTAL',
    label: i18nLabel(
      msg({ message: `Job Portal`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'sky',
  },
  {
    id: 'b3e7225c-29a4-4022-9a2a-dc3d0839b4e4',
    value: 'REFERRAL',
    label: i18nLabel(
      msg({ message: `Referral`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'green',
  },
  {
    id: '58826ac9-7c9a-47d0-bb75-c38e9539ca5b',
    value: 'DATABASE',
    label: i18nLabel(
      msg({ message: `Database`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'gray',
  },
  {
    id: '3e90768b-3a7b-4e55-8844-dd810f25b83b',
    value: 'WALK_IN',
    label: i18nLabel(msg({ message: `Walk-in`, context: 'fieldMetadata.label' })),
    position: 4,
    color: 'orange',
  },
  {
    id: '9f8ca4b2-7671-45b4-8fdf-5a654adcf1e2',
    value: 'WEBSITE',
    label: i18nLabel(
      msg({ message: `Website`, context: 'fieldMetadata.label' }),
    ),
    position: 5,
    color: 'turquoise',
  },
  {
    id: 'c9b9d4ea-b74e-42e6-839a-0a04f1a9e8f1',
    value: 'EMPLOYEE_REFERRAL',
    label: i18nLabel(
      msg({ message: `Employee Referral`, context: 'fieldMetadata.label' }),
    ),
    position: 6,
    color: 'yellow',
  },
  {
    id: 'c571c877-c814-44ac-bee0-3df22d672edf',
    value: 'CLIENT_REFERRAL',
    label: i18nLabel(
      msg({ message: `Client Referral`, context: 'fieldMetadata.label' }),
    ),
    position: 7,
    color: 'purple',
  },
  {
    id: 'c5abee0a-bfef-4d2d-aa4a-59e9b36b77a1',
    value: 'OTHER',
    label: i18nLabel(msg({ message: `Other`, context: 'fieldMetadata.label' })),
    position: 8,
    color: 'gray',
  },
];

const NOTICE_PERIOD_OPTIONS = [
  {
    id: 'cd86a46c-a3fd-4415-b6d6-be2d4020d4c6',
    value: 'IMMEDIATE',
    label: i18nLabel(
      msg({ message: `Immediate`, context: 'fieldMetadata.label' }),
    ),
    position: 0,
    color: 'green',
  },
  {
    id: '02ddc79a-61c0-4e94-bc3b-eb4ff3c67dc3',
    value: 'D15',
    label: i18nLabel(msg({ message: `15 days`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'sky',
  },
  {
    id: '4fa975c8-7e1d-40b7-ac85-dad5c37c8919',
    value: 'D30',
    label: i18nLabel(msg({ message: `30 days`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'blue',
  },
  {
    id: 'fb3d63b1-35fe-4555-953b-8020659ebc6f',
    value: 'D60',
    label: i18nLabel(msg({ message: `60 days`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'orange',
  },
  {
    id: '0e976858-cc49-477b-ab88-9a0f65144ea6',
    value: 'D90',
    label: i18nLabel(msg({ message: `90 days`, context: 'fieldMetadata.label' })),
    position: 4,
    color: 'red',
  },
];

const CANDIDATE_STATUS_OPTIONS = [
  {
    id: 'b2bc3e3e-08fc-4a1d-b92c-12d5e393fe1a',
    value: 'NEW',
    label: i18nLabel(msg({ message: `New`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'sky',
  },
  {
    id: '3d07c482-123b-4ff6-bd0a-38d28de100ab',
    value: 'ACTIVE',
    label: i18nLabel(msg({ message: `Active`, context: 'fieldMetadata.label' })),
    position: 1,
    color: 'green',
  },
  {
    id: '77cb2559-ba56-4caa-a051-c0a92a4a3e1e',
    value: 'PLACED',
    label: i18nLabel(msg({ message: `Placed`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'turquoise',
  },
  {
    id: '35b76f57-7d60-458c-91a1-9cdbbf564775',
    value: 'ON_HOLD',
    label: i18nLabel(msg({ message: `On Hold`, context: 'fieldMetadata.label' })),
    position: 3,
    color: 'yellow',
  },
  {
    id: 'ce662bb4-a4f1-44e6-a587-936e1d2e1be8',
    value: 'BLACKLISTED',
    label: i18nLabel(
      msg({ message: `Blacklisted`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'red',
  },
  {
    id: '4e1135e6-60d6-4ebb-93aa-d381c2a35145',
    value: 'INACTIVE',
    label: i18nLabel(
      msg({ message: `Inactive`, context: 'fieldMetadata.label' }),
    ),
    position: 5,
    color: 'gray',
  },
];

export const buildCandidateStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'candidate', FieldMetadataType>,
  'context'
>): Record<AllStandardObjectFieldName<'candidate'>, FlatFieldMetadata> => ({
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

  name: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'name',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg({ message: `Name`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Candidate display name`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  person: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'person',
      label: i18nLabel(msg({ message: `Person`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Person record holding the candidate contact details`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: true,
      targetObjectName: 'person',
      targetFieldName: 'candidateProfiles',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'personId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  source: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'source',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Source`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Where the candidate came from`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBrandLinkedin',
      isNullable: true,
      options: CANDIDATE_SOURCE_OPTIONS,
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
      label: i18nLabel(msg({ message: `Skills`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Candidate skills`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSparkles',
      isNullable: true,
      options: [
        {
          id: 'e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a8b',
          value: 'REACT',
          label: i18nLabel(msg({ message: `React`, context: 'fieldMetadata.label' })),
          position: 0,
          color: 'sky',
        },
        {
          id: 'f6a7b8c9-d0e1-4f2a-9b3c-4d5e6f7a8b9c',
          value: 'NODE_JS',
          label: i18nLabel(msg({ message: `Node.js`, context: 'fieldMetadata.label' })),
          position: 1,
          color: 'green',
        },
        {
          id: 'a7b8c9d0-e1f2-4a3b-8c4d-5e6f7a8b9c0d',
          value: 'PYTHON',
          label: i18nLabel(msg({ message: `Python`, context: 'fieldMetadata.label' })),
          position: 2,
          color: 'blue',
        },
        {
          id: 'b8c9d0e1-f2a3-4b4c-9d5e-6f7a8b9c0d1e',
          value: 'JAVA',
          label: i18nLabel(msg({ message: `Java`, context: 'fieldMetadata.label' })),
          position: 3,
          color: 'orange',
        },
        {
          id: 'c9d0e1f2-a3b4-4c5d-8e6f-7a8b9c0d1e2f',
          value: 'SALES',
          label: i18nLabel(msg({ message: `Sales`, context: 'fieldMetadata.label' })),
          position: 4,
          color: 'yellow',
        },
        {
          id: 'd0e1f2a3-b4c5-4d6e-9f7a-8b9c0d1e2f3a',
          value: 'MARKETING',
          label: i18nLabel(msg({ message: `Marketing`, context: 'fieldMetadata.label' })),
          position: 5,
          color: 'pink',
        },
        {
          id: 'e1f2a3b4-c5d6-4e7f-8a8b-9c0d1e2f3a4b',
          value: 'DESIGN',
          label: i18nLabel(msg({ message: `Design`, context: 'fieldMetadata.label' })),
          position: 6,
          color: 'purple',
        },
        {
          id: 'f2a3b4c5-d6e7-4f8a-9b9c-0d1e2f3a4b5c',
          value: 'HR',
          label: i18nLabel(msg({ message: `HR`, context: 'fieldMetadata.label' })),
          position: 7,
          color: 'turquoise',
        },
        {
          id: 'a3b4c5d6-e7f8-4a9b-8c0d-1e2f3a4b5c6d',
          value: 'FINANCE',
          label: i18nLabel(msg({ message: `Finance`, context: 'fieldMetadata.label' })),
          position: 8,
          color: 'crimson',
        },
        {
          id: 'b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e',
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
  totalExperienceYears: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'totalExperienceYears',
      type: FieldMetadataType.NUMBER,
      label: i18nLabel(
        msg({ message: `Experience`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Total experience in years`,
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
  currentCompany: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'currentCompany',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Current Company`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Company the candidate currently works at`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  currentDesignation: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'currentDesignation',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Current Designation`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate current designation`,
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
  currentSalary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'currentSalary',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Current Salary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate current salary`,
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
  expectedSalary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'expectedSalary',
      type: FieldMetadataType.CURRENCY,
      label: i18nLabel(
        msg({ message: `Expected Salary`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate expected salary`,
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
  noticePeriod: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'noticePeriod',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Notice Period`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate notice period`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconHourglass',
      isNullable: true,
      options: NOTICE_PERIOD_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  preferredLocation: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'preferredLocation',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Preferred Location`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Candidate preferred work location`,
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
          message: `Recruiter owning this candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserSearch',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'ownedCandidates',
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
  status: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'status',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg({ message: `Status`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Candidate status`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'NEW'",
      options: CANDIDATE_STATUS_OPTIONS,
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
          message: `Submissions of this candidate to requirements`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSend',
      isNullable: true,
      targetObjectName: 'candidateSubmission',
      targetFieldName: 'candidate',
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
          message: `Interviews of this candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconCalendarStats',
      isNullable: true,
      targetObjectName: 'interview',
      targetFieldName: 'candidate',
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
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'taskTargets',
      isSystemSideEffect: true,
      label: i18nLabel(
        STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.label,
      ),
      description: i18nLabel(
        msg({
          message: `Tasks tied to the candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget
        .icon,
      isNullable: true,
      targetObjectName: 'taskTarget',
      targetFieldName: 'targetCandidate',
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
          message: `Notes tied to the candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget
        .icon,
      isNullable: true,
      targetObjectName: 'noteTarget',
      targetFieldName: 'targetCandidate',
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
          message: `Attachments linked to the candidate`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment
        .icon,
      isNullable: true,
      targetObjectName: 'attachment',
      targetFieldName: 'targetCandidate',
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
          message: `Timeline Activities linked to the candidate.`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT
        .timelineActivity.icon,
      isNullable: true,
      targetObjectName: 'timelineActivity',
      targetFieldName: 'targetCandidate',
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
