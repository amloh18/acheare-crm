import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceMembersState } from '@/auth/states/currentWorkspaceMembersState';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { OnboardingProfilePictureUploader } from '@/onboarding/components/OnboardingProfilePictureUploader';
import { usePrefetchInviteSuggestions } from '@/onboarding/hooks/usePrefetchInviteSuggestions';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useUpdateWorkspaceMemberSettings } from '@/settings/profile/hooks/useUpdateWorkspaceMemberSettings';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { styled } from '@linaria/react';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { z } from 'zod';

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  max-width: 100%;
  width: 100%;
`;

const StyledNameRow = styled.div`
  align-items: flex-end;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledNameField = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

const StyledProfileSection = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const firstNameErrorMessage = msg`First name is required`;
const lastNameErrorMessage = msg`Last name is required`;

const validationSchema = z.object({
  firstName: z.string().min(1, {
    error: i18n._(firstNameErrorMessage),
  }),
  lastName: z.string().min(1, {
    error: i18n._(lastNameErrorMessage),
  }),
  jobTitle: z.string(),
});

type Form = z.infer<typeof validationSchema>;

export const CreateProfile = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();

  usePrefetchInviteSuggestions();

  const { enqueueErrorSnackBar } = useSnackBar();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const setCurrentUser = useSetAtomState(currentUserState);
  const setCurrentWorkspaceMembers = useSetAtomState(
    currentWorkspaceMembersState,
  );
  const { updateWorkspaceMemberSettings } = useUpdateWorkspaceMemberSettings();

  const [isNavigating, setIsNavigating] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      firstName: currentWorkspaceMember?.name?.firstName ?? '',
      lastName: currentWorkspaceMember?.name?.lastName ?? '',
      jobTitle: currentWorkspaceMember?.jobTitle ?? '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      try {
        if (!currentWorkspaceMember?.id) {
          throw new Error('User is not logged in');
        }
        if (!data.firstName || !data.lastName) {
          throw new Error('First name or last name is missing');
        }

        await updateWorkspaceMemberSettings({
          workspaceMemberId: currentWorkspaceMember.id,
          update: {
            name: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
            jobTitle: data.jobTitle,
            colorScheme: 'System',
          },
        });

        setCurrentWorkspaceMembers((members) =>
          members.map((member) =>
            member.id === currentWorkspaceMember?.id
              ? {
                  ...member,
                  name: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                  },
                  jobTitle: data.jobTitle,
                  colorScheme: 'System',
                }
              : member,
          ),
        );

        setCurrentUser((current) => {
          if (isDefined(current)) {
            return {
              ...current,
              firstName: data.firstName,
              lastName: data.lastName,
            };
          }
          return current;
        });

        setNextOnboardingStatus({ stepHistoryEffect: 'recordAsReversible' });
        setIsNavigating(true);
      } catch (error: any) {
        setIsNavigating(false);
        enqueueErrorSnackBar({
          apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
        });
      }
    },
    [
      currentWorkspaceMember?.id,
      setNextOnboardingStatus,
      enqueueErrorSnackBar,
      setCurrentWorkspaceMembers,
      setCurrentUser,
      updateWorkspaceMemberSettings,
    ],
  );

  return (
    <AchareOnboardingShell
      title={t`Your profile`}
      subtitle={t`This is how your team will see you.`}
      onContinue={handleSubmit(onSubmit)}
      isLoading={isNavigating}
      isContinueDisabled={!isValid || isSubmitting}
      hideBack
      footnote={t`You can update your profile anytime from Settings.`}
    >
      <StyledForm>
        <StyledProfileSection>
          {isDefined(currentWorkspaceMember?.id) && (
            <OnboardingProfilePictureUploader
              workspaceMemberId={currentWorkspaceMember.id}
            />
          )}
        </StyledProfileSection>

        <StyledNameRow>
          <StyledNameField>
            <Controller
              name="firstName"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  autoFocus
                  label={t`First name`}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={t`John`}
                  error={error?.message}
                  fullWidth
                />
              )}
            />
          </StyledNameField>
          <StyledNameField>
            <Controller
              name="lastName"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label={t`Last name`}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder={t`Smith`}
                  error={error?.message}
                  fullWidth
                />
              )}
            />
          </StyledNameField>
        </StyledNameRow>

        <Controller
          name="jobTitle"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t`Job title`}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={t`e.g. Recruitment Manager`}
              fullWidth
            />
          )}
        />
      </StyledForm>
    </AchareOnboardingShell>
  );
};
