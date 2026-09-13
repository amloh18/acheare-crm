import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useCreateManyNavigationMenuItems } from '@/navigation-menu-item/common/hooks/useCreateManyNavigationMenuItems';
import { useDeleteManyNavigationMenuItems } from '@/navigation-menu-item/common/hooks/useDeleteManyNavigationMenuItems';
import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { useSetViewTypeFromLayoutOptionsMenu } from '@/object-record/object-options-dropdown/hooks/useSetViewTypeFromLayoutOptionsMenu';
import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useOpenDropdown } from '@/ui/layout/dropdown/hooks/useOpenDropdown';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { usePerformViewApiUpdate } from '@/views/hooks/internal/usePerformViewApiUpdate';
import { useChangeView } from '@/views/hooks/useChangeView';
import {
  getViewTypeLabel,
  ViewType,
  viewTypeIconKeyMapping,
  viewTypeIconMapping,
} from '@/views/types/ViewType';
import { type View } from '@/views/types/View';
import { VIEW_PICKER_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerDropdownId';
import { useDestroyViewFromCurrentState } from '@/views/view-picker/hooks/useDestroyViewFromCurrentState';
import { useGetAvailableFieldsForCalendar } from '@/views/view-picker/hooks/useGetAvailableFieldsForCalendar';
import { useGetAvailableFieldsToGroupRecordsBy } from '@/views/view-picker/hooks/useGetAvailableFieldsToGroupRecordsBy';
import { useViewPickerMode } from '@/views/view-picker/hooks/useViewPickerMode';
import { viewPickerReferenceViewIdComponentState } from '@/views/view-picker/states/viewPickerReferenceViewIdComponentState';

import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import {
  IconChevronDown,
  IconChevronLeft,
  IconHeart,
  IconHeartOff,
  IconPencil,
  IconTable,
  IconTrash,
  useIcons,
} from 'twenty-ui/icon';
import { MenuItem, MenuItemSelect } from 'twenty-ui/navigation';
import { OverflowingTextWithTooltip } from 'twenty-ui/surfaces';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import {
  PermissionFlagType,
  ViewVisibility,
} from '~/generated-metadata/graphql';

const StyledTabContainer = styled.div<{ isActive: boolean }>`
  align-items: center;
  background: ${({ isActive }) =>
    isActive
      ? themeCssVariables.background.transparent.light
      : 'transparent'};
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? themeCssVariables.border.color.light
        : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.md};
  box-sizing: border-box;
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  gap: ${themeCssVariables.spacing[1]};
  height: 28px;
  padding: 0 ${themeCssVariables.spacing[2]};
  position: relative;
  user-select: none;
  white-space: nowrap;
  transition:
    background 0.1s ease,
    color 0.1s ease,
    border-color 0.1s ease;

  &:hover {
    background: ${({ isActive }) =>
      isActive
        ? themeCssVariables.background.transparent.medium
        : themeCssVariables.background.transparent.light};
    color: ${themeCssVariables.font.color.primary};

    .tab-options-trigger {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const StyledIconContainer = styled.span`
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

const StyledViewName = styled.span`
  max-width: 140px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledCount = styled.span`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.xs};
  margin-left: 2px;
`;

const StyledOptionsButton = styled.div<{ isActive: boolean }>`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  height: 18px;
  justify-content: center;
  margin-left: 2px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  visibility: ${({ isActive }) => (isActive ? 'visible' : 'hidden')};
  width: 18px;
  transition:
    opacity 0.1s ease,
    background 0.1s ease,
    color 0.1s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

type ViewPickerTabItemProps = {
  view: Pick<
    View,
    'id' | 'name' | 'icon' | 'visibility' | 'key' | 'type' | 'createdByUserWorkspaceId'
  >;
  isCurrentView: boolean;
  totalCount?: number;
  formatNumber: (n: number) => string;
  isLastView: boolean;
};

