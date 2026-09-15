import { useState } from 'react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { Button } from 'twenty-ui/input';
import { TextInput } from '@/ui/input/components/TextInput';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

type DashboardCreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newDashboard: { id: string; title?: string }) => void;
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

const StyledSubtitle = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const DashboardCreateDialog = ({
  isOpen,
  onClose,
  onCreated,
}: DashboardCreateDialogProps) => {
  const { t } = useLingui();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const { createOneRecord } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmedTitle = name.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createOneRecord({
        title: trimmedTitle,
      });

      if (result) {
        enqueueSuccessSnackBar({
          message: t`Dashboard view "${trimmedTitle}" created`,
        });
        setName('');
        onClose();
        onCreated({ id: result.id, title: trimmedTitle });
      }
    } catch (err) {
      enqueueErrorSnackBar({
        message: t`Failed to create dashboard view`,
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
        <div>
          <StyledTitle>{t`New Dashboard View`}</StyledTitle>
          <StyledSubtitle>
            {t`Create a new dashboard tab to place and organize widgets.`}
          </StyledSubtitle>
        </div>
        <TextInput
          autoFocus
          fullWidth
          value={name}
          onChange={setName}
          placeholder={t`e.g. Sales Metrics, Operations, Team Overview`}
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
            title={t`Create`}
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
          />
        </StyledButtonsContainer>
      </StyledDialog>
    </StyledOverlay>
  );
};
