import { CoreObjectNameSingular, FeatureFlagKey } from 'twenty-shared/types';
import { isAchareIgnoredObject } from 'twenty-shared/workspace';

import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';

export const useNavigationObjectMetadataItems = () => {
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const isWorkflowCoreIndexPageEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_WORKFLOW_CORE_INDEX_PAGE_ENABLED,
  );

  return objectMetadataItems.filter((objectMetadataItem) => {
    if (isAchareIgnoredObject(objectMetadataItem.nameSingular)) {
      return false;
    }
    if (
      isWorkflowCoreIndexPageEnabled &&
      objectMetadataItem.nameSingular === CoreObjectNameSingular.WorkflowVersion
    ) {
      return false;
    }
    return true;
  });
};
