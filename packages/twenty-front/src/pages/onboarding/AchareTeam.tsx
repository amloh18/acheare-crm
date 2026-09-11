import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareTeamSetupMutation } from '@/onboarding/hooks/useCompleteAchareTeamSetupMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { Select } from '@/ui/input/components/Select';
import { IconPlus, IconTrash } from '@tabler/icons-react';
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

const StyledMemberRow = styled.div`
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
  transition: color 0.15s ease;

  &:hover {
    color: ${themeCssVariables.color.red};
  }
`;

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'Admin' },
  { label: 'BDE', value: 'BDE' },
  { label: 'HR', value: 'HR' },
  { label: 'Recruiter', value: 'Recruiter' },
];

interface TeamMember {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const emptyMember: TeamMember = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'Recruiter',
};

export const AchareTeam = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeTeamSetup] = useCompleteAchareTeamSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([{ ...emptyMember }]);

  const updateMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { ...emptyMember }]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      const validMembers = members.filter(
        (m) => m.firstName && m.email,
      );

      await completeTeamSetup({
        variables: {
          input: {
            members: validMembers,
          },
        },
      });
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error: any) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [members, completeTeamSetup, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Invite Your Team`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Add team members and assign their roles. You can skip this and add them later.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          {members.map((member, index) => (
            <StyledMemberRow key={index}>
              <StyledField>
                <TextInput
                  label={t`First Name`}
                  value={member.firstName}
                  onChange={(e) => updateMember(index, 'firstName', e)}
                  placeholder={t`Rahul`}
                  fullWidth
                />
              </StyledField>
              <StyledField>
                <TextInput
                  label={t`Last Name`}
                  value={member.lastName}
                  onChange={(e) => updateMember(index, 'lastName', e)}
                  placeholder={t`Sharma`}
                  fullWidth
                />
              </StyledField>
              <StyledField>
                <TextInput
                  label={t`Email`}
                  value={member.email}
                  onChange={(e) => updateMember(index, 'email', e)}
                  placeholder={t`rahul@example.com`}
                  fullWidth
                />
              </StyledField>
              <StyledField>
                <Select
                  dropdownId={`achare-team-role-${index}`}
                  label={t`Role`}
                  value={member.role}
                  onChange={(e) => updateMember(index, 'role', e)}
                  options={ROLE_OPTIONS}
                  fullWidth
                />
              </StyledField>
              {members.length > 1 && (
                <StyledRemoveButton onClick={() => removeMember(index)}>
                  <IconTrash size={16} />
                </StyledRemoveButton>
              )}
            </StyledMemberRow>
          ))}

          <StyledAddButton onClick={addMember}>
            <IconPlus size={16} />
            {t`Add another`}
          </StyledAddButton>
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
