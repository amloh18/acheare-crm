import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { useAchareStartOnboardingMutation } from '@/onboarding/hooks/useAchareStartOnboardingMutation';
import { useFinishAchareOnboardingMutation } from '@/onboarding/hooks/useFinishAchareOnboardingMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { currentUserState } from '@/auth/states/currentUserState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { styled } from '@linaria/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { IconClock } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { OnboardingStatus } from '~/generated-metadata/graphql';

const StyledHighlightList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin: ${themeCssVariables.spacing[2]} 0 0;
  padding-left: ${themeCssVariables.spacing[5]};
`;

const WELCOME_HIGHLIGHTS = [
  msg`Your agency details and working week.`,
  msg`Which modules your team needs.`,
  msg`Your hiring pipeline and leave policy.`,
  msg`Dashboards for each role.`,
];

export const AchareWelcome = () => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const setCurrentUser = useSetAtomState(currentUserState);
  const [startOnboarding] = useAchareStartOnboardingMutation();
  const [finishOnboarding] = useFinishAchareOnboardingMutation();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGetStarted = useCallback(async () => {
    setIsNavigating(true);
    try {
      await startOnboarding();
      setCurrentUser((current) =>
        isDefined(current)
          ? { ...current, onboardingStatus: OnboardingStatus.ACHARE_WELCOME }
          : current,
      );
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch {
      // Reset the navigating state so the button becomes clickable again.
      setIsNavigating(false);
    }
  }, [startOnboarding, setCurrentUser, setNextOnboardingStatus]);

  const handleDoThisLater = useCallback(async () => {
    setIsNavigating(true);
    try {
      await finishOnboarding();
      setCurrentUser((current) =>
        isDefined(current)
          ? { ...current, onboardingStatus: OnboardingStatus.COMPLETED }
          : current,
      );
      navigate('/dashboard');
    } catch {
      setIsNavigating(false);
    }
  }, [finishOnboarding, setCurrentUser, navigate]);

  return (
    <AchareOnboardingShell
      title={t`Welcome to Achare`}
      subtitle={t`Let's get your workspace ready. This takes about 5 minutes, and you can change anything later.`}
      onContinue={handleGetStarted}
      continueLabel={t`Get started`}
      onSkip={handleDoThisLater}
      skipLabel={t`I'll do this later`}
      isLoading={isNavigating}
      hideBack
      footnote={t`You can stop at any point — your progress is saved.`}
    >
      <AchareNote
        tone="info"
        icon={
          <IconClock size={14} color={themeCssVariables.font.color.tertiary} />
        }
      >
        {t`We'll ask about:`}
        <StyledHighlightList>
          {WELCOME_HIGHLIGHTS.map((highlight) => (
            <li key={highlight.id}>{i18n._(highlight)}</li>
          ))}
        </StyledHighlightList>
      </AchareNote>
    </AchareOnboardingShell>
  );
};
