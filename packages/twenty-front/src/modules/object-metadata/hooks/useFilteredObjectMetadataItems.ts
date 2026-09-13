import { objectMetadataItemsWithFieldsSelector } from '@/object-metadata/states/objectMetadataItemsWithFieldsSelector';
import { useMemo } from 'react';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

import { isAchareIgnoredObject } from 'twenty-shared/workspace';

export const useFilteredObjectMetadataItems = () => {
  const objectMetadataItemsWithFields = useAtomStateValue(
    objectMetadataItemsWithFieldsSelector,
  );
  const objectMetadataItems = useMemo(
    () =>
      objectMetadataItemsWithFields.filter(
        ({ nameSingular }) => !isAchareIgnoredObject(nameSingular),
      ),
    [objectMetadataItemsWithFields],
  );

  const activeNonSystemObjectMetadataItems = useMemo(
    () =>
      objectMetadataItems.filter(
        ({ isActive, isSystem }) => isActive && !isSystem,
      ),
    [objectMetadataItems],
  );

  const activeObjectMetadataItems = useMemo(
    () =>
      objectMetadataItems
        .filter(({ isActive }) => isActive)
        .sort((a, b) => a.labelSingular.localeCompare(b.labelSingular)),
    [objectMetadataItems],
  );

  const alphaSortedActiveNonSystemObjectMetadataItems = [
    ...activeNonSystemObjectMetadataItems,
  ].sort((a, b) => {
    if (a.nameSingular < b.nameSingular) {
      return -1;
    }
    if (a.nameSingular > b.nameSingular) {
      return 1;
    }
    return 0;
  });

  const inactiveNonSystemObjectMetadataItems = objectMetadataItems.filter(
    ({ isActive, isSystem }) => !isActive && !isSystem,
  );

  const findActiveObjectMetadataItemByNamePlural = (namePlural: string) =>
    activeNonSystemObjectMetadataItems.find(
      (activeObjectMetadataItem) =>
        activeObjectMetadataItem.namePlural === namePlural,
    );

  const findObjectMetadataItemById = (id: string) =>
    objectMetadataItems.find(
      (objectMetadataItem) => objectMetadataItem.id === id,
    );

  const findObjectMetadataItemByNamePlural = (namePlural: string) =>
    objectMetadataItems.find(
      (objectMetadataItem) => objectMetadataItem.namePlural === namePlural,
    );

  return {
    activeNonSystemObjectMetadataItems,
    activeObjectMetadataItems,
    findObjectMetadataItemById,
    findObjectMetadataItemByNamePlural,
    findActiveObjectMetadataItemByNamePlural,
    inactiveNonSystemObjectMetadataItems,
    objectMetadataItems,
    alphaSortedActiveNonSystemObjectMetadataItems,
  };
};
