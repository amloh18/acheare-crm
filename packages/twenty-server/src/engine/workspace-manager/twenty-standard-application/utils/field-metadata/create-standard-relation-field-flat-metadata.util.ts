import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type StandardBuilderArgs } from 'src/engine/workspace-manager/twenty-standard-application/types/metadata-standard-buillder-args.type';
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import {
  MetadataWritability,
  type FieldMetadataComplexOption,
  type FieldMetadataDefaultOption,
  type FieldMetadataDefaultValueForAnyType,
  type FieldMetadataSettings,
  type FieldMetadataType,
} from 'twenty-shared/types';
import { v4 } from 'uuid';
export type CreateStandardRelationFieldContext<
  O extends AllStandardObjectName,
  T extends AllStandardObjectName,
> = CreateStandardMorphOrRelationFieldContext<
  O,
  T,
  FieldMetadataType.RELATION | FieldMetadataType.MORPH_RELATION
>;

export type CreateStandardMorphOrRelationFieldContext<
  O extends AllStandardObjectName,
  T extends AllStandardObjectName,
  F extends FieldMetadataType.RELATION | FieldMetadataType.MORPH_RELATION,
> = {
  type: F;
  fieldName: AllStandardObjectFieldName<O>;
  label: string;
  description: string;
  icon: string;
  targetObjectName: T;
  targetFieldName: AllStandardObjectFieldName<T>;
  isNullable?: boolean;
  isUIEditable?: boolean;
  isSystemSideEffect?: boolean;
  defaultValue?: FieldMetadataDefaultValueForAnyType;
  settings: FieldMetadataSettings<F>;
  options?: FieldMetadataDefaultOption[] | FieldMetadataComplexOption[] | null;
  morphId: F extends FieldMetadataType.MORPH_RELATION ? string : null;
  junctionTargetFieldUniversalIdentifier?: string;
};

export type CreateStandardRelationFieldArgs<
  O extends AllStandardObjectName,
  T extends AllStandardObjectName,
> = StandardBuilderArgs<'fieldMetadata'> & {
  objectName: O;
  context: CreateStandardRelationFieldContext<O, T>;
};

export const createStandardRelationFieldFlatMetadata = <
  O extends AllStandardObjectName,
  T extends AllStandardObjectName,
>({
  objectName,
  workspaceId,
  context: {
    fieldName,
    label,
    description,
    icon,
    targetObjectName,
    targetFieldName,
    isNullable = true,
    isUIEditable = true,
    isSystemSideEffect = false,
    defaultValue = null,
    settings,
    options: fieldOptions = null,
    morphId,
    type,
    junctionTargetFieldUniversalIdentifier,
  },
  standardObjectMetadataRelatedEntityIds,
  twentyStandardApplicationId,
  now,
}: CreateStandardRelationFieldArgs<O, T>): FlatFieldMetadata => {
  const objectFields = STANDARD_OBJECTS[objectName]?.fields;
  const fieldDefinition = objectFields
    ? (objectFields as any)[fieldName]
    : undefined;
  const fieldIds = standardObjectMetadataRelatedEntityIds[objectName]?.fields;

  const targetFieldIds =
    standardObjectMetadataRelatedEntityIds[targetObjectName]?.fields;

  const targetObjectFields = STANDARD_OBJECTS[targetObjectName]?.fields;
  const targetFieldDefinition = targetObjectFields
    ? (targetObjectFields as any)[targetFieldName]
    : undefined;

  return {
    id: (fieldIds as any)?.[fieldName]?.id ?? v4(),
    universalIdentifier: fieldDefinition?.universalIdentifier ?? v4(),
    applicationId: twentyStandardApplicationId,
    workspaceId,
    objectMetadataId: standardObjectMetadataRelatedEntityIds[objectName]?.id ?? v4(),
    type,
    name: fieldName.toString(),
    label,
    description,
    icon,
    isActive: true,
    isSystem: false,
    isSystemSideEffect,
    isNullable,
    isUnique: false,
    isSearchable: false,
    isUIEditable,
    writability: MetadataWritability.OPEN,
    isLabelSyncedWithName: false,
    overrides: null,
    defaultValue,
    settings,
    options: fieldOptions,
    relationTargetFieldMetadataId:
      targetFieldIds?.[targetFieldName]?.id ?? null,
    relationTargetObjectMetadataId:
      standardObjectMetadataRelatedEntityIds[targetObjectName]?.id ?? null,
    morphId,
    viewFieldIds: [],
    viewFilterIds: [],
    fieldPermissionIds: [],
    kanbanAggregateOperationViewIds: [],
    calendarViewIds: [],
    calendarEndViewIds: [],
    mainGroupByFieldMetadataViewIds: [],
    createdAt: now,
    updatedAt: now,
    applicationUniversalIdentifier:
      TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectMetadataUniversalIdentifier:
      STANDARD_OBJECTS[objectName]?.universalIdentifier ?? v4(),
    relationTargetObjectMetadataUniversalIdentifier:
      STANDARD_OBJECTS[targetObjectName]?.universalIdentifier ?? v4(),
    relationTargetFieldMetadataUniversalIdentifier:
      targetFieldDefinition?.universalIdentifier ?? null,
    viewFilterUniversalIdentifiers: [],
    viewFieldUniversalIdentifiers: [],
    fieldPermissionUniversalIdentifiers: [],
    kanbanAggregateOperationViewUniversalIdentifiers: [],
    calendarViewUniversalIdentifiers: [],
    calendarEndViewUniversalIdentifiers: [],
    mainGroupByFieldMetadataViewUniversalIdentifiers: [],
    viewSortIds: [],
    viewSortUniversalIdentifiers: [],
    searchFieldMetadataIds: [],
    searchFieldMetadataUniversalIdentifiers: [],
    universalSettings: {
      ...settings,
      ...(junctionTargetFieldUniversalIdentifier && {
        junctionTargetFieldUniversalIdentifier,
      }),
    },
  };
};
