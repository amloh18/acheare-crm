import { useContextStoreObjectMetadataItemOrThrow } from '@/context-store/hooks/useContextStoreObjectMetadataItemOrThrow';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { useLoadRecordIndexStates } from '@/object-record/record-index/hooks/useLoadRecordIndexStates';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { viewFromViewIdFamilySelector } from '@/views/states/selectors/viewFromViewIdFamilySelector';
import { useEffect, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { ViewKey, ViewType } from '~/generated-metadata/graphql';
import { type View } from '@/views/types/View';

export const RecordIndexLoadBaseOnContextStoreEffect = () => {
  const { loadRecordIndexStates } = useLoadRecordIndexStates();
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );

  const [loadedViewKey, setLoadedViewKey] = useState<string | undefined>();

  const view = useAtomFamilySelectorValue(viewFromViewIdFamilySelector, {
    viewId: contextStoreCurrentViewId ?? '',
  });

  const viewGroupsSignature = (view?.viewGroups ?? [])
    .map((viewGroup) => viewGroup.id)
    .sort()
    .join(',');

  const currentViewLoadKey = isDefined(contextStoreCurrentViewId)
    ? `${contextStoreCurrentViewId}-${viewGroupsSignature}`
    : undefined;

  const { objectMetadataItem } = useContextStoreObjectMetadataItemOrThrow();

  useEffect(() => {
    if (isDefined(currentViewLoadKey) && loadedViewKey === currentViewLoadKey) {
      return;
    }

    if (!isDefined(objectMetadataItem)) {
      return;
    }

    if (isDefined(view)) {
      loadRecordIndexStates(view, objectMetadataItem);
      setLoadedViewKey(currentViewLoadKey);
    } else if (!isDefined(contextStoreCurrentViewId)) {
      const fallbackKey = `default-${objectMetadataItem.id}`;
      if (loadedViewKey !== fallbackKey) {
        loadRecordIndexStates(
          {
            id: fallbackKey,
            name: 'All',
            type: ViewType.TABLE,
            key: ViewKey.INDEX,
            objectMetadataId: objectMetadataItem.id,
            position: 0,
            icon: 'IconTable',
            viewFields: [],
            viewFilters: [],
            viewFilterGroups: [],
            viewSorts: [],
            viewGroups: [],
            isCompact: false,
          } as unknown as View,
          objectMetadataItem,
        );
        setLoadedViewKey(fallbackKey);
      }
    }
  }, [
    contextStoreCurrentViewId,
    currentViewLoadKey,
    loadRecordIndexStates,
    loadedViewKey,
    objectMetadataItem,
    view,
  ]);

  return <></>;
};
