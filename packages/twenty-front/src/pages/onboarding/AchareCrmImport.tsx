import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareCrmImportMutation } from '@/onboarding/hooks/useCompleteAchareCrmImportMutation';
import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { IconDatabase, IconFileImport } from 'twenty-ui/icon';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledOptionCard = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[5]};
  text-align: left;
  transition: all 0.15s ease;
  width: 100%;

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

const StyledOptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  flex: 1;
`;

const StyledOptionTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledOptionDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
`;

export const AchareCrmImport = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeCrmImport] = useCompleteAchareCrmImportMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const { openObjectRecordsSpreadsheetImportDialog: openCompanyImport } =
    useOpenObjectRecordsSpreadsheetImportDialog('company');

  const { openObjectRecordsSpreadsheetImportDialog: openPersonImport } =
    useOpenObjectRecordsSpreadsheetImportDialog('person');

  const handleStartFresh = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeCrmImport({
        variables: { input: { skipImport: true } },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch {
      setIsNavigating(false);
    }
  }, [completeCrmImport, setNextOnboardingStatus]);

  const handleImportCompanies = useCallback(() => {
    openCompanyImport({
      onSubmit: async () => {
        // The import dialog creates the records; advancing the wizard here
        // only works because the caller's onSubmit is invoked after the
        // records are created (see useOpenObjectRecordsSpreadsheetImportDialog).
        await completeCrmImport({
          variables: { input: { hasData: true } },
        });
        setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
      },
    } as never);
  }, [openCompanyImport, completeCrmImport, setNextOnboardingStatus]);

  const handleImportPeople = useCallback(() => {
    openPersonImport({
      onSubmit: async () => {
        await completeCrmImport({
          variables: { input: { hasData: true } },
        });
        setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
      },
    } as never);
  }, [openPersonImport, completeCrmImport, setNextOnboardingStatus]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`CRM Data Import`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Do you already have client/company data?`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          <StyledOptionCard onClick={handleStartFresh} disabled={isNavigating}>
            <StyledIconContainer>
              <IconDatabase size={20} color={themeCssVariables.color.blue} />
            </StyledIconContainer>
            <StyledOptionContent>
              <StyledOptionTitle>{t`Start Fresh`}</StyledOptionTitle>
              <StyledOptionDescription>
                {t`I'll add companies and contacts as I go.`}
              </StyledOptionDescription>
            </StyledOptionContent>
          </StyledOptionCard>

          <StyledOptionCard onClick={handleImportCompanies} disabled={isNavigating}>
            <StyledIconContainer>
              <IconFileImport
                size={20}
                color={themeCssVariables.color.blue}
              />
            </StyledIconContainer>
            <StyledOptionContent>
              <StyledOptionTitle>{t`Import Companies`}</StyledOptionTitle>
              <StyledOptionDescription>
                {t`Upload a CSV with your existing companies.`}
              </StyledOptionDescription>
            </StyledOptionContent>
          </StyledOptionCard>

          <StyledOptionCard onClick={handleImportPeople} disabled={isNavigating}>
            <StyledIconContainer>
              <IconFileImport
                size={20}
                color={themeCssVariables.color.blue}
              />
            </StyledIconContainer>
            <StyledOptionContent>
              <StyledOptionTitle>{t`Import Contacts`}</StyledOptionTitle>
              <StyledOptionDescription>
                {t`Upload a CSV with your existing contacts.`}
              </StyledOptionDescription>
            </StyledOptionContent>
          </StyledOptionCard>
        </StyledContent>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledButtonRow>
          <MainButton
            title={t`Skip for now`}
            onClick={handleStartFresh}
            disabled={isNavigating}
            fullWidth
            variant="secondary"
          />
        </StyledButtonRow>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
