import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareHrSetupMutation } from '@/onboarding/hooks/useCompleteAchareHrSetupMutation';
import { Checkbox } from 'twenty-ui/input';
import { TextInput } from '@/ui/input/components/TextInput';
import { IconPlus, IconTrash } from '@tabler/icons-react';
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

const StyledLeaveRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  align-items: flex-end;
`;

const StyledField = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledAddButton = styled.button`
  align-items: center;
  background: none;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  width: 100%;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledRemoveButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;

  &:hover {
    color: ${themeCssVariables.color.red};
  }
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const DEFAULT_LEAVE_TYPES = [
  { name: 'Casual Leave', daysPerYear: 12 },
  { name: 'Sick Leave', daysPerYear: 6 },
  { name: 'Paid Leave', daysPerYear: 0 },
  { name: 'Unpaid Leave', daysPerYear: 0 },
];

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AchareHr = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeHrSetup] = useCompleteAchareHrSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState(DEFAULT_LEAVE_TYPES);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);

  const updateLeaveType = (
    index: number,
    field: 'name' | 'daysPerYear',
    value: string | number,
  ) => {
    setLeaveTypes((prev) =>
      prev.map((lt, i) => (i === index ? { ...lt, [field]: value } : lt)),
    );
  };

  const addLeaveType = () => {
    setLeaveTypes((prev) => [...prev, { name: '', daysPerYear: 0 }]);
  };

  const removeLeaveType = (index: number) => {
    setLeaveTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeHrSetup({
        variables: {
          input: {
            leaveTypes: leaveTypes.filter((lt) => lt.name),
            shifts: [
              {
                name: 'General',
                startTime: '09:30',
                endTime: '18:30',
                breakMinutes: 60,
                graceMinutes: 15,
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
    } catch {
      setIsNavigating(false);
    }
  }, [completeHrSetup, setNextOnboardingStatus]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>{t`HR Setup`}</StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Configure leave types and working schedule for your team.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          <StyledSection>
            <StyledSectionTitle>{t`Leave Types`}</StyledSectionTitle>
            {leaveTypes.map((lt, index) => (
              <StyledLeaveRow key={index}>
                <StyledField>
                  <TextInput
                    label={t`Name`}
                    value={lt.name}
                    onChange={(e) => updateLeaveType(index, 'name', e)}
                    fullWidth
                  />
                </StyledField>
                <StyledField>
                  <TextInput
                    label={t`Days/Year`}
                    value={String(lt.daysPerYear)}
                    onChange={(e) =>
                      updateLeaveType(
                        index,
                        'daysPerYear',
                        parseInt(e) || 0,
                      )
                    }
                    fullWidth
                  />
                </StyledField>
                {leaveTypes.length > 1 && (
                  <StyledRemoveButton onClick={() => removeLeaveType(index)}>
                    <IconTrash size={16} />
                  </StyledRemoveButton>
                )}
              </StyledLeaveRow>
            ))}
            <StyledAddButton onClick={addLeaveType}>
              <IconPlus size={16} />
              {t`Add Leave Type`}
            </StyledAddButton>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>{t`Working Days`}</StyledSectionTitle>
            <StyledCheckboxRow>
              {DAY_OPTIONS.map((day) => (
                <Checkbox
                  key={day}
                  checked={selectedDays.includes(day)}
                  onChange={() =>
                    setSelectedDays((prev) =>
                      prev.includes(day)
                        ? prev.filter((d) => d !== day)
                        : [...prev, day],
                    )
                  }
                  aria-label={day}
                />
              ))}
            </StyledCheckboxRow>
          </StyledSection>
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
