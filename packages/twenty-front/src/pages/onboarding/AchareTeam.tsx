import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { useCompleteAchareTeamSetupMutation } from '@/onboarding/hooks/useCompleteAchareTeamSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { IconInfoCircle, IconPlus, IconTrash } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

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

const StyledMemberGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledMemberHeader = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  display: grid;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns:
    minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr)
    140px 28px;

  @media (max-width: 760px) {
    display: none;
  }
`;

const StyledMemberRow = styled.div`
  align-items: center;
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns:
    minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr)
    140px 28px;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
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
    setMembers((previous) =>
      previous.map((member, candidateIndex) =>
        candidateIndex === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  const addMember = () => {
    setMembers((previous) => [...previous, { ...emptyMember }]);
  };

  const removeMember = (index: number) => {
    setMembers((previous) =>
      previous.filter((_, candidateIndex) => candidateIndex !== index),
    );
  };

  const submitMembers = useCallback(
    async (membersToSend: TeamMember[]) => {
      setIsNavigating(true);
      try {
        await completeTeamSetup({
          variables: {
            input: {
              members: membersToSend,
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
    },
    [completeTeamSetup, setNextOnboardingStatus, enqueueErrorSnackBar],
  );

  const handleContinue = useCallback(() => {
    // Rows the user left half-filled are dropped rather than sent as broken
    // invites; the field group tells them which fields are required.
    void submitMembers(
      members.filter(
        (member) =>
          member.firstName.trim().length > 0 && member.email.trim().length > 0,
      ),
    );
  }, [members, submitMembers]);

  const handleSkip = useCallback(() => {
    void submitMembers([]);
  }, [submitMembers]);

  const incompleteCount = members.filter(
    (member) =>
      (member.firstName.trim().length > 0 || member.email.trim().length > 0) &&
      !(member.firstName.trim().length > 0 && member.email.trim().length > 0),
  ).length;

  return (
    <AchareOnboardingShell
      title={t`Who else is on your team?`}
      subtitle={t`Invite the people who will use Achare. Each one gets an email and lands in the role you pick, with the right access from day one.`}
      onContinue={handleContinue}
      onSkip={handleSkip}
      skipLabel={t`Invite them later`}
      isLoading={isNavigating}
      footnote={t`Roles decide what someone can see. You can change a person's role any time from Settings → Members.`}
    >
      <AchareFieldGroup
        label={t`Team members`}
        hint={t`First name and email are required. Last name is optional.`}
        counter={t`${members.length} rows`}
        error={
          incompleteCount > 0
            ? t`${incompleteCount} row(s) are missing a first name or email and will not be invited.`
            : undefined
        }
      >
        <StyledMemberGrid>
          <StyledMemberHeader>
            <span>{t`First name`}</span>
            <span>{t`Last name`}</span>
            <span>{t`Email`}</span>
            <span>{t`Role`}</span>
            <span />
          </StyledMemberHeader>

          {members.map((member, index) => (
            <StyledMemberRow key={index}>
              <TextInput
                value={member.firstName}
                onChange={(value) => updateMember(index, 'firstName', value)}
                placeholder={t`Rahul`}
                aria-label={t`First name`}
                fullWidth
                disabled={isNavigating}
              />
              <TextInput
                value={member.lastName}
                onChange={(value) => updateMember(index, 'lastName', value)}
                placeholder={t`Sharma`}
                aria-label={t`Last name`}
                fullWidth
                disabled={isNavigating}
              />
              <TextInput
                type="email"
                value={member.email}
                onChange={(value) => updateMember(index, 'email', value)}
                placeholder={t`rahul@example.com`}
                aria-label={t`Email`}
                fullWidth
                disabled={isNavigating}
              />
              <Select
                dropdownId={`achare-team-role-${index}`}
                value={member.role}
                onChange={(value) => updateMember(index, 'role', value)}
                options={ROLE_OPTIONS}
                fullWidth
              />
              <StyledRemoveButton
                type="button"
                onClick={() => removeMember(index)}
                disabled={isNavigating || members.length <= 1}
                aria-label={t`Remove team member`}
              >
                <IconTrash size={14} />
              </StyledRemoveButton>
            </StyledMemberRow>
          ))}

          <StyledAddButton
            type="button"
            onClick={addMember}
            disabled={isNavigating}
          >
            <IconPlus size={14} />
            {t`Add another person`}
          </StyledAddButton>
        </StyledMemberGrid>

        <AchareNote
          tone="info"
          icon={
            <IconInfoCircle
              size={14}
              color={themeCssVariables.font.color.tertiary}
            />
          }
        >
          {t`Recruiters only see the requirements and candidates assigned to them. Admins see everything.`}
        </AchareNote>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
