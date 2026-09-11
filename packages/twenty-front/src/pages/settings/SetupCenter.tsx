import { useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { useAchareSetupProgressQuery } from '@/onboarding/hooks/useAchareSetupProgressQuery';
import type { AchareSetupStepStatus } from '~/generated-metadata/graphql';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconCheck, IconCircle, IconClock } from 'twenty-ui/icon';
import { H2Title } from 'twenty-ui/typography';
import { Section } from 'twenty-ui/layout';

const STEP_LABELS: Record<string, string> = {
  WELCOME: 'Welcome',
  BASIC_SETUP: 'Basic Setup',
  SETUP_CHOICE: 'Setup Mode',
  AGENCY: 'Agency',
  TEAM: 'Team',
  CRM_IMPORT: 'CRM Import',
  RECRUITMENT: 'Recruitment',
  HR: 'HR',
  PAYROLL: 'Payroll',
  DASHBOARD: 'Dashboard',
  REVIEW: 'Review',
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  WELCOME: 'Get started with Achare',
  BASIC_SETUP: 'Agency profile and admin account',
  SETUP_CHOICE: 'Guided or manual setup',
  AGENCY: 'Working days and departments',
  TEAM: 'Invite team members',
  CRM_IMPORT: 'Import companies and contacts',
  RECRUITMENT: 'Candidate sources and pipeline',
  HR: 'Leave types and shifts',
  PAYROLL: 'Payroll configuration',
  DASHBOARD: 'Role-based dashboards',
  REVIEW: 'Final review and finish',
};

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div<{ status: string }>`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
  }
`;

const StyledStatusIcon = styled.div<{ status: string }>`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
  flex-shrink: 0;

  background: ${(props) =>
    props.status === 'COMPLETED'
      ? themeCssVariables.background.transparent.success
      : props.status === 'IN_PROGRESS'
        ? themeCssVariables.background.transparent.orange
        : themeCssVariables.background.secondary};
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  flex: 1;
`;

const StyledCardLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledCardDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const ALL_STEPS = [
  'WELCOME',
  'BASIC_SETUP',
  'SETUP_CHOICE',
  'AGENCY',
  'TEAM',
  'CRM_IMPORT',
  'RECRUITMENT',
  'HR',
  'PAYROLL',
  'DASHBOARD',
  'REVIEW',
];

const getStatusIcon = (status: AchareSetupStepStatus['status']) => {
  switch (status) {
    case 'COMPLETED':
      return <IconCheck size={16} color={themeCssVariables.color.green} />;
    case 'IN_PROGRESS':
      return (
        <IconClock size={16} color={themeCssVariables.color.yellow} />
      );
    case 'SKIPPED':
      return (
        <IconCheck size={16} color={themeCssVariables.font.color.tertiary} />
      );
    default:
      return (
        <IconCircle size={16} color={themeCssVariables.font.color.tertiary} />
      );
  }
};

export const SetupCenter = () => {
  const { t } = useLingui();
  const { data, loading } = useAchareSetupProgressQuery();

  const stepStatuses = data?.acheareSetupProgress?.stepStatuses ?? [];

  const stepsToShow = ALL_STEPS.map((step) => {
    const found = stepStatuses.find((s) => s.step === step);
    return {
      step,
      label: STEP_LABELS[step] ?? step,
      description: STEP_DESCRIPTIONS[step] ?? '',
      status: found?.status ?? ('NOT_STARTED' as const),
    };
  });

  return (
    <SettingsPageLayout
      title={t`Setup Center`}
      links={[{ children: t`Workspace` }, { children: t`Setup Center` }]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Setup Progress`}
            description={t`Complete your workspace configuration.`}
          />
          <StyledSection>
            {loading && (
              <StyledEmptyState>{t`Loading setup progress...`}</StyledEmptyState>
            )}
            {!loading && stepsToShow.length === 0 && (
              <StyledEmptyState>
                {t`Setup has not been started yet.`}
              </StyledEmptyState>
            )}
            {stepsToShow.map((item) => (
              <StyledCard key={item.step} status={item.status}>
                <StyledStatusIcon status={item.status}>
                  {getStatusIcon(item.status)}
                </StyledStatusIcon>
                <StyledCardContent>
                  <StyledCardLabel>{item.label}</StyledCardLabel>
                  <StyledCardDescription>
                    {item.description}
                  </StyledCardDescription>
                </StyledCardContent>
              </StyledCard>
            ))}
          </StyledSection>
        </Section>
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
