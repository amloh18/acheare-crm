import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import {
  AchareSelectableCard,
  AchareSelectableCardGroup,
} from '@/onboarding/components/AchareSelectableCard';
import { useSetAchareSetupModeMutation } from '@/onboarding/hooks/useSetAchareSetupModeMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { currentUserState } from '@/auth/states/currentUserState';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { OnboardingStatus } from '~/generated-metadata/graphql';

type SetupMode = 'GUIDED' | 'MANUAL';

export const AchareSetupChoice = () => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const setCurrentUser = useSetAtomState(currentUserState);
  const [setSetupMode] = useSetAchareSetupModeMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SetupMode>('GUIDED');

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await setSetupMode({ variables: { mode: selectedMode } });

      if (selectedMode === 'GUIDED') {
        setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });

        return;
      }

      // The server finishes onboarding for the manual path, but it does not
      // push the new status to the client — without this the wizard would sit
      // on this step forever.
      setCurrentUser((current) =>
        isDefined(current)
          ? { ...current, onboardingStatus: OnboardingStatus.COMPLETED }
          : current,
      );
      navigate('/dashboard');
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [
    selectedMode,
    setSetupMode,
    setCurrentUser,
    setNextOnboardingStatus,
    navigate,
    enqueueErrorSnackBar,
  ]);

  return (
    <AchareOnboardingShell
      title={t`How would you like to set up Achare?`}
      subtitle={t`Guided setup asks a few short questions and configures each module for you. Manual setup drops you into an empty workspace to build yourself.`}
      onContinue={handleContinue}
      continueLabel={
        selectedMode === 'GUIDED'
          ? t`Start guided setup`
          : t`Skip setup and start`
      }
      isLoading={isNavigating}
      footnote={t`You can re-run any part of this from Settings → Setup Center, whichever you choose now.`}
    >
      <AchareFieldGroup
        label={t`Pick a setup style`}
        hint={t`This only decides what happens next — both options give you the same product.`}
      >
        <AchareSelectableCardGroup>
          <AchareSelectableCard
            role="radio"
            title={t`Guided setup — recommended`}
            description={t`We walk you through agency details, modules, team, recruitment, HR, payroll, dashboards and data import, then leave you with a configured workspace.`}
            isSelected={selectedMode === 'GUIDED'}
            onClick={() => setSelectedMode('GUIDED')}
            disabled={isNavigating}
          />
          <AchareSelectableCard
            role="radio"
            title={t`Manual setup`}
            description={t`Nothing is pre-configured. You start with an empty workspace and set up modules whenever you want from Settings.`}
            isSelected={selectedMode === 'MANUAL'}
            onClick={() => setSelectedMode('MANUAL')}
            disabled={isNavigating}
          />
        </AchareSelectableCardGroup>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
