import { AchareFeatureCompositionEditor } from '@/onboarding/components/AchareFeatureCompositionEditor';
import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import {
  AchareSelectableCard,
  AchareSelectableCardGroup,
} from '@/onboarding/components/AchareSelectableCard';
import { useCompleteAchareFeatureSelectionMutation } from '@/onboarding/hooks/useCompleteAchareFeatureSelectionMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useMemo, useState } from 'react';
import { IconInfoCircle } from 'twenty-ui/icon';
import {
  ACHARE_FEATURES,
  ACHARE_FEATURE_PRESETS,
  ACHARE_MODULES,
  ACHARE_ONBOARDING_STEP_LABEL,
  type AchareFeatureKey,
  type AchareFeaturePresetKey,
  type AchareModuleKey,
  getAchareOnboardingSteps,
  getMissingAchareFeatureDependencies,
  resolveAchareFeatureDependencies,
} from 'twenty-shared/workspace';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { GetWorkspaceFeatureConfigurationDocument } from '~/generated-metadata/graphql';

const StyledStepChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledStepChip = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.secondary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
`;

const DEFAULT_PRESET_KEY: AchareFeaturePresetKey = 'RECRUITMENT_AGENCY';

/**
 * Feature composition step.
 *
 * This is the step that makes the rest of onboarding dynamic: the wizard that
 * follows, the navigation drawer, the dashboards and the permission sets are
 * all derived from what is selected here. Presets only pre-select — they never
 * lock the product around an industry.
 */
export const AchareFeatureSelection = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeFeatureSelection] =
    useCompleteAchareFeatureSelectionMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const [selectedPresetKey, setSelectedPresetKey] =
    useState<AchareFeaturePresetKey>(DEFAULT_PRESET_KEY);
  const [selectedFeatures, setSelectedFeatures] = useState<AchareFeatureKey[]>(
    () =>
      resolveAchareFeatureDependencies(
        ACHARE_FEATURE_PRESETS[DEFAULT_PRESET_KEY].features,
      ),
  );

  /**
   * Dependencies the server will add on top of the explicit selection. Shown so
   * "Payroll also turns on Employees and Salary" is never a surprise.
   */
  const autoEnabledFeatures = useMemo(
    () => getMissingAchareFeatureDependencies(selectedFeatures),
    [selectedFeatures],
  );

  /** The wizard this selection produces — the visible payoff of composition. */
  const generatedSteps = useMemo(
    () =>
      getAchareOnboardingSteps(
        resolveAchareFeatureDependencies(selectedFeatures),
      ),
    [selectedFeatures],
  );

  const handleSelectPreset = useCallback(
    (presetKey: AchareFeaturePresetKey) => {
      setSelectedPresetKey(presetKey);

      const preset = ACHARE_FEATURE_PRESETS[presetKey];

      // "Custom" keeps whatever the user already chose.
      if (preset.features.length === 0) {
        return;
      }

      setSelectedFeatures(resolveAchareFeatureDependencies(preset.features));
    },
    [],
  );

  const handleToggleModule = useCallback((moduleKey: AchareModuleKey) => {
    setSelectedPresetKey('CUSTOM');
    setSelectedFeatures((current) => {
      const moduleFeatures = ACHARE_MODULES[moduleKey].features;
      const isFullySelected = moduleFeatures.every((feature) =>
        current.includes(feature),
      );

      return isFullySelected
        ? current.filter((feature) => !moduleFeatures.includes(feature))
        : [...new Set([...current, ...moduleFeatures])];
    });
  }, []);

  const handleToggleFeature = useCallback((feature: AchareFeatureKey) => {
    setSelectedPresetKey('CUSTOM');
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((candidate) => candidate !== feature)
        : [...current, feature],
    );
  }, []);

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeFeatureSelection({
        variables: {
          input: {
            features: selectedFeatures,
            presetKey: selectedPresetKey,
          },
        },
        // The step list and navigation depend on what was just saved, so wait
        // for the refreshed configuration before advancing.
        refetchQueries: [{ query: GetWorkspaceFeatureConfigurationDocument }],
        awaitRefetchQueries: true,
      });

      // Small delay to ensure the server-side feature configuration is fully
      // propagated before the next step list is computed.
      await new Promise((resolve) => setTimeout(resolve, 300));

      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [
    completeFeatureSelection,
    selectedFeatures,
    selectedPresetKey,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  return (
    <AchareOnboardingShell
      title={t`Which parts of Achare do you need?`}
      subtitle={t`Pick the modules your team will use. Your navigation, permissions, dashboards and the rest of setup all follow this choice.`}
      onContinue={handleContinue}
      isLoading={isNavigating}
      isContinueDisabled={selectedFeatures.length === 0}
      footnote={t`You can turn modules on or off any time from Settings → Setup Center. Nothing is deleted when you turn something off.`}
    >
      <AchareFieldGroup
        label={t`Start from a preset`}
        hint={t`A preset just pre-selects modules for you. You can change anything in the list below afterwards.`}
      >
        <AchareSelectableCardGroup layout="grid">
          {Object.values(ACHARE_FEATURE_PRESETS).map((preset) => (
            <AchareSelectableCard
              key={preset.key}
              role="radio"
              title={preset.label}
              description={preset.description}
              isSelected={preset.key === selectedPresetKey}
              onClick={() => handleSelectPreset(preset.key)}
              disabled={isNavigating}
            />
          ))}
        </AchareSelectableCardGroup>
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Modules`}
        hint={t`Turn a whole module on, or fine-tune the individual items inside it.`}
      >
        <AchareFeatureCompositionEditor
          selectedFeatures={selectedFeatures}
          onToggleModule={handleToggleModule}
          onToggleFeature={handleToggleFeature}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      {autoEnabledFeatures.length > 0 && (
        <AchareNote
          tone="info"
          icon={
            <IconInfoCircle
              size={14}
              color={themeCssVariables.font.color.tertiary}
            />
          }
        >
          {t`We will also turn on ${autoEnabledFeatures
            .map((feature) => ACHARE_FEATURES[feature].label)
            .join(', ')} — the modules you picked need them to work.`}
        </AchareNote>
      )}

      <AchareFieldGroup
        label={t`Your setup steps`}
        hint={t`This is the setup you will be walked through, based on the modules above.`}
      >
        <StyledStepChipRow>
          {generatedSteps.map((step) => (
            <StyledStepChip key={step}>
              {ACHARE_ONBOARDING_STEP_LABEL[step]}
            </StyledStepChip>
          ))}
        </StyledStepChipRow>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
