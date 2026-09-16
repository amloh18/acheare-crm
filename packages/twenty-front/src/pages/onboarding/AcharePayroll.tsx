import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { AchareOptionChips } from '@/onboarding/components/AchareOptionChips';
import {
  AchareSelectableCard,
  AchareSelectableCardGroup,
} from '@/onboarding/components/AchareSelectableCard';
import { useCompleteAcharePayrollSetupMutation } from '@/onboarding/hooks/useCompleteAcharePayrollSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { Select } from '@/ui/input/components/Select';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';
import { IconInfoCircle } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

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

const EARNING_COMPONENTS = [
  'Basic',
  'HRA',
  'Conveyance',
  'Special Allowance',
  'Bonus',
  'Overtime',
];

const DEDUCTION_COMPONENTS = [
  'Provident Fund',
  'Professional Tax',
  'Other Deduction',
];

const DEFAULT_EARNINGS = ['Basic', 'HRA', 'Conveyance', 'Special Allowance'];

const DEFAULT_DEDUCTIONS: string[] = [];

const StyledSettingsGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

/**
 * Payroll setup.
 *
 * The salary components used to be a row of unlabelled checkboxes with the
 * component name hidden in `aria-label`, so the screen showed nothing but blue
 * squares. They are now labelled chips split into earnings and deductions.
 */
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
  const [earnings, setEarnings] = useState<string[]>(DEFAULT_EARNINGS);
  const [deductions, setDeductions] = useState<string[]>(DEFAULT_DEDUCTIONS);

  const toggleValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((candidate) => candidate !== value)
        : [...previous, value],
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
            salaryComponents: [
              ...earnings.map((name) => ({
                name,
                type: 'earning',
                taxable: true,
              })),
              ...deductions.map((name) => ({
                name,
                type: 'deduction',
                taxable: false,
              })),
            ],
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
    earnings,
    deductions,
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
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completePayrollSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <AchareOnboardingShell
      title={t`How do you pay your team?`}
      subtitle={t`Set the pay cycle and the components Achare should use when it builds a payslip. You can adjust amounts per employee later.`}
      onContinue={handleContinue}
      onSkip={handleSkip}
      skipLabel={t`Set this up later`}
      isLoading={isNavigating}
      isContinueDisabled={earnings.length === 0}
      footnote={t`These are defaults for new employees — each person's actual salary is set on their employee record.`}
    >
      <AchareFieldGroup
        label={t`Payroll basics`}
        hint={t`Used on every payslip Achare generates for this workspace.`}
      >
        <StyledSettingsGrid>
          <Select
            dropdownId="achare-payroll-currency"
            label={t`Currency`}
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
            fullWidth
          />
          <Select
            dropdownId="achare-payroll-cycle"
            label={t`Pay cycle`}
            value={cycle}
            onChange={setCycle}
            options={CYCLE_OPTIONS}
            fullWidth
          />
          <Select
            dropdownId="achare-payroll-proration"
            label={t`Part-month salary`}
            value={proration}
            onChange={setProration}
            options={PRORATION_OPTIONS}
            fullWidth
          />
        </StyledSettingsGrid>
        <AchareNote
          tone="info"
          icon={
            <IconInfoCircle
              size={14}
              color={themeCssVariables.font.color.tertiary}
            />
          }
        >
          {t`Part-month salary decides what someone is paid when they join, leave or take unpaid leave mid-month — either by working days or by calendar days.`}
        </AchareNote>
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Earnings`}
        hint={t`Added to a salary before deductions. Turn off anything you do not pay.`}
        counter={t`${earnings.length} selected`}
        error={
          earnings.length === 0
            ? t`Keep at least one earning component, otherwise a payslip has nothing to pay.`
            : undefined
        }
      >
        <AchareOptionChips
          options={toOptions(EARNING_COMPONENTS)}
          selected={earnings}
          onToggle={(value) => toggleValue(value, setEarnings)}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Deductions`}
        hint={t`Taken off a salary. Leave these off if you handle them outside Achare.`}
        counter={t`${deductions.length} selected`}
      >
        <AchareOptionChips
          options={toOptions(DEDUCTION_COMPONENTS)}
          selected={deductions}
          onToggle={(value) => toggleValue(value, setDeductions)}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      <AchareFieldGroup label={t`Overtime`}>
        <AchareSelectableCardGroup>
          <AchareSelectableCard
            title={t`Pay overtime at 1.5x the hourly rate`}
            description={t`Adds an overtime line to the payslip when someone works more than their shift.`}
            isSelected={overtimeEnabled}
            onClick={() => setOvertimeEnabled(!overtimeEnabled)}
            disabled={isNavigating}
          />
        </AchareSelectableCardGroup>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
