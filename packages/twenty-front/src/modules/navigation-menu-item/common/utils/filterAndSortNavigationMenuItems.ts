import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type View } from '@/views/types/View';
import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { isAchareStandardObjectEnabled } from 'twenty-shared/workspace';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

type NavigationObjectMetadataItem = Pick<
  EnrichedObjectMetadataItem,
  'id' | 'isActive' | 'nameSingular'
>;

export const filterAndSortNavigationMenuItems = (
  navigationMenuItems: NavigationMenuItem[],
  views: Pick<View, 'id' | 'objectMetadataId' | 'key'>[],
  objectMetadataItems: NavigationObjectMetadataItem[],
  /**
   * Enabled Achare product features. When provided, navigation items pointing
   * at an object gated by a disabled feature are hidden. When `undefined` (the
   * configuration is still loading, or this is not an Achare workspace) no
   * feature filtering is applied.
   */
  enabledAchareFeatures?: string[],
): NavigationMenuItem[] => {
  const activeObjectMetadataItems = objectMetadataItems.filter(
    (meta) => meta.isActive,
  );

  const isObjectMetadataAllowed = (objectMetadataId: string): boolean => {
    if (!isDefined(enabledAchareFeatures)) {
      return true;
    }

    const objectMetadataItem = activeObjectMetadataItems.find(
      (meta) => meta.id === objectMetadataId,
    );

    if (!isDefined(objectMetadataItem)) {
      return true;
    }

    return isAchareStandardObjectEnabled(
      objectMetadataItem.nameSingular,
      enabledAchareFeatures,
    );
  };

  return navigationMenuItems
    .filter((item) => {
      if (item.type === NavigationMenuItemType.FOLDER) {
        return true;
      }
      if (item.type === NavigationMenuItemType.LINK) {
        return true;
      }
      if (item.type === NavigationMenuItemType.PAGE_LAYOUT) {
        return isDefined(item.pageLayoutId);
      }
      if (item.type === NavigationMenuItemType.OBJECT) {
        return (
          isDefined(item.targetObjectMetadataId) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === item.targetObjectMetadataId,
          ) &&
          isObjectMetadataAllowed(item.targetObjectMetadataId)
        );
      }
      if (item.type === NavigationMenuItemType.VIEW) {
        if (!isDefined(item.viewId)) {
          return false;
        }
        const view = views.find((view) => view.id === item.viewId);
        return (
          isDefined(view) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === view.objectMetadataId,
          ) &&
          isObjectMetadataAllowed(view.objectMetadataId)
        );
      }
      if (item.type === NavigationMenuItemType.RECORD) {
        return (
          isDefined(item.targetRecordId) &&
          isDefined(item.targetObjectMetadataId) &&
          isDefined(item.targetRecordIdentifier) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === item.targetObjectMetadataId,
          ) &&
          isObjectMetadataAllowed(item.targetObjectMetadataId)
        );
      }
      return false;
    })
    .sort((a, b) => a.position - b.position);
};
