import { isDefined } from 'twenty-shared/utils';
import {
  ACHARE_MODULE_ONBOARDING_STEPS,
  ACHARE_ONBOARDING_LEADING_STEPS,
  ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS,
  ACHARE_ONBOARDING_TRAILING_STEPS,
  type AchareOnboardingStepKey,
} from 'twenty-shared/workspace';

import {
  type CurrentUser,
  currentUserState,
} from '@/auth/states/currentUserState';
import {
  type CurrentWorkspace,
  currentWorkspaceState,
} from '@/auth/states/currentWorkspaceState';
import { billingState } from '@/client-config/states/billingState';
import { isBookCallOnboardingStepEnabledState } from '@/client-config/states/isBookCallOnboardingStepEnabledState';
import { isOnboardingAiChatEnabledState } from '@/client-config/states/isOnboardingAiChatEnabledState';
import { isWelcomeAnimationVisibleState } from '@/onboarding/states/isWelcomeAnimationVisibleState';
import { onboardingNavigationDirectionState } from '@/onboarding/states/onboardingNavigationDirectionState';
import { shouldOpenAiChatAfterOnboardingState } from '@/onboarding/states/shouldOpenAiChatAfterOnboardingState';
import { getHasJustCompletedOnboarding } from '@/onboarding/utils/getHasJustCompletedOnboarding';
import { getIsBookCallOnboardingStepPending } from '@/onboarding/utils/getIsBookCallOnboardingStepPending';
import { getIsPlanRequired } from '@/onboarding/utils/getIsPlanRequired';
import { getNextPreviousOnboardingStatus } from '@/onboarding/utils/getNextPreviousOnboardingStatus';
import { type OnboardingStepHistoryEffect } from '@/onboarding/types/OnboardingStepHistoryEffect';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useAchareOnboardingSteps } from '@/workspace-feature/hooks/useAchareOnboardingSteps';

import { useStore } from 'jotai';
import { useCallback } from 'react';
import { OnboardingStatus } from '~/generated-metadata/graphql';

/**
 * Fallback used while the workspace's feature configuration is still loading.
 *
 * A workspace with no stored configuration is served exactly this list by the
 * server (the default enables every feature), so the fallback and the server
 * always agree.
 */
const DEFAULT_ACHARE_ONBOARDING_STEPS: AchareOnboardingStepKey[] = [
  ...ACHARE_ONBOARDING_LEADING_STEPS,
  ...ACHARE_MODULE_ONBOARDING_STEPS,
  ...ACHARE_ONBOARDING_TRAILING_STEPS,
];

const getAchareOnboardingStatuses = (
  steps: AchareOnboardingStepKey[] | undefined,
): string[] =>
  (steps ?? DEFAULT_ACHARE_ONBOARDING_STEPS).map(
    (step) => ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS[step],
  );

type GetNextOnboardingStatusArgs = {
  currentUser: CurrentUser | null;
  currentWorkspace: CurrentWorkspace | null;
  isBillingEnabled: boolean;
  isBookCallRequired: boolean;
  /** This workspace's generated wizard, derived from its enabled features. */
  achareOnboardingSteps?: AchareOnboardingStepKey[];
};

