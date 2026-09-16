import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { AchareOptionChips } from '@/onboarding/components/AchareOptionChips';
import { useCompleteAchareRecruitmentSetupMutation } from '@/onboarding/hooks/useCompleteAchareRecruitmentSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '@lingui/react/macro';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { IconInfoCircle } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DEFAULT_SOURCES = [
  'LinkedIn',
  'Job Portal',
  'Referral',
  'Database',
  'Website',
  'Employee Referral',
];

const EXTRA_SOURCES = ['Walk-in', 'Client Referral', 'Other'];

const DEFAULT_PIPELINE = [
  'Sourced',
  'Screening',
  'Shortlisted',
  'Submitted to Client',
  'Client Review',
  'Interview',
  'Selected',
  'Offer',
  'Offer Accepted',
  'Joined',
  'Rejected',
  'Dropped',
];

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

/**
 * Recruitment setup.
 *
 * The pipeline is a *sequence*, so the stages render as numbered chips in flow
 * order rather than as an unordered grid — previously the same twelve
 * unlabelled checkboxes gave no clue which stage followed which.
 */
export const AchareRecruitment = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeRecruitmentSetup] =
    useCompleteAchareRecruitmentSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const [selectedSources, setSelectedSources] =
    useState<string[]>(DEFAULT_SOURCES);
  const [selectedPipeline, setSelectedPipeline] =
    useState<string[]>(DEFAULT_PIPELINE);

  /** Values the user typed in, kept so their chips stay visible. */
  const [customSources, setCustomSources] = useState<string[]>([]);
  const [customStages, setCustomStages] = useState<string[]>([]);

  const sourceOptions = useMemo(
    () => toOptions([...DEFAULT_SOURCES, ...EXTRA_SOURCES, ...customSources]),
    [customSources],
  );

  const stageOptions = useMemo(
    () => toOptions([...DEFAULT_PIPELINE, ...customStages]),
    [customStages],
  );

  const toggle = useCallback(
    (value: string, setter: Dispatch<SetStateAction<string[]>>) => {
      setter((previous) =>
        previous.includes(value)
          ? previous.filter((candidate) => candidate !== value)
          : [...previous, value],
      );
    },
    [],
  );

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeRecruitmentSetup({
        variables: {
          input: {
            candidateSources: selectedSources,
            pipelineStages: selectedPipeline,
          },
        },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [
    selectedSources,
    selectedPipeline,
    completeRecruitmentSetup,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  return (
    <AchareOnboardingShell
      title={t`How does hiring work here?`}
      subtitle={t`Tell Achare where your candidates come from and the stages they move through, so every requirement follows the same process.`}
      onContinue={handleContinue}
      isLoading={isNavigating}
      isContinueDisabled={selectedPipeline.length === 0}
      footnote={t`Nothing here is permanent — you can rename, reorder or add stages later from Settings.`}
    >
      <AchareFieldGroup
        label={t`Where do your candidates come from?`}
        hint={t`These become the options you pick from when you add a candidate.`}
        counter={t`${selectedSources.length} selected`}
      >
        <AchareOptionChips
          options={sourceOptions}
          selected={selectedSources}
          onToggle={(value) => toggle(value, setSelectedSources)}
          onAddOption={(value) =>
            setCustomSources((previous) =>
              previous.includes(value) ? previous : [...previous, value],
            )
          }
          addOptionPlaceholder={t`e.g. Naukri`}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`What stages does a candidate go through?`}
        hint={t`The numbers show the order a candidate moves in. Turn off any stage you do not use.`}
        counter={t`${selectedPipeline.length} stages`}
      >
        <AchareOptionChips
          options={stageOptions}
          selected={selectedPipeline}
          onToggle={(value) => toggle(value, setSelectedPipeline)}
          onAddOption={(value) =>
            setCustomStages((previous) =>
              previous.includes(value) ? previous : [...previous, value],
            )
          }
          addOptionPlaceholder={t`e.g. Technical round`}
          isOrdered
          disabled={isNavigating}
        />
        <AchareNote
          tone="info"
          icon={
            <IconInfoCircle
              size={14}
              color={themeCssVariables.font.color.tertiary}
            />
          }
        >
          {t`Keep at least one "closing" stage such as Rejected or Dropped so candidates can be taken out of the pipeline cleanly.`}
        </AchareNote>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
