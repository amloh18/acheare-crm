import { useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ACHARE_FEATURES,
  ACHARE_MODULES,
  ACHARE_MODULE_ORDER,
  ACHARE_ONBOARDING_STEP_LABEL,
  type AchareFeatureKey,
  type AchareModuleKey,
  getAchareDependentFeatures,
  getEnabledFeaturesForModule,
  getMissingAchareFeatureDependencies,
  isAchareModuleEnabled,
  resolveAchareFeatureDependencies,
} from 'twenty-shared/workspace';

import { AchareFeatureCompositionEditor } from '@/onboarding/components/AchareFeatureCompositionEditor';
import { AchareSetupCenterSections } from '@/onboarding/components/AchareSetupCenterSections';
import { useAchareSetupProgressQuery } from '@/onboarding/hooks/useAchareSetupProgressQuery';
import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { useAchareOnboardingSteps } from '@/workspace-feature/hooks/useAchareOnboardingSteps';
import { useSetWorkspaceFeaturesMutation } from '@/workspace-feature/hooks/useSetWorkspaceFeaturesMutation';
import { useRestartAchareOnboardingMutation } from '@/onboarding/hooks/useRestartAchareOnboardingMutation';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { AppPath } from 'twenty-shared/types';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import type { AchareSetupStepStatus } from '~/generated-metadata/graphql';
import { IconCheck, IconCircle, IconClock, IconPlayerPlay } from 'twenty-ui/icon';
import { MainButton } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { H2Title } from 'twenty-ui/typography';

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

/**
 * Hosts the standard spreadsheet-import dialog for one object at a time.
 * Mounted only while a dialog is open so the per-object hooks inside do not
 * run for every module on the page.
 */
const SetupCenterImportDialogHost = ({
  objectNameSingular,
  onClose,
}: {
  objectNameSingular: string;
  onClose: () => void;
}) => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar } = useSnackBar();

  const { openObjectRecordsSpreadsheetImportDialog } =
    useOpenObjectRecordsSpreadsheetImportDialog(objectNameSingular);

  useEffect(() => {
    openObjectRecordsSpreadsheetImportDialog({
      onClose: () => {
        onClose();
      },
      onSubmit: async (validationResult: {
        validStructuredRows: Array<unknown>;
      }) => {
        enqueueSuccessSnackBar({
          message: t`${validationResult.validStructuredRows.length} records imported`,
        });
      },
    } as never);
    // The dialog must open exactly once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

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

const StyledDemoBanner = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledDemoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledDemoTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledDemoSubtitle = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
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
  const [restartAchareOnboarding, { loading: isRestarting }] =
    useRestartAchareOnboardingMutation();
  const navigateApp = useNavigateApp();
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();

  const handleStartDemo = useCallback(async () => {
    try {
      await restartAchareOnboarding();
      navigateApp(AppPath.AchareWelcome, undefined, { demo: 'true' });
    } catch (error) {
      enqueueErrorSnackBar({
        message: t`Failed to start onboarding demo: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }, [restartAchareOnboarding, navigateApp, enqueueErrorSnackBar, t]);

  const [isSaving, setIsSaving] = useState(false);
  const [draftFeatures, setDraftFeatures] = useState<
    AchareFeatureKey[] | null
  >(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importObjectNameSingular, setImportObjectNameSingular] = useState<
    string | null
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

  /*
   * One import dialog host for every section card. The dialog is opened with
   * the singular object name of the feature that was clicked; the standard
   * spreadsheet-import hook does the actual batch create.
   */
  const handleOpenImportDialog = useCallback(
    (objectNameSingular: string) => {
      setImportObjectNameSingular(objectNameSingular);
      setIsImportDialogOpen(true);
    },
    [],
  );

  const stepStatuses = progressData?.acheareSetupProgress?.stepStatuses ?? [];

  /*
   * Setup Center sections (§17): one card per module the workspace actually
   * has, derived from the shared catalogue so the cards, the drawer and the
   * wizard can never disagree about what a module contains. A module with no
   * enabled feature has no card — exactly like its navigation folder.
   */
  const workspaceSections = useMemo(() => {
    if (enabledFeatures === undefined) {
      return [];
    }

    return ACHARE_MODULE_ORDER.filter((moduleKey) =>
      isAchareModuleEnabled(enabledFeatures as AchareFeatureKey[], moduleKey),
    ).map((moduleKey) => ({
      moduleKey,
      title: ACHARE_MODULES[moduleKey].label,
      features: getEnabledFeaturesForModule(
        enabledFeatures as AchareFeatureKey[],
        moduleKey,
      ),
    }));
  }, [enabledFeatures]);

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
            <StyledDemoBanner>
              <StyledDemoText>
                <StyledDemoTitle>{t`Walkthrough & Demo Wizard`}</StyledDemoTitle>
                <StyledDemoSubtitle>
                  {t`Experience or demonstrate the complete multi-step onboarding wizard for this workspace.`}
                </StyledDemoSubtitle>
              </StyledDemoText>
              <MainButton
                title={isRestarting ? t`Launching...` : t`Launch Onboarding Demo`}
                Icon={IconPlayerPlay}
                variant="secondary"
                disabled={isRestarting}
                onClick={handleStartDemo}
              />
            </StyledDemoBanner>
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
            title={t`Workspace Sections`}
            description={t`Only the modules you enabled appear here. Open a list or import data into it.`}
          />
          {isConfigurationLoading ? (
            <StyledEmptyState>{t`Loading modules...`}</StyledEmptyState>
          ) : workspaceSections.length === 0 ? (
            <StyledEmptyState>
              {t`No modules are enabled yet — turn some on below.`}
            </StyledEmptyState>
          ) : (
            <AchareSetupCenterSections
              sections={workspaceSections}
              onImportClick={handleOpenImportDialog}
            />
          )}
          {isImportDialogOpen && importObjectNameSingular !== null && (
            <SetupCenterImportDialogHost
              objectNameSingular={importObjectNameSingular}
              onClose={() => {
                setIsImportDialogOpen(false);
                setImportObjectNameSingular(null);
              }}
            />
          )}
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
