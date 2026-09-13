import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSetAchareSetupModeMutation } from '@/onboarding/hooks/useSetAchareSetupModeMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { MainButton } from 'twenty-ui/input';
import { IconBolt, IconTool } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledChoiceCard = styled.button<{ isSelected?: boolean }>`
  align-items: center;
  background: ${(props) =>
    props.isSelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.medium};
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
    background: ${themeCssVariables.background.transparent.blue};
  }
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  height: 48px;
  justify-content: center;
  width: 48px;
`;

const StyledChoiceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  flex: 1;
`;

const StyledChoiceTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledChoiceDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledFooter = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  text-align: center;
  margin-top: ${themeCssVariables.spacing[4]};
`;

export const AchareSetupChoice = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [setSetupMode] = useSetAchareSetupModeMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGuidedSetup = useCallback(async () => {
    setIsNavigating(true);
    try {
      await setSetupMode({ variables: { mode: 'GUIDED' } });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error: any) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [setSetupMode, setNextOnboardingStatus, enqueueErrorSnackBar]);

  const handleManualSetup = useCallback(async () => {
    setIsNavigating(true);
    try {
      await setSetupMode({ variables: { mode: 'MANUAL' } });
    } catch (error: any) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [setSetupMode, enqueueErrorSnackBar]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`How would you like to set up Achare?`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Choose how you'd like to configure your workspace.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledChoiceContainer>
          <StyledChoiceCard onClick={handleGuidedSetup} disabled={isNavigating}>
            <StyledIconContainer>
              <IconBolt size={24} color={themeCssVariables.color.blue} />
            </StyledIconContainer>
            <StyledChoiceContent>
              <StyledChoiceTitle>{t`Guided Setup`}</StyledChoiceTitle>
              <StyledChoiceDescription>
                {t`Recommended. We'll walk you through agency configuration, team setup, data import, recruitment, HR, payroll, and dashboards.`}
              </StyledChoiceDescription>
            </StyledChoiceContent>
          </StyledChoiceCard>

          <StyledChoiceCard onClick={handleManualSetup} disabled={isNavigating}>
            <StyledIconContainer>
              <IconTool size={24} color={themeCssVariables.font.color.tertiary} />
            </StyledIconContainer>
            <StyledChoiceContent>
              <StyledChoiceTitle>{t`Manual Setup`}</StyledChoiceTitle>
              <StyledChoiceDescription>
                {t`Start using Achare now and configure everything yourself.`}
              </StyledChoiceDescription>
            </StyledChoiceContent>
          </StyledChoiceCard>
        </StyledChoiceContainer>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledFooter>
          {t`You can return to Setup Center anytime.`}
        </StyledFooter>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
