import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type FlatNavigationMenuItem } from 'src/engine/metadata-modules/flat-navigation-menu-item/types/flat-navigation-menu-item.type';
import { NavigationMenuItemType } from 'src/engine/metadata-modules/navigation-menu-item/enums/navigation-menu-item-type.enum';
import { NAVIGATION_MENU_ITEM_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/navigation-menu-item-seeds.constant';
import { PAGE_LAYOUT_SEEDS } from 'src/engine/workspace-manager/dev-seeder/core/constants/page-layout-seeds.constant';
import { generateSeedId } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-seed-id.util';

export const getNavigationMenuItemFlatEntitySeeds = ({
  workspaceId: _workspaceId,
  flatApplication: _flatApplication,
}: {
  workspaceId: string;
  flatApplication: FlatApplication;
}): FlatNavigationMenuItem[] => {
  return [];
};
