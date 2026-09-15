import { getSearchFieldUniversalIdentifier } from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { findFlatEntityByUniversalIdentifierOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util';
import { type FlatSearchFieldMetadata } from 'src/engine/metadata-modules/flat-search-field-metadata/types/flat-search-field-metadata.type';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type StandardBuilderArgs } from 'src/engine/workspace-manager/twenty-standard-application/types/metadata-standard-buillder-args.type';
import { type UniversalFlatFieldMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-field-metadata.type';
import { type UniversalFlatObjectMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-object-metadata.type';

export type CreateStandardSearchFieldOptions<O extends AllStandardObjectName> =
  {
    fieldName: AllStandardObjectFieldName<O>;
    position: number;
  };

export type CreateStandardSearchFieldArgs<
  O extends AllStandardObjectName = AllStandardObjectName,
> = StandardBuilderArgs<'searchFieldMetadata'> & {
  objectName: O;
  context: CreateStandardSearchFieldOptions<O>;
};

export const createStandardSearchFieldFlatMetadata = <
  O extends AllStandardObjectName,
>({
  workspaceId,
  objectName,
  context: { fieldName, position },
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps: { flatFieldMetadataMaps, flatObjectMetadataMaps },
  twentyStandardApplicationId,
  now,
}: CreateStandardSearchFieldArgs<O>): FlatSearchFieldMetadata | null => {
  const objectFields = STANDARD_OBJECTS[objectName]?.fields;

  const objectMetadataId =
    standardObjectMetadataRelatedEntityIds[objectName]?.id;
  const fieldMetadataId =
    standardObjectMetadataRelatedEntityIds[objectName]?.fields?.[fieldName]?.id;

  const objectMetadataUniversalIdentifier =
    STANDARD_OBJECTS[objectName]?.universalIdentifier;

  if (
    !objectFields ||
    !objectMetadataId ||
    !fieldMetadataId ||
    !objectMetadataUniversalIdentifier
  ) {
    return null;
  }

  const flatObjectMetadata =
    findFlatEntityByUniversalIdentifierOrThrow<UniversalFlatObjectMetadata>({
      universalIdentifier: objectMetadataUniversalIdentifier,
      flatEntityMaps: flatObjectMetadataMaps,
    });

  const fieldMetadataUniversalIdentifier =
    (objectFields as any)[fieldName]?.universalIdentifier;
  if (!fieldMetadataUniversalIdentifier) {
    return null;
  }

  const flatFieldMetadata =
    findFlatEntityByUniversalIdentifierOrThrow<UniversalFlatFieldMetadata>({
      universalIdentifier: fieldMetadataUniversalIdentifier,
      flatEntityMaps: flatFieldMetadataMaps,
    });

  const tsVectorFieldMetadataId =
    standardObjectMetadataRelatedEntityIds[objectName]?.fields?.[
      SEARCH_VECTOR_FIELD.name as AllStandardObjectFieldName<O>
    ]?.id;
  const tsVectorFieldMetadataUniversalIdentifier =
    (objectFields as any)[SEARCH_VECTOR_FIELD.name]?.universalIdentifier;

  if (!tsVectorFieldMetadataId || !tsVectorFieldMetadataUniversalIdentifier) {
    return null;
  }

  return {
    id: v4(),
    universalIdentifier: getSearchFieldUniversalIdentifier({
      applicationUniversalIdentifier:
        flatObjectMetadata.applicationUniversalIdentifier,
      fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
    }),
    applicationId: twentyStandardApplicationId,
    applicationUniversalIdentifier:
      flatObjectMetadata.applicationUniversalIdentifier,
    objectMetadataId,
    objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
    fieldMetadataId,
    fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
    tsVectorFieldMetadataId,
    tsVectorFieldMetadataUniversalIdentifier,
    position,
    isSystemSideEffect: true,
    workspaceId,
    createdAt: now,
    updatedAt: now,
  };
};
