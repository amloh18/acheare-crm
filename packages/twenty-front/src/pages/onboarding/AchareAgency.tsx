import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { AchareOptionChips } from '@/onboarding/components/AchareOptionChips';
import { useCompleteAchareAgencySetupMutation } from '@/onboarding/hooks/useCompleteAchareAgencySetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useMemo, useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEPARTMENT_OPTIONS = [
  'Management',
  'BDE',
  'HR',
  'Recruitment',
  'Finance',
  'Operations',
];

const WEEKDAY_PRESETS: { label: string; days: string[] }[] = [
  { label: 'Mon – Fri', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { label: 'Mon – Sat', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { label: 'All week', days: DAY_OPTIONS },
];

const StyledQuickRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledQuickLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

const StyledQuickButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding: 0;
  text-decoration: underline;
  text-decoration-color: ${themeCssVariables.border.color.medium};
  text-underline-offset: 3px;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

const isSameSet = (first: string[], second: string[]) =>
  first.length === second.length &&
  second.every((value) => first.includes(value));

export const AchareAgency = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeAgencySetup] = useCompleteAchareAgencySetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const [selectedDays, setSelectedDays] = useState<string[]>(
    WEEKDAY_PRESETS[0].days,
  );
  const [selectedDepartments, setSelectedDepartments] =
    useState<string[]>(DEPARTMENT_OPTIONS);

  const hasNoWorkingDay = selectedDays.length === 0;

  const activeDayPreset = useMemo(
    () =>
      WEEKDAY_PRESETS.find((preset) => isSameSet(preset.days, selectedDays))
        ?.label,
    [selectedDays],
  );

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((candidate) => candidate !== day)
        : [...previous, day],
    );
  }, []);

  const toggleDepartment = useCallback((department: string) => {
    setSelectedDepartments((previous) =>
      previous.includes(department)
        ? previous.filter((candidate) => candidate !== department)
        : [...previous, department],
    );
  }, []);

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeAgencySetup({
        variables: {
          input: {
            workingDays: selectedDays,
            departments: selectedDepartments,
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
    selectedDays,
    selectedDepartments,
    completeAgencySetup,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  return (
    <AchareOnboardingShell
      title={t`How does your agency work?`}
      subtitle={t`Achare uses your working week for attendance, leave and rosters, and your departments to organise your team.`}
      onContinue={handleContinue}
      isLoading={isNavigating}
      isContinueDisabled={hasNoWorkingDay}
      footnote={t`You can change working days, hours and departments at any time from Settings.`}
    >
      <AchareFieldGroup
        label={t`Which days does your team work?`}
        hint={t`Pick every day that counts as a working day. Saturdays and Sundays are usually off.`}
        counter={t`${selectedDays.length} of ${DAY_OPTIONS.length} days`}
        error={
          hasNoWorkingDay
            ? t`Select at least one working day to continue.`
            : undefined
        }
      >
        <StyledQuickRow>
          <StyledQuickLabel>{t`Quick pick:`}</StyledQuickLabel>
          {WEEKDAY_PRESETS.map((preset) => (
            <StyledQuickButton
              key={preset.label}
              type="button"
              isActive={activeDayPreset === preset.label}
              onClick={() => setSelectedDays(preset.days)}
              disabled={isNavigating}
            >
              {preset.label}
            </StyledQuickButton>
          ))}
        </StyledQuickRow>
        <AchareOptionChips
          options={toOptions(DAY_OPTIONS)}
          selected={selectedDays}
          onToggle={toggleDay}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Which departments do you have?`}
        hint={t`We have pre-selected the usual agency departments. Turn off the ones you do not use — you can add more later.`}
        counter={t`${selectedDepartments.length} selected`}
      >
        <AchareOptionChips
          options={toOptions(DEPARTMENT_OPTIONS)}
          selected={selectedDepartments}
          onToggle={toggleDepartment}
          disabled={isNavigating}
        />
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
