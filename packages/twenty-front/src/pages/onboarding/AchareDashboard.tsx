import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareDashboardSetupMutation } from '@/onboarding/hooks/useCompleteAchareDashboardSetupMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { IconCheck } from 'twenty-ui/icon';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledDashboardCard = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledCheckIcon = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.success};
  border-radius: 50%;
  display: flex;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

const StyledDashboardName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledDashboardDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

export const AchareDashboard = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeDashboardSetup] = useCompleteAchareDashboardSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const dashboards = [
    {
      name: t`Management Dashboard`,
      description: t`Overview of clients, deals, requirements, employees, and payroll status.`,
    },
    {
      name: t`BDE Dashboard`,
      description: t`Clients, deals, requirements, payments, and follow-ups.`,
    },
    {
      name: t`HR Dashboard`,
      description: t`Open requirements, candidate pipeline, interviews, employees, attendance, and payroll.`,
    },
    {
      name: t`Recruiter Dashboard`,
      description: t`Assigned requirements, candidates, submissions, and interviews.`,
    },
  ];

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeDashboardSetup({
        variables: {
          input: {
            provisionDefaults: true,
            dashboardTypes: ['Management', 'BDE', 'HR', 'Recruiter'],
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
  }, [completeDashboardSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Dashboard Setup`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`We'll provision dashboards for each role in your agency.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          {dashboards.map((dashboard) => (
            <StyledDashboardCard key={dashboard.name}>
              <StyledCheckIcon>
                <IconCheck size={14} color={themeCssVariables.font.color.primary} />
              </StyledCheckIcon>
              <div>
                <StyledDashboardName>{dashboard.name}</StyledDashboardName>
                <StyledDashboardDescription>
                  {dashboard.description}
                </StyledDashboardDescription>
              </div>
            </StyledDashboardCard>
          ))}
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
