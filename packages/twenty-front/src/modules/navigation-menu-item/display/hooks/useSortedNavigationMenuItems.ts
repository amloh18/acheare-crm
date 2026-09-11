import { useMemo } from 'react';

import { filterAndSortNavigationMenuItems } from '@/navigation-menu-item/common/utils/filterAndSortNavigationMenuItems';
import { useNavigationObjectMetadataItems } from '@/navigation-menu-item/common/hooks/useNavigationObjectMetadataItems';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';

import { useNavigationMenuItemsData } from './useNavigationMenuItemsData';

export const useSortedNavigationMenuItems = () => {
  const { navigationMenuItems, workspaceNavigationMenuItems } =
    useNavigationMenuItemsData();
  const views = useAtomStateValue(viewsSelector);
  const objectMetadataItems = useNavigationObjectMetadataItems();
  const enabledAchareFeatures = useAchareEnabledFeatures();

  const navigationMenuItemsSorted = useMemo(() => {
    return filterAndSortNavigationMenuItems(
      navigationMenuItems,
      views,
      objectMetadataItems,
      enabledAchareFeatures,
    );
  }, [navigationMenuItems, views, objectMetadataItems, enabledAchareFeatures]);

  const workspaceNavigationMenuItemsSorted = useMemo(() => {
    return filterAndSortNavigationMenuItems(
      workspaceNavigationMenuItems,
      views,
      objectMetadataItems,
      enabledAchareFeatures,
    );
  }, [
    workspaceNavigationMenuItems,
    views,
    objectMetadataItems,
    enabledAchareFeatures,
  ]);

  return {
    navigationMenuItemsSorted,
    workspaceNavigationMenuItemsSorted,
  };
};
