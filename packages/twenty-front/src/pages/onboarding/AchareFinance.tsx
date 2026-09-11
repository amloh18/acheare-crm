import {
  AchareModuleSetupStep,
  type AchareModuleSetupItem,
} from '@/onboarding/components/AchareModuleSetupStep';
import { useCompleteAchareFinanceSetupMutation } from '@/onboarding/hooks/useCompleteAchareFinanceSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import {
  ACHARE_FEATURES,
  ACHARE_MODULES,
  AchareModuleKey,
} from 'twenty-shared/workspace';

/**
 * Checklist is derived from the feature catalogue, so renaming a Finance
 * feature never leaves this page describing something that no longer exists.
 */
const FINANCE_SETUP_ITEMS: AchareModuleSetupItem[] = ACHARE_MODULES[
  AchareModuleKey.FINANCE
].features.map((featureKey) => ({
  icon: ACHARE_FEATURES[featureKey].icon,
  name: ACHARE_FEATURES[featureKey].label,
  description: ACHARE_FEATURES[featureKey].description,
}));

/**
 * Finance setup step — only reachable when the Finance module was selected
 * during feature selection.
 */
export const AchareFinance = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeFinanceSetup] = useCompleteAchareFinanceSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeFinanceSetup({ variables: { input: {} } });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completeFinanceSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  const handleSkip = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeFinanceSetup({ variables: { input: { skipSetup: true } } });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completeFinanceSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <AchareModuleSetupStep
      title={t`Finance Setup`}
      subtitle={t`Invoicing and payments, ready for your first billable client.`}
      items={FINANCE_SETUP_ITEMS}
      note={t`Skipping only hides the Finance navigation for now — nothing is deleted, and you can turn it back on any time from Settings.`}
      isNavigating={isNavigating}
      onContinue={handleContinue}
      onSkip={handleSkip}
    />
  );
};