export const ViewPickerTabItem = ({
  view,
  isCurrentView,
  totalCount,
  formatNumber,
  isLastView,
}: ViewPickerTabItemProps) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const { changeView } = useChangeView();
  const { closeDropdown } = useCloseDropdown();
  const { openDropdown } = useOpenDropdown();
  const { setViewPickerMode } = useViewPickerMode();
  const setViewPickerReferenceViewId = useSetAtomComponentState(
    viewPickerReferenceViewIdComponentState,
  );
  const { destroyViewFromCurrentState } = useDestroyViewFromCurrentState();
  const hasViewsPermission = useHasPermissionFlag(PermissionFlagType.VIEWS);
  const { createManyNavigationMenuItems } = useCreateManyNavigationMenuItems();
  const { deleteManyNavigationMenuItems } = useDeleteManyNavigationMenuItems();
  const { navigationMenuItems, currentUserWorkspaceId } =
    useNavigationMenuItemsData();

  const { availableFieldsForGrouping } =
    useGetAvailableFieldsToGroupRecordsBy();
  const { availableFieldsForCalendar } = useGetAvailableFieldsForCalendar();
  const { setAndPersistViewType } = useSetViewTypeFromLayoutOptionsMenu();
  const { performViewApiUpdate } = usePerformViewApiUpdate();

  const [viewMode, setViewMode] = useState<'main' | 'change-type'>('main');

  const isIndexView = view.key === 'INDEX';
  const canEditView =
    hasViewsPermission || view.visibility === ViewVisibility.UNLISTED;

  const currentNavigationMenuItem = navigationMenuItems.find(
    (item) =>
      item.viewId === view.id &&
      item.userWorkspaceId === currentUserWorkspaceId,
  );
  const isFavorite = isDefined(currentNavigationMenuItem);

  const dropdownId = `view-tab-options-${view.id}`;

  const ViewIcon =
    getIcon(view.icon) ?? viewTypeIconMapping(view.type) ?? IconTable;

  const handleTabClick = () => {
    if (!isCurrentView) {
      changeView(view.id);
    }
  };

  const handleToggleFavorite = () => {
    if (!isFavorite) {
      const relevantItems = navigationMenuItems.filter(
        (item) => !isDefined(item.folderId) && isDefined(item.userWorkspaceId),
      );

      const maxPosition = Math.max(
        ...relevantItems.map((item) => item.position),
        0,
      );

      createManyNavigationMenuItems([
        {
          id: uuidv4(),
          type: NavigationMenuItemType.VIEW,
          viewId: view.id,
          userWorkspaceId: currentUserWorkspaceId,
          position: maxPosition + 1,
        },
      ]);
    } else if (currentNavigationMenuItem) {
      deleteManyNavigationMenuItems([currentNavigationMenuItem.id]);
    }
    closeDropdown(dropdownId);
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    closeDropdown(dropdownId);
    setViewPickerReferenceViewId(view.id);
    setViewPickerMode('edit');
    openDropdown({
      dropdownComponentInstanceIdFromProps: VIEW_PICKER_DROPDOWN_ID,
    });
  };

  const handleDelete = () => {
    closeDropdown(dropdownId);
    setViewPickerReferenceViewId(view.id);
    destroyViewFromCurrentState();
  };

  const handleSelectViewType = async (newType: ViewType) => {
    if (view.type === newType) {
      closeDropdown(dropdownId);
      setViewMode('main');
      return;
    }
    if (newType === ViewType.KANBAN && availableFieldsForGrouping.length === 0) {
      return;
    }
    if (newType === ViewType.CALENDAR && availableFieldsForCalendar.length === 0) {
      return;
    }

    try {
      if (isCurrentView) {
        await setAndPersistViewType(newType);
      } else {
        await performViewApiUpdate({
          id: view.id,
          input: {
            type: newType,
            icon: viewTypeIconKeyMapping(newType),
          },
        });
        changeView(view.id);
      }
    } catch {
      await performViewApiUpdate({
        id: view.id,
        input: {
          type: newType,
          icon: viewTypeIconKeyMapping(newType),
        },
      });
    }
    closeDropdown(dropdownId);
    setViewMode('main');
  };

  return (
    <StyledTabContainer isActive={isCurrentView} onClick={handleTabClick}>
      <StyledIconContainer>
        <ViewIcon size={theme.icon.size.md} />
      </StyledIconContainer>
      <StyledViewName>
        <OverflowingTextWithTooltip text={view.name || t`All`} />
      </StyledViewName>
      {isCurrentView && isDefined(totalCount) && (
        <StyledCount>· {formatNumber(totalCount)}</StyledCount>
      )}
      <Dropdown
        dropdownId={dropdownId}
        dropdownPlacement="bottom-start"
        dropdownOffset={{ x: 0, y: 4 }}
        onClose={() => setViewMode('main')}
        clickableComponent={
          <StyledOptionsButton
            className="tab-options-trigger"
            isActive={isCurrentView}
            onClick={(e) => {
              e.stopPropagation();
            }}
            title={t`View options`}
          >
            <IconChevronDown size={theme.icon.size.sm} />
          </StyledOptionsButton>
        }
        dropdownComponents={
          viewMode === 'main' ? (
            <DropdownContent>
              <DropdownMenuItemsContainer>
                <MenuItem
                  LeftIcon={isFavorite ? IconHeartOff : IconHeart}
                  text={isFavorite ? t`Remove Favorite` : t`Add to Favorite`}
                  onClick={handleToggleFavorite}
                />
                <MenuItem
                  LeftIcon={viewTypeIconMapping(view.type)}
                  text={t`Change type`}
                  hasSubMenu
                  onClick={() => setViewMode('change-type')}
                />
                {!isIndexView && canEditView && (
                  <>
                    <MenuItem
                      LeftIcon={IconPencil}
                      text={t`Edit view`}
                      onClick={handleEdit}
                    />
                    {!isLastView && (
                      <MenuItem
                        LeftIcon={IconTrash}
                        text={t`Delete view`}
                        onClick={handleDelete}
                        accent="danger"
                      />
                    )}
                  </>
                )}
              </DropdownMenuItemsContainer>
            </DropdownContent>
          ) : (
            <DropdownContent>
              <DropdownMenuHeader
                StartComponent={
                  <DropdownMenuHeaderLeftComponent
                    onClick={() => setViewMode('main')}
                    Icon={IconChevronLeft}
                  />
                }
              >
                {t`Change view type`}
              </DropdownMenuHeader>
              <DropdownMenuItemsContainer scrollable={false}>
                <MenuItemSelect
                  LeftIcon={viewTypeIconMapping(ViewType.TABLE)}
                  text={t(getViewTypeLabel(ViewType.TABLE))}
                  selected={view.type === ViewType.TABLE}
                  onClick={() => handleSelectViewType(ViewType.TABLE)}
                />
                <MenuItemSelect
                  LeftIcon={viewTypeIconMapping(ViewType.KANBAN)}
                  text={t(getViewTypeLabel(ViewType.KANBAN))}
                  selected={view.type === ViewType.KANBAN}
                  disabled={availableFieldsForGrouping.length === 0}
                  contextualText={
                    availableFieldsForGrouping.length === 0
                      ? t`No Select field`
                      : undefined
                  }
                  onClick={() => handleSelectViewType(ViewType.KANBAN)}
                />
                <MenuItemSelect
                  LeftIcon={viewTypeIconMapping(ViewType.CALENDAR)}
                  text={t(getViewTypeLabel(ViewType.CALENDAR))}
                  selected={view.type === ViewType.CALENDAR}
                  disabled={availableFieldsForCalendar.length === 0}
                  contextualText={
                    availableFieldsForCalendar.length === 0
                      ? t`No Date field`
                      : undefined
                  }
                  onClick={() => handleSelectViewType(ViewType.CALENDAR)}
                />
                <MenuItemSelect
                  LeftIcon={viewTypeIconMapping(ViewType.LIST)}
                  text={t(getViewTypeLabel(ViewType.LIST))}
                  selected={view.type === ViewType.LIST}
                  onClick={() => handleSelectViewType(ViewType.LIST)}
                />
              </DropdownMenuItemsContainer>
            </DropdownContent>
          )
        }
      />
    </StyledTabContainer>
  );
};
