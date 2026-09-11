import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareRecruitmentSetupMutation } from '@/onboarding/hooks/useCompleteAchareRecruitmentSetupMutation';
import { Checkbox } from 'twenty-ui/input';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledCheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const DEFAULT_SOURCES = [
  'LinkedIn',
  'Job Portal',
  'Referral',
  'Database',
  'Walk-in',
  'Website',
  'Employee Referral',
  'Client Referral',
  'Other',
];

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

export const AchareRecruitment = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeRecruitmentSetup] =
    useCompleteAchareRecruitmentSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    DEFAULT_SOURCES,
  );
  const [selectedPipeline, setSelectedPipeline] =
    useState<string[]>(DEFAULT_PIPELINE);

  const toggleItem = (
    item: string,
    list: string[],
    setter: (val: string[]) => void,
  ) => {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

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
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Recruitment Setup`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Configure candidate sources and hiring pipeline stages.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          <StyledSection>
            <StyledSectionTitle>{t`Candidate Sources`}</StyledSectionTitle>
            <StyledCheckboxRow>
              {DEFAULT_SOURCES.map((source) => (
                <Checkbox
                  key={source}
                  checked={selectedSources.includes(source)}
                  onChange={() =>
                    toggleItem(source, selectedSources, setSelectedSources)
                  }
                  aria-label={source}
                />
              ))}
            </StyledCheckboxRow>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>{t`Hiring Pipeline`}</StyledSectionTitle>
            <StyledCheckboxRow>
              {DEFAULT_PIPELINE.map((stage) => (
                <Checkbox
                  key={stage}
                  checked={selectedPipeline.includes(stage)}
                  onChange={() =>
                    toggleItem(stage, selectedPipeline, setSelectedPipeline)
                  }
                  aria-label={stage}
                />
              ))}
            </StyledCheckboxRow>
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
