import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useCompleteAchareBasicSetupMutation } from '@/onboarding/hooks/useCompleteAchareBasicSetupMutation';
import { useUpdateWorkspaceMemberSettings } from '@/settings/profile/hooks/useUpdateWorkspaceMemberSettings';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextInput } from '@/ui/input/components/TextInput';
import { Select } from '@/ui/input/components/Select';
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
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { z } from 'zod';

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  max-width: 100%;
  padding-bottom: ${themeCssVariables.spacing[4]};
  width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
`;

const StyledRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const StyledField = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  max-width: 100%;
  width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
`;

const countryOptions = [
  { label: 'India', value: 'India' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'UAE', value: 'UAE' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Other', value: 'Other' },
];

const currencyOptions = [
  { label: 'INR', value: 'INR' },
  { label: 'USD', value: 'USD' },
  { label: 'GBP', value: 'GBP' },
  { label: 'AED', value: 'AED' },
  { label: 'SGD', value: 'SGD' },
];

const timezoneOptions = [
  { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Asia/Dubai', value: 'Asia/Dubai' },
  { label: 'Asia/Singapore', value: 'Asia/Singapore' },
];

const validationSchema = z.object({
  agencyName: z.string().min(1, { error: i18n._(msg`Agency name is required`) }),
  country: z.string().min(1, { error: i18n._(msg`Country is required`) }),
  timezone: z.string().min(1, { error: i18n._(msg`Timezone is required`) }),
  currency: z.string().min(1, { error: i18n._(msg`Currency is required`) }),
  firstName: z.string().min(1, { error: i18n._(msg`First name is required`) }),
  lastName: z.string().min(1, { error: i18n._(msg`Last name is required`) }),
});

type Form = z.infer<typeof validationSchema>;

export const AchareBasicSetup = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeBasicSetup] = useCompleteAchareBasicSetupMutation();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const setCurrentUser = useSetAtomState(currentUserState);
  const { updateWorkspaceMemberSettings } = useUpdateWorkspaceMemberSettings();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      agencyName: '',
      country: 'India',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      firstName: currentWorkspaceMember?.name?.firstName ?? '',
      lastName: currentWorkspaceMember?.name?.lastName ?? '',
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      try {
        if (currentWorkspaceMember?.id) {
          await updateWorkspaceMemberSettings({
            workspaceMemberId: currentWorkspaceMember.id,
            update: {
              name: {
                firstName: data.firstName,
                lastName: data.lastName,
              },
            },
          });

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
        }

        await completeBasicSetup({
          variables: {
            input: {
              agencyName: data.agencyName,
              country: data.country,
              timezone: data.timezone,
              currency: data.currency,
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        });

        setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
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
      completeBasicSetup,
      setNextOnboardingStatus,
      enqueueErrorSnackBar,
      setCurrentUser,
      updateWorkspaceMemberSettings,
    ],
  );

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>
            {t`Basic Setup`}
          </StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`Tell us about your agency and yourself.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledForm>
          <Controller
            name="agencyName"
            control={control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <TextInput
                label={t`Agency / Company Name`}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder={t`ABC Recruitment`}
                error={error?.message}
                fullWidth
              />
            )}
          />

          <StyledRow>
            <StyledField>
              <Controller
                name="country"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Select
                      label={t`Country`}
                      value={value}
                      onChange={onChange}
                      options={countryOptions}
                      fullWidth
                      dropdownId="achare-country-select"
                    />
                    {error?.message && <span>{error.message}</span>}
                  </>
                )}
              />
            </StyledField>
            <StyledField>
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Select
                      label={t`Currency`}
                      value={value}
                      onChange={onChange}
                      options={currencyOptions}
                      fullWidth
                      dropdownId="achare-currency-select"
                    />
                    {error?.message && <span>{error.message}</span>}
                  </>
                )}
              />
            </StyledField>
          </StyledRow>

          <Controller
            name="timezone"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Select
                  label={t`Timezone`}
                  value={value}
                  onChange={onChange}
                  options={timezoneOptions}
                  fullWidth
                  dropdownId="achare-timezone-select"
                />
                {error?.message && <span>{error.message}</span>}
              </>
            )}
          />

          <StyledRow>
            <StyledField>
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TextInput
                    label={t`First Name`}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error?.message}
                    fullWidth
                  />
                )}
              />
            </StyledField>
            <StyledField>
              <Controller
                name="lastName"
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TextInput
                    label={t`Last Name`}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error?.message}
                    fullWidth
                  />
                )}
              />
            </StyledField>
          </StyledRow>
        </StyledForm>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledButtonContainer>
          <MainButton
            title={t`Continue`}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting || isNavigating}
            fullWidth
          />
        </StyledButtonContainer>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
