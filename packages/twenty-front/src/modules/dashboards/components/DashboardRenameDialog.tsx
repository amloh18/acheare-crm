import { useState } from 'react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { Button } from 'twenty-ui/input';
import { TextInput } from '@/ui/input/components/TextInput';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

type DashboardRenameDialogProps = {
  isOpen: boolean;
  dashboardId: string;
  initialTitle: string;
  onClose: () => void;
  onRenamed: (newTitle: string) => void;
};

const StyledOverlay = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.overlayPrimary};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const StyledDialog = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  max-width: 400px;
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const DashboardRenameDialog = ({
  isOpen,
  dashboardId,
  initialTitle,
  onClose,
  onRenamed,
}: DashboardRenameDialogProps) => {
  const { t } = useLingui();
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const { updateOneRecord } = useUpdateOneRecord();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle === initialTitle) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      await updateOneRecord({
        objectNameSingular: CoreObjectNameSingular.Dashboard,
        idToUpdate: dashboardId,
        updateOneRecordInput: {
          title: trimmedTitle,
        },
      });

      enqueueSuccessSnackBar({
        message: t`Dashboard renamed to "${trimmedTitle}"`,
      });
      onRenamed(trimmedTitle);
      onClose();
    } catch (err) {
      enqueueErrorSnackBar({
        message: t`Failed to rename dashboard`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledDialog
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <StyledTitle>{t`Rename Dashboard View`}</StyledTitle>
        <TextInput
          autoFocus
          fullWidth
          value={title}
          onChange={setTitle}
          placeholder={t`Dashboard name`}
        />
        <StyledButtonsContainer>
          <Button
            variant="secondary"
            title={t`Cancel`}
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            variant="primary"
            title={t`Save`}
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          />
        </StyledButtonsContainer>
      </StyledDialog>
    </StyledOverlay>
  );
};
