import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useDestroyOneRecord } from '@/object-record/hooks/useDestroyOneRecord';
import { useDuplicateDashboard } from '@/dashboards/hooks/useDuplicateDashboard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import {
  IconChartBar,
  IconChevronDown,
  IconCopy,
  IconPencil,
  IconTrash,
  IconUser,
} from 'twenty-ui/icon';
import { MenuItem } from 'twenty-ui/navigation';
import { OverflowingTextWithTooltip } from 'twenty-ui/surfaces';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import { BUILTIN_EMPLOYEE_DASHBOARD_ID, BUILTIN_ADMIN_DASHBOARD_ID } from '~/pages/dashboard/DashboardPage';

export type DashboardViewItem = {
  id: string;
  title: string;
  pageLayoutId?: string;
};

type DashboardViewTabProps = {
  dashboard: DashboardViewItem;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onOpenRename: () => void;
  onDuplicated: (newDashboardId: string) => void;
  onDeleted: () => void;
};

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
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledOptionsButton = styled.div<{ isActive: boolean }>`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.secondary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  height: 18px;
  justify-content: center;
  margin-left: ${themeCssVariables.spacing['0.5']};
  width: 18px;
  transition:
    background 0.1s ease,
    color 0.1s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

export const DashboardViewTab = ({
  dashboard,
  isActive,
  canDelete,
  onSelect,
  onOpenRename,
  onDuplicated,
  onDeleted,
}: DashboardViewTabProps) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  const dropdownId = `dashboard-tab-dropdown-${dashboard.id}`;
  const { closeDropdown } = useCloseDropdown();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const isBuiltin =
    dashboard.id === BUILTIN_EMPLOYEE_DASHBOARD_ID ||
    dashboard.id === BUILTIN_ADMIN_DASHBOARD_ID;

  const { duplicateDashboard } = useDuplicateDashboard();
  const { destroyOneRecord } = useDestroyOneRecord({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
  });

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown(dropdownId);
    try {
      const duplicated = await duplicateDashboard(dashboard.id);
      if (duplicated) {
        enqueueSuccessSnackBar({ message: t`Dashboard duplicated` });
        onDuplicated(duplicated.id);
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to duplicate dashboard` });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown(dropdownId);
    try {
      await destroyOneRecord(dashboard.id);
      enqueueSuccessSnackBar({ message: t`Dashboard deleted` });
      onDeleted();
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to delete dashboard` });
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown(dropdownId);
    onOpenRename();
  };

  const TabIcon =
    dashboard.id === BUILTIN_ADMIN_DASHBOARD_ID
      ? IconUser
      : isBuiltin
        ? IconUser
        : IconChartBar;

  return (
    <StyledTabContainer isActive={isActive} onClick={onSelect}>
      <StyledIconContainer>
        <TabIcon size={theme.icon.size.md} />
      </StyledIconContainer>
      <StyledViewName>
        <OverflowingTextWithTooltip text={dashboard.title || t`Dashboard`} />
      </StyledViewName>
      {isActive && !isBuiltin && (
        <Dropdown
          dropdownId={dropdownId}
          dropdownPlacement="bottom-start"
          dropdownOffset={{ x: 0, y: 4 }}
          clickableComponent={
            <StyledOptionsButton
              className="tab-options-trigger"
              isActive={isActive}
              onClick={(e) => {
                e.stopPropagation();
              }}
              title={t`Dashboard options`}
            >
              <IconChevronDown size={theme.icon.size.sm} />
            </StyledOptionsButton>
          }
          dropdownComponents={
            <DropdownContent>
              <DropdownMenuItemsContainer>
                <MenuItem
                  LeftIcon={IconPencil}
                  text={t`Rename view`}
                  onClick={handleRename}
                />
                <MenuItem
                  LeftIcon={IconCopy}
                  text={t`Duplicate view`}
                  onClick={handleDuplicate}
                />
                {canDelete && (
                  <MenuItem
                    LeftIcon={IconTrash}
                    text={t`Delete view`}
                    onClick={handleDelete}
                    accent="danger"
                  />
                )}
              </DropdownMenuItemsContainer>
            </DropdownContent>
          }
        />
      )}
    </StyledTabContainer>
  );
};
