import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAcharePayrollSetupMutation } from '@/onboarding/hooks/useCompleteAcharePayrollSetupMutation';
import { Select } from '@/ui/input/components/Select';
import { Checkbox } from 'twenty-ui/input';
import { IconPlus, IconTrash } from 'twenty-ui/icon';
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

const StyledInfoBox = styled.div`
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledCheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const CURRENCY_OPTIONS = [
  { label: 'INR', value: 'INR' },
  { label: 'USD', value: 'USD' },
  { label: 'GBP', value: 'GBP' },
];

const CYCLE_OPTIONS = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Bi-Weekly', value: 'Bi-Weekly' },
  { label: 'Weekly', value: 'Weekly' },
];

const PRORATION_OPTIONS = [
  { label: 'Working Days', value: 'Working Days' },
  { label: 'Calendar Days', value: 'Calendar Days' },
];

const DEFAULT_COMPONENTS = [
  { name: 'Basic', type: 'earning', enabled: true },
  { name: 'HRA', type: 'earning', enabled: true },
  { name: 'Conveyance', type: 'earning', enabled: true },
  { name: 'Special Allowance', type: 'earning', enabled: true },
  { name: 'Bonus', type: 'earning', enabled: false },
  { name: 'Overtime', type: 'earning', enabled: false },
  { name: 'Other Deduction', type: 'deduction', enabled: false },
];

export const AcharePayroll = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completePayrollSetup] = useCompleteAcharePayrollSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [cycle, setCycle] = useState('Monthly');
  const [proration, setProration] = useState('Working Days');
  const [overtimeEnabled, setOvertimeEnabled] = useState(true);
  const [components, setComponents] = useState(DEFAULT_COMPONENTS);

  const toggleComponent = (index: number) => {
    setComponents((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, enabled: !c.enabled } : c,
      ),
    );
  };

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completePayrollSetup({
        variables: {
          input: {
            currency,
            payrollCycle: cycle,
            prorationMethod: proration,
            overtimeEnabled,
            salaryComponents: components
              .filter((c) => c.enabled)
              .map((c) => ({
                name: c.name,
                type: c.type,
                taxable: true,
              })),
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
    currency,
    cycle,
    proration,
    overtimeEnabled,
    components,
    completePayrollSetup,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  const handleSkip = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completePayrollSetup({
        variables: { input: { skipSetup: true } },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch {
      setIsNavigating(false);
    }
  }, [completePayrollSetup, setNextOnboardingStatus]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Payroll Setup`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Configure payroll cycle, currency, and salary components.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          <StyledSection>
            <StyledSectionTitle>{t`Payroll Settings`}</StyledSectionTitle>
            <Select
              dropdownId="achare-payroll-select-1"
              label={t`Currency`}
              value={currency}
              onChange={setCurrency}
              options={CURRENCY_OPTIONS}
              fullWidth
            />
            <Select
              dropdownId="achare-payroll-select-2"
              label={t`Payroll Cycle`}
              value={cycle}
              onChange={setCycle}
              options={CYCLE_OPTIONS}
              fullWidth
            />
            <Select
              dropdownId="achare-payroll-select-3"
              label={t`Proration Method`}
              value={proration}
              onChange={setProration}
              options={PRORATION_OPTIONS}
              fullWidth
            />
            <Checkbox
              checked={overtimeEnabled}
              onChange={() => setOvertimeEnabled(!overtimeEnabled)}
              aria-label={t`Enable Overtime (1.5x multiplier)`}
            />
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>{t`Salary Components`}</StyledSectionTitle>
            <StyledCheckboxRow>
              {components.map((comp, index) => (
                <Checkbox
                  key={comp.name}
                  checked={comp.enabled}
                  onChange={() => toggleComponent(index)}
                  aria-label={`${comp.name} (${comp.type})`}
                />
              ))}
            </StyledCheckboxRow>
          </StyledSection>

          <StyledInfoBox>
            {t`When an employee has unpaid leave or joins/leaves during a month, Achare uses your selected proration method to determine payable salary. You can change this later in Payroll Settings.`}
          </StyledInfoBox>
        </StyledContent>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledButtonRow>
          <MainButton
            title={t`Skip for now`}
            onClick={handleSkip}
            disabled={isNavigating}
            fullWidth
            variant="secondary"
          />
          <MainButton
            title={t`Continue`}
            onClick={handleContinue}
            disabled={isNavigating}
            fullWidth
          />
        </StyledButtonRow>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
