import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { buildStandardFlatFieldMetadataMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/build-standard-flat-field-metadata-maps.util';
import { getStandardObjectMetadataRelatedEntityIds } from 'src/engine/workspace-manager/twenty-standard-application/utils/get-standard-object-metadata-related-entity-ids.util';
import { buildStandardFlatObjectMetadataMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/object-metadata/build-standard-flat-object-metadata-maps.util';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

// Why this test exists: a field declared in STANDARD_OBJECT_FIELDS but never
// built by the matching compute-<object>-standard-flat-field-metadata util
// leaves a dangling universal identifier behind. Standard indexes resolve
// their field references through the constant, so the whole standard
// application build blows up with
//   "Could not find flat entity with universal identifier <uuid>"
// and every workspace creation fails. That is exactly what happened with
// payrollAdjustment.payrollPeriod (see ACHEARE-PHASE0-AUDIT.md).
//
// The gaps listed below are pre-existing and deliberately not fixed yet: the
// four system relation fields (taskTargets/noteTargets/attachments/
// timelineActivities) need a matching morph target on taskTarget/noteTarget/
// attachment/timelineActivity for every new object, which is a separate piece
// of work. They are recorded here so that *new* drift fails the build instead
// of silently accumulating. Shrink this list, never grow it.
const SYSTEM_RELATION_FIELD_NAMES = [
  'taskTargets',
  'noteTargets',
  'attachments',
  'timelineActivities',
] as const;

const KNOWN_DECLARED_BUT_NOT_BUILT: Partial<
  Record<AllStandardObjectName, string[]>
> = {
  employee: ['manager'],
  team: ['department', 'teamLead'],
  onboardingItem: [...SYSTEM_RELATION_FIELD_NAMES],
  shift: [...SYSTEM_RELATION_FIELD_NAMES],
  rosterAssignment: [...SYSTEM_RELATION_FIELD_NAMES],
  attendanceEvent: [...SYSTEM_RELATION_FIELD_NAMES],
  attendanceDay: [...SYSTEM_RELATION_FIELD_NAMES],
  attendanceCorrection: [...SYSTEM_RELATION_FIELD_NAMES],
  leaveType: [...SYSTEM_RELATION_FIELD_NAMES],
  leaveRequest: [...SYSTEM_RELATION_FIELD_NAMES],
  leaveBalance: [...SYSTEM_RELATION_FIELD_NAMES],
  salaryStructure: [...SYSTEM_RELATION_FIELD_NAMES],
  salaryComponent: [...SYSTEM_RELATION_FIELD_NAMES],
  payrollPeriod: [...SYSTEM_RELATION_FIELD_NAMES],
  payslip: [...SYSTEM_RELATION_FIELD_NAMES],
  payslipLine: [...SYSTEM_RELATION_FIELD_NAMES],
  payrollAdjustment: [...SYSTEM_RELATION_FIELD_NAMES],
  payment: [...SYSTEM_RELATION_FIELD_NAMES],
};

const buildFieldNamesByObjectUniversalIdentifier = () => {
  const standardObjectMetadataRelatedEntityIds =
    getStandardObjectMetadataRelatedEntityIds();

  const flatObjectMetadataMaps = buildStandardFlatObjectMetadataMaps({
    now: NOW,
    workspaceId: WORKSPACE_ID,
    twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps: {
      flatFieldMetadataMaps: createEmptyFlatEntityMaps(),
    },
  });

  const flatFieldMetadataMaps = buildStandardFlatFieldMetadataMaps({
    now: NOW,
    workspaceId: WORKSPACE_ID,
    twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps: { flatObjectMetadataMaps },
  });

  const fieldNamesByObjectUniversalIdentifier = new Map<string, Set<string>>();

  for (const flatFieldMetadata of Object.values(
    flatFieldMetadataMaps.byUniversalIdentifier,
  ).filter(isDefined)) {
    const objectUniversalIdentifier =
      flatFieldMetadata.objectMetadataUniversalIdentifier;

    if (!isDefined(objectUniversalIdentifier)) {
      continue;
    }

    const fieldNames =
      fieldNamesByObjectUniversalIdentifier.get(objectUniversalIdentifier) ??
      new Set<string>();

    fieldNames.add(flatFieldMetadata.name);
    fieldNamesByObjectUniversalIdentifier.set(
      objectUniversalIdentifier,
      fieldNames,
    );
  }

  return fieldNamesByObjectUniversalIdentifier;
};

describe('Standard field declaration parity', () => {
  const fieldNamesByObjectUniversalIdentifier =
    buildFieldNamesByObjectUniversalIdentifier();

  it('never declares a field without building it, beyond the known gaps', () => {
    const unexpectedMismatches: string[] = [];
    const resolvedKnownGaps: string[] = [];

    for (const objectName of Object.keys(
      STANDARD_OBJECTS,
    ) as AllStandardObjectName[]) {
      const objectDefinition = STANDARD_OBJECTS[objectName];
      const declaredFieldNames = Object.keys(objectDefinition.fields);
      const builtFieldNames =
        fieldNamesByObjectUniversalIdentifier.get(
          objectDefinition.universalIdentifier,
        ) ?? new Set<string>();

      const knownGaps = KNOWN_DECLARED_BUT_NOT_BUILT[objectName] ?? [];

      const missing = declaredFieldNames.filter(
        (fieldName) => !builtFieldNames.has(fieldName),
      );

      const unknownMissing = missing.filter(
        (fieldName) => !knownGaps.includes(fieldName),
      );

      if (unknownMissing.length > 0) {
        unexpectedMismatches.push(
          `${objectName}: ${unknownMissing.join(', ')}`,
        );
      }

      const nowBuilt = knownGaps.filter((fieldName) =>
        builtFieldNames.has(fieldName),
      );

      if (nowBuilt.length > 0) {
        resolvedKnownGaps.push(`${objectName}: ${nowBuilt.join(', ')}`);
      }

      const builtButNotDeclared = [...builtFieldNames].filter(
        (fieldName) => !declaredFieldNames.includes(fieldName),
      );

      if (builtButNotDeclared.length > 0) {
        unexpectedMismatches.push(
          `${objectName} (built but not declared): ${builtButNotDeclared.join(', ')}`,
        );
      }
    }

    expect(unexpectedMismatches).toEqual([]);

    // Keeps the allowlist honest: once a gap is closed, drop it from the list.
    expect(resolvedKnownGaps).toEqual([]);
  });
});
