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

const RELATIONSHIP_TYPE_OPTIONS = [
  {
    id: 'f4a5b6c7-0001-4000-8000-00000000a001',
    value: 'CONTACT',
    label: i18nLabel(msg({ message: `Contact`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0002-4000-8000-00000000a002',
    value: 'DECISION_MAKER',
    label: i18nLabel(
      msg({ message: `Decision maker`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'purple',
  },
  {
    id: 'f4a5b6c7-0003-4000-8000-00000000a003',
    value: 'HIRING_MANAGER',
    label: i18nLabel(
      msg({ message: `Hiring manager`, context: 'fieldMetadata.label' }),
    ),
    position: 2,
    color: 'blue',
  },
  {
    id: 'f4a5b6c7-0004-4000-8000-00000000a004',
    value: 'BILLING_CONTACT',
    label: i18nLabel(
      msg({ message: `Billing contact`, context: 'fieldMetadata.label' }),
    ),
    position: 3,
    color: 'orange',
  },
  {
    id: 'f4a5b6c7-0005-4000-8000-00000000a005',
    value: 'TECHNICAL_CONTACT',
    label: i18nLabel(
      msg({ message: `Technical contact`, context: 'fieldMetadata.label' }),
    ),
    position: 4,
    color: 'turquoise',
  },
  {
    id: 'f4a5b6c7-0006-4000-8000-00000000a006',
    value: 'OTHER',
    label: i18nLabel(msg({ message: `Other`, context: 'fieldMetadata.label' })),
    position: 5,
    color: 'gray',
  },
];

const RELATIONSHIP_STATUS_OPTIONS = [
  {
    id: 'f4a5b6c7-0011-4000-8000-00000000b001',
    value: 'ACTIVE',
    label: i18nLabel(msg({ message: `Active`, context: 'fieldMetadata.label' })),
    position: 0,
    color: 'green',
  },
  {
    id: 'f4a5b6c7-0012-4000-8000-00000000b002',
    value: 'INACTIVE',
    label: i18nLabel(
      msg({ message: `Inactive`, context: 'fieldMetadata.label' }),
    ),
    position: 1,
    color: 'gray',
  },
  {
    id: 'f4a5b6c7-0013-4000-8000-00000000b003',
    value: 'FORMER',
    label: i18nLabel(msg({ message: `Former`, context: 'fieldMetadata.label' })),
    position: 2,
    color: 'orange',
  },
];

export const buildCompanyPersonRelationshipStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'companyPersonRelationship', FieldMetadataType>,
  'context'
>): Record<
  AllStandardObjectFieldName<'companyPersonRelationship'>,
  FlatFieldMetadata
> => ({
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

  company: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'company',
      label: i18nLabel(msg({ message: `Company`, context: 'fieldMetadata.label' })),
      description: i18nLabel(
        msg({
          message: `Company this person is linked to`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconBuildingSkyscraper',
      isNullable: false,
      targetObjectName: 'company',
      targetFieldName: 'companyPersonRelationships',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'companyId',
      },
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
          message: `Person linked to the company`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUser',
      isNullable: false,
      targetObjectName: 'person',
      targetFieldName: 'companyPersonRelationships',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'personId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  relationshipOwner: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'relationshipOwner',
      label: i18nLabel(
        msg({ message: `Relationship owner`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Workspace member who owns this relationship`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconUserCircle',
      isNullable: true,
      targetObjectName: 'workspaceMember',
      targetFieldName: 'ownedCompanyPersonRelationships',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.SET_NULL,
        joinColumnName: 'relationshipOwnerId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  jobTitle: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'jobTitle',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Job title`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Job title at this company`,
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
  department: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'department',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(
        msg({ message: `Department`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Department at this company`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconSitemap',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  relationshipType: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'relationshipType',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(
        msg({ message: `Relationship type`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `How this person relates to the company`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconAffiliate',
      isNullable: true,
      defaultValue: "'CONTACT'",
      options: RELATIONSHIP_TYPE_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  isPrimary: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'isPrimary',
      type: FieldMetadataType.BOOLEAN,
      label: i18nLabel(
        msg({ message: `Primary contact`, context: 'fieldMetadata.label' }),
      ),
      description: i18nLabel(
        msg({
          message: `Whether this is the primary contact for the company`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconStar',
      isNullable: false,
      defaultValue: false,
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
          message: `Relationship status`,
          context: 'fieldMetadata.description',
        }),
      ),
      icon: 'IconProgressCheck',
      isNullable: true,
      defaultValue: "'ACTIVE'",
      options: RELATIONSHIP_STATUS_OPTIONS,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
