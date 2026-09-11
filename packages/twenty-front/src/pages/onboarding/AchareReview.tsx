import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useFinishAchareOnboardingMutation } from '@/onboarding/hooks/useFinishAchareOnboardingMutation';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { IconCheck } from '@tabler/icons-react';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  ACHARE_MODULES,
  type AchareFeatureKey,
  getEnabledAchareModules,
} from 'twenty-shared/workspace';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledSummaryItem = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[3]} 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledCheckIcon = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.success};
  border-radius: 50%;
  display: flex;
  height: 20px;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
`;

const StyledSummaryLabel = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  flex: 1;
`;

const StyledSummaryValue = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

export const AchareReview = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [finishOnboarding] = useFinishAchareOnboardingMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const enabledFeatures = useAchareEnabledFeatures();

  // The review lists what this workspace actually composed, not a fixed list of
  // everything Achare can do.
  const enabledModules = isDefined(enabledFeatures)
    ? getEnabledAchareModules(enabledFeatures as AchareFeatureKey[])
    : [];

  const summaryItems = [
    { label: t`Agency`, value: t`Configured` },
    ...enabledModules.map((moduleKey) => ({
      label: ACHARE_MODULES[moduleKey].label,
      value: t`Ready`,
    })),
  ];

  const handleFinish = useCallback(async () => {
    setIsNavigating(true);
    try {
      await finishOnboarding();
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error: any) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [finishOnboarding, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Your Achare Workspace`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Everything is configured and ready to go.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          {summaryItems.map((item) => (
            <StyledSummaryItem key={item.label}>
              <StyledCheckIcon>
                <IconCheck size={12} color={themeCssVariables.font.color.primary} />
              </StyledCheckIcon>
              <StyledSummaryLabel>{item.label}</StyledSummaryLabel>
              <StyledSummaryValue>{item.value}</StyledSummaryValue>
            </StyledSummaryItem>
          ))}
        </StyledContent>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <MainButton
          title={t`Finish Setup`}
          onClick={handleFinish}
          disabled={isNavigating}
          fullWidth
        />
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
