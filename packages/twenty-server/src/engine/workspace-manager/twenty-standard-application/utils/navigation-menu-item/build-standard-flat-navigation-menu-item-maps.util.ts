import { v4 } from 'uuid';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatNavigationMenuItemMaps } from 'src/engine/metadata-modules/flat-navigation-menu-item/types/flat-navigation-menu-item-maps.type';
import { addFlatNavigationMenuItemToMapsAndUpdateIndex } from 'src/engine/metadata-modules/flat-navigation-menu-item/utils/add-flat-navigation-menu-item-to-maps-and-update-index.util';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { STANDARD_NAVIGATION_MENU_ITEMS } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-navigation-menu-item.constant';
import { NavigationMenuItemType } from 'src/engine/metadata-modules/navigation-menu-item/enums/navigation-menu-item-type.enum';
import { createStandardNavigationMenuItemFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/navigation-menu-item/create-standard-navigation-menu-item-flat-metadata.util';
import {
  createStandardNavigationMenuItemFolderFlatMetadata,
  createStandardNavigationMenuItemFolderItemFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/navigation-menu-item/create-standard-navigation-menu-item-folder-flat-metadata.util';

type NavigationMenuItemName = keyof typeof STANDARD_NAVIGATION_MENU_ITEMS;
type NavigationMenuItemDefinition =
  (typeof STANDARD_NAVIGATION_MENU_ITEMS)[NavigationMenuItemName];

// All OBJECT-type items that should be included (excluding folders and folder items)
const ALL_OBJECT_NAVIGATION_MENU_ITEM_NAMES: NavigationMenuItemName[] = [
  'allTasks',
  'allCompanies',
  'allPeople',
  'allOpportunities',
  'allRequirements',
  'allCandidates',
  'allCandidateSubmissions',
  'allInterviews',
  'allEmployees',
  'allDepartments',
  'allTeams',
  'allDesignations',
  'allOnboardingItems',
  'allAttendanceDays',
  'allLeaveRequests',
  'allRosterAssignments',
  'allShifts',
  'allSalaryStructures',
  'allPayrollPeriods',
  'allPayslips',
  'allPayrollAdjustments',
  'allNotes',
  'allInvoices',
  'allPayments',
  'allDashboards',
];

// All FOLDER-type items (top-level folders)
const ALL_FOLDER_NAVIGATION_MENU_ITEM_NAMES: NavigationMenuItemName[] = [
  'myWorkFolder',
  'crmFolder',
  'recruitmentFolder',
  'teamFolder',
  'hrFolder',
  'payrollFolder',
  'documentsFolder',
  'financeFolder',
  'analyticsFolder',
  'adminFolder',
];

// Items inside the Workflows sub-folder (inside Admin folder)
const WORKFLOWS_FOLDER_CHILD_NAMES: NavigationMenuItemName[] = [
  'workflowsFolderAllWorkflows',
  'workflowsFolderAllWorkflowRuns',
  'workflowsFolderAllWorkflowVersions',
];

const isFolderItem = (
  item: NavigationMenuItemDefinition,
): item is Extract<
  NavigationMenuItemDefinition,
  { type: NavigationMenuItemType.OBJECT; folderUniversalIdentifier: string }
> =>
  item.type === NavigationMenuItemType.OBJECT &&
  'folderUniversalIdentifier' in item &&
  typeof item.folderUniversalIdentifier === 'string';

export const buildStandardFlatNavigationMenuItemMaps = ({
  now,
  workspaceId,
  twentyStandardApplicationId,
  dependencyFlatEntityMaps: { flatViewMaps },
}: {
  now: string;
  workspaceId: string;
  twentyStandardApplicationId: string;
  dependencyFlatEntityMaps: {
    flatViewMaps: FlatEntityMaps<FlatView>;
  };
}): FlatNavigationMenuItemMaps => {
  const flatNavigationMenuItemMaps: FlatNavigationMenuItemMaps = {
    ...createEmptyFlatEntityMaps(),
    byUserWorkspaceIdAndFolderId: {},
  };

  // First, create all top-level folders
  const folderIdMap = new Map<string, string>();
  for (const folderName of ALL_FOLDER_NAVIGATION_MENU_ITEM_NAMES) {
    const folderDefinition = STANDARD_NAVIGATION_MENU_ITEMS[folderName];
    const folderId = v4();
    folderIdMap.set(folderDefinition.universalIdentifier, folderId);

    if (folderDefinition.type !== NavigationMenuItemType.FOLDER) {
      throw new Error(
        `Expected ${folderName} to be a FOLDER, got ${folderDefinition.type}`,
      );
    }

    const folder = createStandardNavigationMenuItemFolderFlatMetadata({
      universalIdentifier: folderDefinition.universalIdentifier,
      name: folderDefinition.name,
      icon: folderDefinition.icon,
      position: folderDefinition.position,
      navigationMenuItemId: folderId,
      workspaceId,
      twentyStandardApplicationId,
      now,
    });

    addFlatNavigationMenuItemToMapsAndUpdateIndex({
      flatNavigationMenuItem: folder,
      flatNavigationMenuItemMaps,
    });
  }

  // Create all top-level OBJECT items (placed under their respective folders)
  for (const itemName of ALL_OBJECT_NAVIGATION_MENU_ITEM_NAMES) {
    const itemDefinition = STANDARD_NAVIGATION_MENU_ITEMS[itemName];

    if (itemDefinition.type !== NavigationMenuItemType.OBJECT) {
      throw new Error(
        `Expected ${itemName} to be an OBJECT, got ${itemDefinition.type}`,
      );
    }

    // Check if this item has a folder placement
    if (isFolderItem(itemDefinition)) {
      const folderId = folderIdMap.get(
        itemDefinition.folderUniversalIdentifier,
      );
      if (folderId) {
        const folderItem =
          createStandardNavigationMenuItemFolderItemFlatMetadata({
            universalIdentifier: itemDefinition.universalIdentifier,
            viewUniversalIdentifier: itemDefinition.viewUniversalIdentifier,
            folderId,
            folderUniversalIdentifier: itemDefinition.folderUniversalIdentifier,
            position: itemDefinition.position,
            navigationMenuItemId: v4(),
            workspaceId,
            twentyStandardApplicationId,
            dependencyFlatEntityMaps: {
              flatViewMaps,
            },
            now,
          });

        addFlatNavigationMenuItemToMapsAndUpdateIndex({
          flatNavigationMenuItem: folderItem,
          flatNavigationMenuItemMaps,
        });
        continue;
      }
    }

    // Fallback: create as top-level item (no folder)
    const flatNavigationMenuItem = createStandardNavigationMenuItemFlatMetadata(
      {
        workspaceId,
        navigationMenuItemName: itemName,
        viewUniversalIdentifier: itemDefinition.viewUniversalIdentifier,
        position: itemDefinition.position,
        navigationMenuItemId: v4(),
        dependencyFlatEntityMaps: {
          flatViewMaps,
        },
        twentyStandardApplicationId,
        now,
      },
    );

    addFlatNavigationMenuItemToMapsAndUpdateIndex({
      flatNavigationMenuItem,
      flatNavigationMenuItemMaps,
    });
  }

  // Create Workflows sub-folder (inside Admin folder)
  const workflowsFolderDefinition =
    STANDARD_NAVIGATION_MENU_ITEMS.workflowsFolder;
  const workflowsFolderId = v4();

  // Get the Admin folder's universal identifier from the definition
  const adminFolderUniversalIdentifier =
    'folderUniversalIdentifier' in workflowsFolderDefinition
      ? workflowsFolderDefinition.folderUniversalIdentifier
      : null;

  // Get the Admin folder's ID from our map
  const adminFolderId = adminFolderUniversalIdentifier
    ? folderIdMap.get(adminFolderUniversalIdentifier)
    : null;

  const workflowsFolder = createStandardNavigationMenuItemFolderFlatMetadata({
    universalIdentifier: workflowsFolderDefinition.universalIdentifier,
    name: workflowsFolderDefinition.name,
    icon: workflowsFolderDefinition.icon,
    position: workflowsFolderDefinition.position,
    navigationMenuItemId: workflowsFolderId,
    workspaceId,
    twentyStandardApplicationId,
    now,
    folderId: adminFolderId,
    folderUniversalIdentifier: adminFolderUniversalIdentifier,
  });

  addFlatNavigationMenuItemToMapsAndUpdateIndex({
    flatNavigationMenuItem: workflowsFolder,
    flatNavigationMenuItemMaps,
  });

  // Create items inside the Workflows sub-folder
  for (const folderItemName of WORKFLOWS_FOLDER_CHILD_NAMES) {
    const folderItemDefinition = STANDARD_NAVIGATION_MENU_ITEMS[folderItemName];

    if (!isFolderItem(folderItemDefinition)) {
      throw new Error(
        `Expected ${folderItemName} to be a folder item with folderUniversalIdentifier`,
      );
    }

    const folderItem = createStandardNavigationMenuItemFolderItemFlatMetadata({
      universalIdentifier: folderItemDefinition.universalIdentifier,
      viewUniversalIdentifier: folderItemDefinition.viewUniversalIdentifier,
      folderId: workflowsFolderId,
      folderUniversalIdentifier: folderItemDefinition.folderUniversalIdentifier,
      position: folderItemDefinition.position,
      navigationMenuItemId: v4(),
      workspaceId,
      twentyStandardApplicationId,
      dependencyFlatEntityMaps: {
        flatViewMaps,
      },
      now,
    });

    addFlatNavigationMenuItemToMapsAndUpdateIndex({
      flatNavigationMenuItem: folderItem,
      flatNavigationMenuItemMaps,
    });
  }

  return flatNavigationMenuItemMaps;
};
