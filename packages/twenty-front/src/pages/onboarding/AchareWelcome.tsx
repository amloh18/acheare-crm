import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useAchareStartOnboardingMutation } from '@/onboarding/hooks/useAchareStartOnboardingMutation';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { styled } from '@linaria/react';
import { msg } from '@lingui/core/macro';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeCssVariables.spacing[8]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledLogo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${themeCssVariables.border.radius.lg};
`;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
  max-width: 320px;
`;

export const AchareWelcome = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [startOnboarding] = useAchareStartOnboardingMutation();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGetStarted = useCallback(async () => {
    setIsNavigating(true);
    try {
      await startOnboarding();
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch {
      setIsNavigating(false);
    }
  }, [startOnboarding, setNextOnboardingStatus]);

  const handleDoThisLater = useCallback(async () => {
    setIsNavigating(true);
    try {
      await startOnboarding();
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch {
      setIsNavigating(false);
    }
  }, [startOnboarding, setNextOnboardingStatus]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledContent>
            <StyledLogo
              src="/images/integrations/acheare-logo.svg"
              alt="Achare logo"
            />
            <StyledOnboardingStepTitle>
              {t`Welcome to Achare`}
            </StyledOnboardingStepTitle>
          </StyledContent>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Your recruitment agency workspace is ready. Let's get a few things configured so Achare works the way your team works.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledButtonRow>
          <MainButton
            title={t`Get Started`}
            onClick={handleGetStarted}
            disabled={isNavigating}
            fullWidth
          />
          <MainButton
            title={t`I'll do this later`}
            onClick={handleDoThisLater}
            disabled={isNavigating}
            fullWidth
            variant="secondary"
          />
        </StyledButtonRow>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
