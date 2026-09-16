import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { AchareOptionChips } from '@/onboarding/components/AchareOptionChips';
import { useCompleteAchareHrSetupMutation } from '@/onboarding/hooks/useCompleteAchareHrSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { IconPlus, IconTrash } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type LeaveType = { name: string; daysPerYear: string };

const DEFAULT_LEAVE_TYPES: LeaveType[] = [
  { name: 'Casual Leave', daysPerYear: '12' },
  { name: 'Sick Leave', daysPerYear: '6' },
  { name: 'Paid Leave', daysPerYear: '0' },
  { name: 'Unpaid Leave', daysPerYear: '0' },
];

const DEFAULT_START_TIME = '09:30';
const DEFAULT_END_TIME = '18:30';

const StyledLeaveGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledLeaveHeader = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  display: grid;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: minmax(0, 1fr) 132px 28px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const StyledLeaveRow = styled.div`
  align-items: center;
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: minmax(0, 1fr) 132px 28px;
`;

const StyledRemoveButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;

  &:hover:not(:disabled) {
    color: ${themeCssVariables.color.red};
  }

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;

const StyledAddButton = styled.button`
  align-items: center;
  background: none;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  padding: ${themeCssVariables.spacing[3]};
  transition: all 0.15s ease;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const StyledHoursRow = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

/**
 * HR setup.
 *
 * Two questions the rest of HR depends on: which leave exists, and what a
 * normal week looks like. Leave rows are laid out as a table so the columns are
 * labelled once instead of repeated on every row.
 */
export const AchareHr = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeHrSetup] = useCompleteAchareHrSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const [leaveTypes, setLeaveTypes] =
    useState<LeaveType[]>(DEFAULT_LEAVE_TYPES);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [breakMinutes, setBreakMinutes] = useState('60');
  const [graceMinutes, setGraceMinutes] = useState('15');

  const updateLeaveType = (
    index: number,
    field: keyof LeaveType,
    value: string,
  ) => {
    setLeaveTypes((previous) =>
      previous.map((leaveType, candidateIndex) =>
        candidateIndex === index ? { ...leaveType, [field]: value } : leaveType,
      ),
    );
  };

  const addLeaveType = () => {
    setLeaveTypes((previous) => [...previous, { name: '', daysPerYear: '0' }]);
  };

  const removeLeaveType = (index: number) => {
    setLeaveTypes((previous) =>
      previous.filter((_, candidateIndex) => candidateIndex !== index),
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((candidate) => candidate !== day)
        : [...previous, day],
    );
  };

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeHrSetup({
        variables: {
          input: {
            leaveTypes: leaveTypes
              .filter((leaveType) => leaveType.name.trim().length > 0)
              .map((leaveType) => ({
                name: leaveType.name.trim(),
                daysPerYear: Number.parseInt(leaveType.daysPerYear, 10) || 0,
              })),
            shifts: [
              {
                name: 'General',
                startTime,
                endTime,
                breakMinutes: Number.parseInt(breakMinutes, 10) || 0,
                graceMinutes: Number.parseInt(graceMinutes, 10) || 0,
                workingDays: selectedDays,
              },
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
    leaveTypes,
    selectedDays,
    startTime,
    endTime,
    breakMinutes,
    graceMinutes,
    completeHrSetup,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  const handleSkip = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeHrSetup({
        variables: { input: { skipSetup: true } },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [completeHrSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <AchareOnboardingShell
      title={t`Leave and working hours`}
      subtitle={t`Set the leave your team can take and the hours they normally work. Attendance, leave balances and payroll all read from this.`}
      onContinue={handleContinue}
      onSkip={handleSkip}
      skipLabel={t`Set this up later`}
      isLoading={isNavigating}
      isContinueDisabled={selectedDays.length === 0}
      footnote={t`Leave types can be edited, and extra shifts added, from Settings once you are set up.`}
    >
      <AchareFieldGroup
        label={t`What leave can your team take?`}
        hint={t`These become the leave types your team picks from. Use 0 days for leave that is unlimited or unpaid.`}
      >
        <StyledLeaveGrid>
          <StyledLeaveHeader>
            <span>{t`Leave type`}</span>
            <span>{t`Days per year`}</span>
            <span />
          </StyledLeaveHeader>

          {leaveTypes.map((leaveType, index) => (
            <StyledLeaveRow key={index}>
              <TextInput
                value={leaveType.name}
                onChange={(value) => updateLeaveType(index, 'name', value)}
                placeholder={t`e.g. Casual Leave`}
                aria-label={t`Leave type name`}
                fullWidth
                disabled={isNavigating}
              />
              <TextInput
                type="number"
                min={0}
                value={leaveType.daysPerYear}
                onChange={(value) =>
                  updateLeaveType(index, 'daysPerYear', value)
                }
                aria-label={t`Days per year`}
                fullWidth
                disabled={isNavigating}
              />
              <StyledRemoveButton
                type="button"
                onClick={() => removeLeaveType(index)}
                disabled={isNavigating || leaveTypes.length <= 1}
                aria-label={t`Remove leave type`}
              >
                <IconTrash size={14} />
              </StyledRemoveButton>
            </StyledLeaveRow>
          ))}

          <StyledAddButton
            type="button"
            onClick={addLeaveType}
            disabled={isNavigating}
          >
            <IconPlus size={14} />
            {t`Add another leave type`}
          </StyledAddButton>
        </StyledLeaveGrid>
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Which days does your team work?`}
        hint={t`Used to work out attendance, leave and pro-rated salary.`}
        counter={t`${selectedDays.length} of ${DAY_OPTIONS.length} days`}
        error={
          selectedDays.length === 0
            ? t`Select at least one working day to continue.`
            : undefined
        }
      >
        <AchareOptionChips
          options={DAY_OPTIONS.map((day) => ({ value: day, label: day }))}
          selected={selectedDays}
          onToggle={toggleDay}
          disabled={isNavigating}
        />
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`What are the usual working hours?`}
        hint={t`This becomes your default shift. Grace is how many minutes late someone can be before it counts as late.`}
      >
        <StyledHoursRow>
          <TextInput
            type="time"
            label={t`Start`}
            value={startTime}
            onChange={setStartTime}
            fullWidth
            disabled={isNavigating}
          />
          <TextInput
            type="time"
            label={t`End`}
            value={endTime}
            onChange={setEndTime}
            fullWidth
            disabled={isNavigating}
          />
          <TextInput
            type="number"
            min={0}
            label={t`Break (min)`}
            value={breakMinutes}
            onChange={setBreakMinutes}
            fullWidth
            disabled={isNavigating}
          />
          <TextInput
            type="number"
            min={0}
            label={t`Grace (min)`}
            value={graceMinutes}
            onChange={setGraceMinutes}
            fullWidth
            disabled={isNavigating}
          />
        </StyledHoursRow>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
