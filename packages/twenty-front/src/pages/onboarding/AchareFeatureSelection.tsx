import { AchareFeatureCompositionEditor } from '@/onboarding/components/AchareFeatureCompositionEditor';
import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useCompleteAchareFeatureSelectionMutation } from '@/onboarding/hooks/useCompleteAchareFeatureSelectionMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useMemo, useState } from 'react';
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
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { GetWorkspaceFeatureConfigurationDocument } from '~/generated-metadata/graphql';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[5]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSectionTitle = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const StyledPresetGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const StyledPresetCard = styled.button<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[4]};
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
  }
`;

const StyledPresetLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledPresetDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  line-height: 1.5;
`;

const StyledNotice = styled.div`
  background: ${themeCssVariables.background.transparent.blue};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledStepChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledStepChip = styled.span`
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
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
  const [completeFeatureSelection] = useCompleteAchareFeatureSelectionMutation();
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

  const handleSelectPreset = useCallback((presetKey: AchareFeaturePresetKey) => {
    setSelectedPresetKey(presetKey);

    const preset = ACHARE_FEATURE_PRESETS[presetKey];

    // "Custom" keeps whatever the user already chose.
    if (preset.features.length === 0) {
      return;
    }

    setSelectedFeatures(resolveAchareFeatureDependencies(preset.features));
  }, []);

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
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Which modules do you need?`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Pick the parts of Achare your team will use. Your navigation, permissions, dashboards and the rest of setup adapt to your choice.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          <StyledSection>
            <StyledSectionTitle>{t`Start from a preset`}</StyledSectionTitle>
            <StyledPresetGrid>
              {Object.values(ACHARE_FEATURE_PRESETS).map((preset) => (
                <StyledPresetCard
                  key={preset.key}
                  isSelected={preset.key === selectedPresetKey}
                  onClick={() => handleSelectPreset(preset.key)}
                  disabled={isNavigating}
                >
                  <StyledPresetLabel>{preset.label}</StyledPresetLabel>
                  <StyledPresetDescription>
                    {preset.description}
                  </StyledPresetDescription>
                </StyledPresetCard>
              ))}
            </StyledPresetGrid>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>{t`Modules`}</StyledSectionTitle>
            <AchareFeatureCompositionEditor
              selectedFeatures={selectedFeatures}
              onToggleModule={handleToggleModule}
              onToggleFeature={handleToggleFeature}
              disabled={isNavigating}
            />
          </StyledSection>

          {autoEnabledFeatures.length > 0 && (
            <StyledNotice>
              {t`Also turning on`}{' '}
              {autoEnabledFeatures
                .map((feature) => ACHARE_FEATURES[feature].label)
                .join(', ')}{' '}
              {t`— they are required by the modules you picked.`}
            </StyledNotice>
          )}

          <StyledSection>
            <StyledSectionTitle>{t`Your setup steps`}</StyledSectionTitle>
            <StyledStepChipRow>
              {generatedSteps.map((step) => (
                <StyledStepChip key={step}>
                  {ACHARE_ONBOARDING_STEP_LABEL[step]}
                </StyledStepChip>
              ))}
            </StyledStepChipRow>
          </StyledSection>
        </StyledContent>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <MainButton
          title={t`Continue`}
          onClick={handleContinue}
          disabled={isNavigating}
          fullWidth
        />
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
