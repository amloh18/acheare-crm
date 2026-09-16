import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { TopBar } from '@/ui/layout/top-bar/components/TopBar';
import { OptionsDropdownMenu } from '@/ui/layout/dropdown/components/OptionsDropdownMenu';
import { MenuItem } from 'twenty-ui/navigation';
import {
  IconPencil,
  IconPlus,
  IconCopy,
  IconTrash,
} from 'twenty-ui/icon';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import {
  DashboardViewTab,
  type DashboardViewItem,
} from '@/dashboards/components/DashboardViewTab';

type DashboardViewBarProps = {
  dashboards: DashboardViewItem[];
  activeDashboardId: string;
  isEditMode: boolean;
  canDelete: boolean;
  onSelectDashboard: (dashboardId: string) => void;
  onOpenCreateDialog: () => void;
  onOpenRenameDialog: (dashboard: DashboardViewItem) => void;
  onDuplicated: (newDashboardId: string) => void;
  onDeleted: () => void;
  onEnterEditMode: () => void;
  onAddWidget: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

const StyledTabsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: ${themeCssVariables.spacing[1]};
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
`;

const StyledTabsScrollContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledAddButton = styled.div`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
  transition:
    background 0.1s ease,
    color 0.1s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.light};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledRightActions = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledEditBadge = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.transparent.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
  padding: 2px ${themeCssVariables.spacing[2]};
`;

const StyledDot = styled.span`
  background: ${themeCssVariables.color.blue};
  border-radius: 50%;
  display: inline-block;
  height: 6px;
  width: 6px;
`;

export const DashboardViewBar = ({
  dashboards,
  activeDashboardId,
  isEditMode,
  canDelete,
  onSelectDashboard,
  onOpenCreateDialog,
  onOpenRenameDialog,
  onDuplicated,
  onDeleted,
  onEnterEditMode,
  onAddWidget,
  onDuplicate,
  onDelete,
}: DashboardViewBarProps) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();

  return (
    <TopBar
      leftComponent={
        <StyledTabsWrapper>
          <StyledTabsScrollContainer>
            {dashboards.map((dash) => (
              <DashboardViewTab
                key={dash.id}
                dashboard={dash}
                isActive={dash.id === activeDashboardId}
                canDelete={dashboards.length > 1}
                onSelect={() => onSelectDashboard(dash.id)}
                onOpenRename={() => onOpenRenameDialog(dash)}
                onDuplicated={onDuplicated}
                onDeleted={onDeleted}
              />
            ))}
          </StyledTabsScrollContainer>
          <StyledAddButton
            onClick={onOpenCreateDialog}
            title={t`Add dashboard view`}
            aria-label={t`Add dashboard view`}
          >
            <IconPlus size={theme.icon.size.md} />
          </StyledAddButton>
        </StyledTabsWrapper>
      }
      rightComponent={
        <StyledRightActions>
          {isEditMode ? (
            <StyledEditBadge>
              <StyledDot />
              {t`Editing Layout`}
            </StyledEditBadge>
          ) : (
            <OptionsDropdownMenu dropdownPlacement="bottom-end">
              <MenuItem
                LeftIcon={IconPencil}
                text={t`Edit layout`}
                onClick={onEnterEditMode}
              />
              <MenuItem
                LeftIcon={IconPlus}
                text={t`Add widget`}
                onClick={onAddWidget}
              />
              <MenuItem
                LeftIcon={IconCopy}
                text={t`Duplicate dashboard`}
                onClick={onDuplicate}
              />
              {canDelete && (
                <MenuItem
                  LeftIcon={IconTrash}
                  text={t`Delete dashboard`}
                  accent="danger"
                  onClick={onDelete}
                />
              )}
            </OptionsDropdownMenu>
          )}
        </StyledRightActions>
      }
    />
  );
};
