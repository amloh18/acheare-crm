import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import {
  AchareSelectableCard,
  AchareSelectableCardGroup,
} from '@/onboarding/components/AchareSelectableCard';
import { useCompleteAchareDashboardSetupMutation } from '@/onboarding/hooks/useCompleteAchareDashboardSetupMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useMemo, useState } from 'react';

type DashboardOption = {
  value: string;
  name: string;
  description: string;
};

const DASHBOARD_OPTIONS: DashboardOption[] = [
  {
    value: 'Management',
    name: 'Management Dashboard',
    description:
      'Overview of clients, deals, requirements, employees and payroll status.',
  },
  {
    value: 'BDE',
    name: 'BDE Dashboard',
    description: 'Clients, deals, requirements, payments and follow-ups.',
  },
  {
    value: 'HR',
    name: 'HR Dashboard',
    description:
      'Open requirements, candidate pipeline, interviews, employees, attendance and payroll.',
  },
  {
    value: 'Recruiter',
    name: 'Recruiter Dashboard',
    description:
      'Assigned requirements, candidates, submissions and interviews.',
  },
];

const DEFAULT_SELECTION = DASHBOARD_OPTIONS.map((option) => option.value);

/**
 * Dashboard provisioning step.
 *
 * The cards used to be a read-only list with a tick on each one, which implied
 * the user had chosen them. They are real toggles now, and the selection is
 * what actually gets provisioned.
 */
export const AchareDashboard = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeDashboardSetup] = useCompleteAchareDashboardSetupMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);

  const toggleDashboard = useCallback((value: string) => {
    setSelected((previous) =>
      previous.includes(value)
        ? previous.filter((candidate) => candidate !== value)
        : [...previous, value],
    );
  }, []);

  const handleContinue = useCallback(async () => {
    setIsNavigating(true);
    try {
      await completeDashboardSetup({
        variables: {
          input: {
            provisionDefaults: true,
            // Keep the canonical order so provisioning is deterministic
            // regardless of the order the user toggled the cards.
            dashboardTypes: DASHBOARD_OPTIONS.filter((option) =>
              selected.includes(option.value),
            ).map((option) => option.value),
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
    selected,
    completeDashboardSetup,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  const selectedCount = useMemo(() => selected.length, [selected]);

  return (
    <AchareOnboardingShell
      title={t`Which dashboards do you need?`}
      subtitle={t`Achare creates one dashboard per role, so each person opens straight to the numbers that matter to them.`}
      onContinue={handleContinue}
      isLoading={isNavigating}
      isContinueDisabled={selectedCount === 0}
      footnote={t`Dashboards are built from the modules you enabled. You can add, rename or remove them later.`}
    >
      <AchareFieldGroup
        label={t`Pick the dashboards to create`}
        hint={t`You can turn any of these off and add your own later.`}
        counter={t`${selectedCount} of ${DASHBOARD_OPTIONS.length} selected`}
        error={
          selectedCount === 0
            ? t`Select at least one dashboard, or skip this step.`
            : undefined
        }
      >
        <AchareSelectableCardGroup>
          {DASHBOARD_OPTIONS.map((option) => (
            <AchareSelectableCard
              key={option.value}
              title={option.name}
              description={option.description}
              isSelected={selected.includes(option.value)}
              onClick={() => toggleDashboard(option.value)}
              disabled={isNavigating}
            />
          ))}
        </AchareSelectableCardGroup>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
