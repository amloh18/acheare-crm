import { useListenToMetadataOperationBrowserEvent } from '@/browser-event/hooks/useListenToMetadataOperationBrowserEvent';
import { useContextStoreObjectMetadataItemOrThrow } from '@/context-store/hooks/useContextStoreObjectMetadataItemOrThrow';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { useLoadRecordIndexStates } from '@/object-record/record-index/hooks/useLoadRecordIndexStates';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { viewFromViewIdFamilySelector } from '@/views/states/selectors/viewFromViewIdFamilySelector';
import { useStore } from 'jotai';
import { isDefined } from 'twenty-shared/utils';
import { AllMetadataName } from '~/generated-metadata/graphql';

export const RecordIndexViewFieldsSSESyncEffect = () => {
  const store = useStore();

  const { syncRecordIndexViewFields } = useLoadRecordIndexStates();
  const { objectMetadataItem } = useContextStoreObjectMetadataItemOrThrow();

  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );

  const syncViewFields = () => {
    if (!isDefined(contextStoreCurrentViewId)) {
      return;
    }

    const currentView = store.get(
      viewFromViewIdFamilySelector.selectorFamily({
        viewId: contextStoreCurrentViewId,
      }),
    );

    if (!isDefined(currentView)) {
      return;
    }

    syncRecordIndexViewFields(currentView, objectMetadataItem);
  };

  useListenToMetadataOperationBrowserEvent({
    metadataName: AllMetadataName.viewField,
    onMetadataOperationBrowserEvent: syncViewFields,
  });

  useListenToMetadataOperationBrowserEvent({
    metadataName: AllMetadataName.fieldMetadata,
    onMetadataOperationBrowserEvent: syncViewFields,
  });

  useListenToMetadataOperationBrowserEvent({
    metadataName: AllMetadataName.objectMetadata,
    onMetadataOperationBrowserEvent: syncViewFields,
  });

  return null;
};
