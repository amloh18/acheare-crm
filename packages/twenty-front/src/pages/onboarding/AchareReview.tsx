import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareNote } from '@/onboarding/components/AchareNote';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { useFinishAchareOnboardingMutation } from '@/onboarding/hooks/useFinishAchareOnboardingMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  ACHARE_MODULES,
  type AchareFeatureKey,
  getEnabledAchareModules,
} from 'twenty-shared/workspace';
import { IconCheck, IconSparkles, useIcons } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledModuleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledModulePill = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.secondary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledNextList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledNextItem = styled.li`
  align-items: flex-start;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[3]};
  line-height: 1.5;
`;

const StyledTick = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.transparent.success};
  border-radius: 50%;
  color: ${themeCssVariables.color.green};
  display: inline-flex;
  flex-shrink: 0;
  height: 20px;
  justify-content: center;
  margin-top: 1px;
  width: 20px;
`;

/**
 * Final step.
 *
 * Lists what this workspace actually composed — read from the enabled features
 * rather than a fixed list of everything Achare can do — plus the handful of
 * things worth doing first.
 */
export const AchareReview = () => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [finishOnboarding] = useFinishAchareOnboardingMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const enabledFeatures = useAchareEnabledFeatures();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const enabledModules = useMemo(
    () =>
      isDefined(enabledFeatures)
        ? getEnabledAchareModules(enabledFeatures as AchareFeatureKey[])
        : [],
    [enabledFeatures],
  );

  const agencyName = currentWorkspace?.displayName;

  const handleFinish = useCallback(async () => {
    setIsNavigating(true);
    try {
      await finishOnboarding();
      setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
    } catch (error) {
      setIsNavigating(false);
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  }, [finishOnboarding, setNextOnboardingStatus, enqueueErrorSnackBar]);

  return (
    <AchareOnboardingShell
      title={t`You're all set`}
      subtitle={
        isDefined(agencyName) && agencyName.length > 0
          ? t`${agencyName} is configured and ready to use. Here is what we set up.`
          : t`Your workspace is configured and ready to use. Here is what we set up.`
      }
      onContinue={handleFinish}
      continueLabel={t`Enter Achare`}
      isLoading={isNavigating}
      hideBack
      footnote={t`Changed your mind about a module? Turn it on or off any time from Settings → Setup Center.`}
    >
      <AchareFieldGroup
        label={t`Modules turned on`}
        hint={t`These are the parts of Achare available in your sidebar.`}
      >
        {enabledModules.length > 0 ? (
          <StyledModuleRow>
            {enabledModules.map((moduleKey) => {
              const module = ACHARE_MODULES[moduleKey];
              const Icon = getIcon(module.icon);

              return (
                <StyledModulePill key={moduleKey}>
                  <Icon
                    size={14}
                    color={themeCssVariables.font.color.tertiary}
                  />
                  {module.label}
                </StyledModulePill>
              );
            })}
          </StyledModuleRow>
        ) : (
          <AchareNote>
            {t`No modules are turned on yet. You can choose them from Settings → Setup Center.`}
          </AchareNote>
        )}
      </AchareFieldGroup>

      <AchareFieldGroup
        label={t`Good first steps`}
        hint={t`Nothing here is required — it is just the fastest way to get value out of Achare.`}
      >
        <StyledNextList>
          {[
            t`Add your first client or company.`,
            t`Invite the rest of your team and give them a role.`,
            t`Open a requirement and start adding candidates to it.`,
            t`Check your dashboards once you have some data in.`,
          ].map((item) => (
            <StyledNextItem key={item}>
              <StyledTick>
                <IconCheck size={11} />
              </StyledTick>
              {item}
            </StyledNextItem>
          ))}
        </StyledNextList>
      </AchareFieldGroup>

      <AchareNote
        tone="info"
        icon={<IconSparkles size={14} color={themeCssVariables.color.blue} />}
      >
        {t`Need to change something later? Settings → Setup Center has every one of these steps, ready to re-run.`}
      </AchareNote>
    </AchareOnboardingShell>
  );
};
