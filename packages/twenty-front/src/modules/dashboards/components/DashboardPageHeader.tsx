import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { SidePanelToggleButton } from '@/side-panel/components/SidePanelToggleButton';
import { useWorkspaceSurface } from '@/ui/layout/hooks/useWorkspaceSurface';
import { OptionsDropdownMenu } from '@/ui/layout/dropdown/components/OptionsDropdownMenu';
import { Button } from 'twenty-ui/input';
import {
  IconChartBar,
  IconCopy,
  IconPencil,
  IconPlus,
  IconTrash,
} from 'twenty-ui/icon';
import { MenuItem } from 'twenty-ui/navigation';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type DashboardPageHeaderProps = {
  isEditMode: boolean;
  canDelete: boolean;
  onOpenCreateDialog: () => void;
  onEnterEditMode: () => void;
  onAddWidget: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

const StyledActionButtons = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledIconWrapper = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
`;

export const DashboardPageHeader = ({
  isEditMode,
  canDelete,
  onOpenCreateDialog,
  onEnterEditMode,
  onAddWidget,
  onCancelEdit,
  onSaveEdit,
  onDuplicate,
  onDelete,
}: DashboardPageHeaderProps) => {
  const { t } = useLingui();
  const workspaceSurface = useWorkspaceSurface();

  const actionButton = isEditMode ? (
    <StyledActionButtons>
      <Button
        variant="secondary"
        Icon={IconPlus}
        title={t`Add Widget`}
        onClick={onAddWidget}
      />
      <Button
        variant="secondary"
        title={t`Cancel`}
        onClick={onCancelEdit}
      />
      <Button
        variant="primary"
        title={t`Save`}
        onClick={onSaveEdit}
      />
    </StyledActionButtons>
  ) : (
    <StyledActionButtons>
      <Button
        variant="primary"
        Icon={IconPlus}
        title={t`New Dashboard`}
        onClick={onOpenCreateDialog}
      />
      {workspaceSurface.type === 'main' && <SidePanelToggleButton />}
    </StyledActionButtons>
  );

  return (
    <PageCardHeader
      icon={
        <StyledIconWrapper>
          <IconChartBar size={themeCssVariables.icon.size.md} />
        </StyledIconWrapper>
      }
      title={t`Dashboard`}
      actionButton={actionButton}
    />
  );
};