const getNextOnboardingStatus = ({
  currentUser,
  currentWorkspace,
  isBillingEnabled,
  isBookCallRequired,
  achareOnboardingSteps,
}: GetNextOnboardingStatusArgs) => {
  const isPlanRequired = getIsPlanRequired({
    isBillingEnabled,
    currentWorkspace,
  });

  const statusAfterBookCall = isPlanRequired
    ? OnboardingStatus.PLAN_REQUIRED
    : OnboardingStatus.COMPLETED;

  const statusAfterInviteTeam =
    isBookCallRequired && isPlanRequired
      ? OnboardingStatus.BOOK_CALL
      : statusAfterBookCall;

  const currentOnboardingStatus = currentUser?.onboardingStatus;

  // Workspace activation hands over to the Achare wizard.
  // CreateProfile comes first, then ACHARE_WELCOME.
  if (currentOnboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION) {
    return OnboardingStatus.PROFILE_CREATION;
  }

  // After profile creation, continue to Achare onboarding.
  if (currentOnboardingStatus === OnboardingStatus.PROFILE_CREATION) {
    return OnboardingStatus.ACHARE_WELCOME;
  }

  // Achare onboarding is generated per workspace, so "the next step" is a
  // lookup in *this* workspace's list rather than a fixed chain. Enabling or
  // disabling a module changes the wizard without changing this hook.
  // This applies to both live workspaces and demo workspaces.
  const achareOnboardingStatuses = getAchareOnboardingStatuses(
    achareOnboardingSteps,
  );
  const currentAchareStepIndex = achareOnboardingStatuses.indexOf(
    currentOnboardingStatus ?? '',
  );

  if (currentAchareStepIndex !== -1) {
    const nextAchareStatus =
      achareOnboardingStatuses[currentAchareStepIndex + 1];

    return (nextAchareStatus ?? OnboardingStatus.COMPLETED) as OnboardingStatus;
  }

  const isDemoWorkspace =
    currentWorkspace?.id === '20202020-1c25-4d02-bf25-6aeccf7ea419' ||
    currentWorkspace?.displayName?.toLowerCase() === 'apple';

  if (isDemoWorkspace) {
    if (currentOnboardingStatus === OnboardingStatus.SYNC_EMAIL) {
      if (currentWorkspace?.workspaceMembersCount === 1) {
        return OnboardingStatus.APPS_INSTALLATION;
      }
      return OnboardingStatus.PROFILE_CREATION;
    }

    if (currentOnboardingStatus === OnboardingStatus.APPS_INSTALLATION) {
      return OnboardingStatus.PROFILE_CREATION;
    }

    if (currentOnboardingStatus === OnboardingStatus.PROFILE_CREATION) {
      if (currentWorkspace?.workspaceMembersCount === 1) {
        return OnboardingStatus.INVITE_TEAM;
      }
      return statusAfterInviteTeam;
    }
    if (currentOnboardingStatus === OnboardingStatus.INVITE_TEAM) {
      return statusAfterInviteTeam;
    }
    if (
      currentOnboardingStatus === OnboardingStatus.BOOK_CALL ||
      currentOnboardingStatus === OnboardingStatus.PLAN_REQUIRED
    ) {
      return statusAfterBookCall;
    }
    return OnboardingStatus.COMPLETED;
  }

  if (currentOnboardingStatus === OnboardingStatus.PLAN_REQUIRED) {
    return statusAfterBookCall;
  }

  return OnboardingStatus.COMPLETED;
};

export const useSetNextOnboardingStatus = () => {
  const store = useStore();
  const currentUser = useAtomStateValue(currentUserState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const billing = useAtomStateValue(billingState);
  const isBillingEnabled = billing?.isBillingEnabled ?? false;
  const isOnboardingAiChatEnabled = useAtomStateValue(
    isOnboardingAiChatEnabledState,
  );
  const achareOnboardingSteps = useAchareOnboardingSteps();

  return useCallback(
    ({
      stepHistoryEffect,
    }: {
      stepHistoryEffect: OnboardingStepHistoryEffect;
    }) => {
      const nextOnboardingStatus = getNextOnboardingStatus({
        currentUser,
        currentWorkspace,
        isBillingEnabled,
        isBookCallRequired:
          store.get(isBookCallOnboardingStepEnabledState.atom) &&
          getIsBookCallOnboardingStepPending(store.get(currentUserState.atom)),
        achareOnboardingSteps,
      });

      store.set(onboardingNavigationDirectionState.atom, 'forward');
      store.set(currentUserState.atom, (current) => {
        if (isDefined(current)) {
          // The status is computed from the snapshot this callback closed over.
          // If the stored status has already moved on — the server advanced it,
          // or another step completed while this callback was in flight — do not
          // rewind it.
          if (current.onboardingStatus !== currentUser?.onboardingStatus) {
            return current;
          }

          return {
            ...current,
            onboardingStatus: nextOnboardingStatus,
            previousOnboardingStatus: getNextPreviousOnboardingStatus({
              stepHistoryEffect,
              currentOnboardingStatus: current.onboardingStatus,
              currentPreviousOnboardingStatus: current.previousOnboardingStatus,
            }),
          };
        }
        return current;
      });

      if (
        getHasJustCompletedOnboarding({
          previousOnboardingStatus: currentUser?.onboardingStatus,
          nextOnboardingStatus,
        })
      ) {
        store.set(isWelcomeAnimationVisibleState.atom, true);
        store.set(
          shouldOpenAiChatAfterOnboardingState.atom,
          isOnboardingAiChatEnabled && currentUser?.isWorkspaceCreator === true,
        );
      }
    },
    [
      currentUser,
      currentWorkspace,
      isBillingEnabled,
      isOnboardingAiChatEnabled,
      achareOnboardingSteps,
      store,
    ],
  );
};
