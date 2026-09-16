import {
  AchareModuleSetupStep,
  type AchareModuleSetupItem,
} from '@/onboarding/components/AchareModuleSetupStep';
import { useCompleteAchareDocumentsSetupMutation } from '@/onboarding/hooks/useCompleteAchareDocumentsSetupMutation';
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

const DOCUMENTS_SETUP_ITEMS: AchareModuleSetupItem[] = ACHARE_MODULES[
  AchareModuleKey.DOCUMENTS
].features.map((featureKey) => ({
  icon: ACHARE_FEATURES[featureKey].icon,
  name: ACHARE_FEATURES[featureKey].label,
  description: ACHARE_FEATURES[featureKey].description,
}));

/**
 * Documents setup step — only reachable when the Documents module was selected
 * during feature selection.
 */
export const AchareDocuments = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeDocumentsSetup] = useCompleteAchareDocumentsSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeDocumentsSetup({ variables: { input: {} } });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completeDocumentsSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  const handleSkip = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeDocumentsSetup({
        variables: { input: { skipSetup: true } },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completeDocumentsSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <AchareModuleSetupStep
      title={t`Documents Setup`}
      subtitle={t`Attach company and employee documents to the right records.`}
      items={DOCUMENTS_SETUP_ITEMS}
      note={t`Skipping only hides the Documents navigation for now — nothing is deleted, and you can turn it back on any time from Settings.`}
      actionLabel={t`Enable Documents`}
      isNavigating={isNavigating}
      onContinue={handleContinue}
      onSkip={handleSkip}
    />
  );
};
