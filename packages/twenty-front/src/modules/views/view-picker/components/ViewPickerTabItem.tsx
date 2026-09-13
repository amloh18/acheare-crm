import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useCreateManyNavigationMenuItems } from '@/navigation-menu-item/common/hooks/useCreateManyNavigationMenuItems';
import { useDeleteManyNavigationMenuItems } from '@/navigation-menu-item/common/hooks/useDeleteManyNavigationMenuItems';
import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useOpenDropdown } from '@/ui/layout/dropdown/hooks/useOpenDropdown';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useChangeView } from '@/views/hooks/useChangeView';
import { type View } from '@/views/types/View';
import { VIEW_PICKER_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerDropdownId';
import { useDestroyViewFromCurrentState } from '@/views/view-picker/hooks/useDestroyViewFromCurrentState';
import { useViewPickerMode } from '@/views/view-picker/hooks/useViewPickerMode';
import { viewPickerReferenceViewIdComponentState } from '@/views/view-picker/states/viewPickerReferenceViewIdComponentState';

import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import {
  IconChevronDown,
  IconHeart,
  IconHeartOff,
  IconPencil,
  IconTable,
  IconTrash,
  useIcons,
} from 'twenty-ui/icon';
import { MenuItem } from 'twenty-ui/navigation';
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
    'id' | 'name' | 'icon' | 'visibility' | 'key' | 'createdByUserWorkspaceId'
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

  const ViewIcon = getIcon(view.icon) ?? IconTable;

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
          <DropdownContent>
            <DropdownMenuItemsContainer>
              <MenuItem
                LeftIcon={isFavorite ? IconHeartOff : IconHeart}
                text={isFavorite ? t`Remove Favorite` : t`Add to Favorite`}
                onClick={handleToggleFavorite}
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
        }
      />
    </StyledTabContainer>
  );
};
