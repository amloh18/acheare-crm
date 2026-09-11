import { useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';
import { useCallback, useMemo, useState } from 'react';
import {
  ACHARE_FEATURES,
  ACHARE_MODULES,
  ACHARE_ONBOARDING_STEP_LABEL,
  type AchareFeatureKey,
  type AchareModuleKey,
  getAchareDependentFeatures,
  getMissingAchareFeatureDependencies,
  resolveAchareFeatureDependencies,
} from 'twenty-shared/workspace';

import { AchareFeatureCompositionEditor } from '@/onboarding/components/AchareFeatureCompositionEditor';
import { useAchareSetupProgressQuery } from '@/onboarding/hooks/useAchareSetupProgressQuery';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { useAchareOnboardingSteps } from '@/workspace-feature/hooks/useAchareOnboardingSteps';
import { useSetWorkspaceFeaturesMutation } from '@/workspace-feature/hooks/useSetWorkspaceFeaturesMutation';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import type { AchareSetupStepStatus } from '~/generated-metadata/graphql';
import { IconCheck, IconCircle, IconClock } from 'twenty-ui/icon';
import { MainButton } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { H2Title } from 'twenty-ui/typography';

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledStatusIcon = styled.div<{ status: string }>`
  align-items: center;
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;

  background: ${(props) =>
    props.status === 'COMPLETED'
      ? themeCssVariables.background.transparent.success
      : props.status === 'IN_PROGRESS'
        ? themeCssVariables.background.transparent.orange
        : themeCssVariables.background.secondary};
`;

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledCardLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledCardStatus = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledNotice = styled.div`
  background: ${themeCssVariables.background.transparent.blue};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledWarning = styled(StyledNotice)`
  background: ${themeCssVariables.background.transparent.orange};
`;

const StyledHint = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const getStatusIcon = (status: AchareSetupStepStatus['status']) => {
  switch (status) {
    case 'COMPLETED':
      return <IconCheck size={16} color={themeCssVariables.color.green} />;
    case 'IN_PROGRESS':
      return <IconClock size={16} color={themeCssVariables.color.yellow} />;
    case 'SKIPPED':
      return <IconCheck size={16} color={themeCssVariables.font.color.tertiary} />;
    default:
      return <IconCircle size={16} color={themeCssVariables.font.color.tertiary} />;
  }
};

const describeStatus = (
  status: AchareSetupStepStatus['status'],
  labels: {
    completed: string;
    inProgress: string;
    skipped: string;
    notStarted: string;
  },
) => {
  switch (status) {
    case 'COMPLETED':
      return labels.completed;
    case 'IN_PROGRESS':
      return labels.inProgress;
    case 'SKIPPED':
      return labels.skipped;
    default:
      return labels.notStarted;
  }
};

/**
 * Post-onboarding configuration hub.
 *
 * Two jobs: show honestly where the workspace's setup got to, and let an admin
 * change the feature composition after the fact. The wizard shown here is the
 * workspace's *generated* one, so a workspace that never selected Payroll does
 * not see a Payroll step — the same generator the onboarding flow uses.
 */
export const SetupCenter = () => {
  const { t } = useLingui();
  const { data: progressData, loading: isProgressLoading } =
    useAchareSetupProgressQuery();
  const enabledFeatures = useAchareEnabledFeatures();
  const onboardingSteps = useAchareOnboardingSteps();
  const [setWorkspaceFeatures] = useSetWorkspaceFeaturesMutation();
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();

  const [isSaving, setIsSaving] = useState(false);
  const [draftFeatures, setDraftFeatures] = useState<
    AchareFeatureKey[] | null
  >(null);

  const savedFeatures = useMemo(
    () => (enabledFeatures ?? []) as AchareFeatureKey[],
    [enabledFeatures],
  );

  const currentFeatures = draftFeatures ?? savedFeatures;
  const isConfigurationLoading =
    enabledFeatures === undefined || onboardingSteps === undefined;

  /**
   * What will actually be stored. Dependencies are one-directional, so the
   * server re-adds anything still required by an enabled feature — resolving
   * here means the preview matches the saved result exactly.
   */
  const effectiveFeatures = useMemo(
    () => resolveAchareFeatureDependencies(currentFeatures),
    [currentFeatures],
  );

  /** Features the admin turned off that came back because something needs them. */
  const reEnabledByDependencies = useMemo(
    () => effectiveFeatures.filter((feature) => !currentFeatures.includes(feature)),
    [effectiveFeatures, currentFeatures],
  );

  /** Features the admin did not pick that will be enabled anyway. */
  const addedByDependencies = useMemo(
    () => getMissingAchareFeatureDependencies(currentFeatures),
    [currentFeatures],
  );

  const hasChanges = useMemo(() => {
    if (draftFeatures === null) {
      return false;
    }

    return (
      effectiveFeatures.length !== savedFeatures.length ||
      effectiveFeatures.some((feature) => !savedFeatures.includes(feature))
    );
  }, [draftFeatures, effectiveFeatures, savedFeatures]);

  const handleToggleModule = useCallback((moduleKey: AchareModuleKey) => {
    setDraftFeatures((current) => {
      const base = current ?? savedFeatures;
      const moduleFeatures = ACHARE_MODULES[moduleKey].features;
      const isFullySelected = moduleFeatures.every((feature) =>
        base.includes(feature),
      );

      return isFullySelected
        ? base.filter((feature) => !moduleFeatures.includes(feature))
        : [...new Set([...base, ...moduleFeatures])];
    });
  }, [savedFeatures]);

  const handleToggleFeature = useCallback((feature: AchareFeatureKey) => {
    setDraftFeatures((current) => {
      const base = current ?? savedFeatures;

      return base.includes(feature)
        ? base.filter((candidate) => candidate !== feature)
        : [...base, feature];
    });
  }, [savedFeatures]);

  const handleDiscard = useCallback(() => {
    setDraftFeatures(null);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await setWorkspaceFeatures({
        variables: { input: { features: effectiveFeatures } },
      });
      setDraftFeatures(null);
      enqueueSuccessSnackBar({ message: t`Workspace modules updated.` });
    } catch (error) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    setWorkspaceFeatures,
    effectiveFeatures,
    enqueueSuccessSnackBar,
    enqueueErrorSnackBar,
    t,
  ]);

  const stepStatuses = progressData?.acheareSetupProgress?.stepStatuses ?? [];

  const stepsToShow = (onboardingSteps ?? []).map((step) => {
    const found = stepStatuses.find((stepStatus) => stepStatus.step === step);

    return {
      step,
      label: ACHARE_ONBOARDING_STEP_LABEL[step],
      status: found?.status ?? ('NOT_STARTED' as const),
    };
  });

  const completedStepCount = stepsToShow.filter(
    (step) => step.status === 'COMPLETED' || step.status === 'SKIPPED',
  ).length;

  return (
    <SettingsPageLayout
      title={t`Setup Center`}
      links={[{ children: t`Workspace` }, { children: t`Setup Center` }]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Setup Progress`}
            description={t`Where this workspace's setup got to. The steps below are generated from the modules you selected.`}
          />
          <StyledSection>
            {isProgressLoading && (
              <StyledEmptyState>{t`Loading setup progress...`}</StyledEmptyState>
            )}
            {!isProgressLoading && stepsToShow.length === 0 && (
              <StyledEmptyState>
                {t`Setup has not been started yet.`}
              </StyledEmptyState>
            )}
            {!isProgressLoading && stepsToShow.length > 0 && (
              <StyledHint>
                {t`${completedStepCount} of ${stepsToShow.length} steps done.`}
              </StyledHint>
            )}
            {!isProgressLoading &&
              stepsToShow.map((item) => (
                <StyledCard key={item.step}>
                  <StyledStatusIcon status={item.status}>
                    {getStatusIcon(item.status)}
                  </StyledStatusIcon>
                  <StyledCardContent>
                    <StyledCardLabel>{item.label}</StyledCardLabel>
                    <StyledCardStatus>
                      {describeStatus(item.status, {
                        completed: t`Completed`,
                        inProgress: t`In progress`,
                        skipped: t`Skipped — the module can be enabled below`,
                        notStarted: t`Not started`,
                      })}
                    </StyledCardStatus>
                  </StyledCardContent>
                </StyledCard>
              ))}
          </StyledSection>
        </Section>

        <Section>
          <H2Title
            title={t`Modules & Features`}
            description={t`Turn parts of Achare on or off for this workspace.`}
          />
          <StyledSection>
            {isConfigurationLoading ? (
              <StyledEmptyState>
                {t`Loading modules...`}
              </StyledEmptyState>
            ) : (
              <>
                <AchareFeatureCompositionEditor
                  selectedFeatures={currentFeatures}
                  onToggleModule={handleToggleModule}
                  onToggleFeature={handleToggleFeature}
                  disabled={isSaving}
                />

                {reEnabledByDependencies.length > 0 && (
                  <StyledWarning>
                    {reEnabledByDependencies
                      .map(
                        (feature) =>
                          `${ACHARE_FEATURES[feature].label} (${t`required by`} ${getAchareDependentFeatures(
                            feature,
                            effectiveFeatures,
                          )
                            .map(
                              (dependent) =>
                                ACHARE_FEATURES[dependent].label,
                            )
                            .join(', ')})`,
                      )
                      .join(' · ')}
                    {' — '}
                    {t`these stay on until the features that need them are turned off too.`}
                  </StyledWarning>
                )}

                {addedByDependencies.length > 0 && (
                  <StyledNotice>
                    {t`Also turning on`}{' '}
                    {addedByDependencies
                      .map((feature) => ACHARE_FEATURES[feature].label)
                      .join(', ')}{' '}
                    {t`— they are required by the modules you selected.`}
                  </StyledNotice>
                )}

                <StyledHint>
                  {t`Turning a module off only hides it — no records, files or history are ever deleted.`}
                </StyledHint>

                {hasChanges && (
                  <StyledButtonRow>
                    <MainButton
                      title={t`Discard`}
                      onClick={handleDiscard}
                      disabled={isSaving}
                      variant="secondary"
                    />
                    <MainButton
                      title={t`Save changes`}
                      onClick={handleSave}
                      disabled={isSaving}
                    />
                  </StyledButtonRow>
                )}
              </>
            )}
          </StyledSection>
        </Section>
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
