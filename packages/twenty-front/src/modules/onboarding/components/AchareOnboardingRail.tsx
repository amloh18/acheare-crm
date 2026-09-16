import { currentUserState } from '@/auth/states/currentUserState';
import { ACHARE_ONBOARDING_RAIL_BREAKPOINT } from '@/onboarding/constants/AchareOnboardingRailBreakpoint';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useAchareOnboardingSteps } from '@/workspace-feature/hooks/useAchareOnboardingSteps';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { IconCheck } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  ACHARE_MODULE_ONBOARDING_STEPS,
  ACHARE_ONBOARDING_LEADING_STEPS,
  ACHARE_ONBOARDING_STATUS_TO_STEP,
  ACHARE_ONBOARDING_STEP_LABEL,
  ACHARE_ONBOARDING_TRAILING_STEPS,
  type AchareOnboardingStepKey,
} from 'twenty-shared/workspace';

/**
 * Mirrors the server's fallback list (leading + enabled module steps +
 * trailing) so the rail can render before the feature configuration lands.
 */
const FALLBACK_STEPS: AchareOnboardingStepKey[] = [
  ...ACHARE_ONBOARDING_LEADING_STEPS,
  ...ACHARE_MODULE_ONBOARDING_STEPS,
  ...ACHARE_ONBOARDING_TRAILING_STEPS,
];

const StyledRail = styled.aside`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${themeCssVariables.spacing[6]};
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[6]};
  width: 280px;

  @media (max-width: ${ACHARE_ONBOARDING_RAIL_BREAKPOINT}px) {
    display: none;
  }
`;

const StyledBrand = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledBrandMark = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-shrink: 0;
  height: 36px;
  justify-content: center;
  width: 36px;
`;

const StyledBrandLogo = styled.img`
  height: 20px;
  width: 20px;
`;

const StyledBrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledBrandName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledBrandCaption = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const StyledProgressHeader = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledProgressCount = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  font-variant-numeric: tabular-nums;
`;

const StyledProgressTrack = styled.div`
  background: ${themeCssVariables.background.transparent.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  height: 4px;
  margin-bottom: ${themeCssVariables.spacing[4]};
  overflow: hidden;
  width: 100%;
`;

const StyledProgressFill = styled.div<{ percent: number }>`
  background: ${themeCssVariables.color.blue};
  border-radius: ${themeCssVariables.border.radius.pill};
  height: 100%;
  transition: width 0.25s ease;
  width: ${({ percent }) => `${percent}%`};
`;

const StyledStepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledStepItem = styled.li<{ state: 'done' | 'current' | 'upcoming' }>`
  align-items: center;
  background: ${({ state }) =>
    state === 'current'
      ? themeCssVariables.background.transparent.blue
      : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ state }) =>
    state === 'upcoming'
      ? themeCssVariables.font.color.tertiary
      : themeCssVariables.font.color.primary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${({ state }) =>
    state === 'current'
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledStepMarker = styled.span<{
  state: 'done' | 'current' | 'upcoming';
}>`
  align-items: center;
  background: ${({ state }) =>
    state === 'done'
      ? themeCssVariables.color.blue
      : state === 'current'
        ? themeCssVariables.background.primary
        : 'transparent'};
  border: 1px solid
    ${({ state }) =>
      state === 'upcoming'
        ? themeCssVariables.border.color.medium
        : themeCssVariables.color.blue};
  border-radius: 50%;
  display: inline-flex;
  flex-shrink: 0;
  height: 16px;
  justify-content: center;
  width: 16px;
`;

const StyledCurrentDot = styled.span`
  background: ${themeCssVariables.color.blue};
  border-radius: 50%;
  height: 6px;
  width: 6px;
`;

const StyledStepLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledDivider = styled.hr`
  border: none;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  margin: 0;
  width: 100%;
`;

const StyledHelp = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledHelpTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledHelpBody = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  line-height: 1.6;
  margin: 0;
`;

const StyledSaveNote = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[2]};
  margin-top: auto;
`;

const StyledSaveDot = styled.span`
  background: ${themeCssVariables.color.green};
  border-radius: 50%;
  flex-shrink: 0;
  height: 6px;
  width: 6px;
`;

/**
 * The left-hand context panel of the onboarding wizard.
 *
 * It answers the two questions a step page cannot answer on its own — "where
 * am I in this setup?" and "what happens if I skip something?" — using the
 * workspace's own generated step list, so it never advertises a step this
 * workspace will not see.
 */
export const AchareOnboardingRail = () => {
  const { t } = useLingui();
  const generatedSteps = useAchareOnboardingSteps();
  const currentUser = useAtomStateValue(currentUserState);

  const steps = generatedSteps ?? FALLBACK_STEPS;

  const currentStepKey =
    currentUser?.onboardingStatus !== undefined &&
    currentUser?.onboardingStatus !== null
      ? ACHARE_ONBOARDING_STATUS_TO_STEP[currentUser.onboardingStatus]
      : undefined;

  const currentIndex =
    currentStepKey !== undefined ? steps.indexOf(currentStepKey) : -1;

  const completedCount = currentIndex === -1 ? 0 : currentIndex;
  const percent =
    steps.length === 0
      ? 0
      : Math.round(((completedCount + 1) / steps.length) * 100);

  return (
    <StyledRail aria-label={t`Setup progress`}>
      <StyledBrand>
        <StyledBrandMark>
          <StyledBrandLogo src="/images/integrations/logo.png" alt="Achare" />
        </StyledBrandMark>
        <StyledBrandText>
          <StyledBrandName>{t`Workspace setup`}</StyledBrandName>
          <StyledBrandCaption>{t`Takes about 5 minutes`}</StyledBrandCaption>
        </StyledBrandText>
      </StyledBrand>

      <div>
        <StyledProgressHeader>
          <StyledSectionLabel>{t`Progress`}</StyledSectionLabel>
          {currentIndex !== -1 && (
            <StyledProgressCount>
              {t`Step ${currentIndex + 1} of ${steps.length}`}
            </StyledProgressCount>
          )}
        </StyledProgressHeader>
        <StyledProgressTrack>
          <StyledProgressFill percent={percent} />
        </StyledProgressTrack>

        <StyledStepList>
          {steps.map((step, index) => {
            const state =
              index < currentIndex
                ? 'done'
                : index === currentIndex
                  ? 'current'
                  : 'upcoming';

            return (
              <StyledStepItem key={step} state={state}>
                <StyledStepMarker state={state}>
                  {state === 'done' && (
                    <IconCheck
                      size={10}
                      color={themeCssVariables.font.color.inverted}
                    />
                  )}
                  {state === 'current' && <StyledCurrentDot />}
                </StyledStepMarker>
                <StyledStepLabel>
                  {ACHARE_ONBOARDING_STEP_LABEL[step]}
                </StyledStepLabel>
              </StyledStepItem>
            );
          })}
        </StyledStepList>
      </div>

      <StyledDivider />

      <StyledHelp>
        <StyledHelpTitle>{t`Skipping is safe`}</StyledHelpTitle>
        <StyledHelpBody>
          {t`Any step you skip only stays hidden for now. Nothing is deleted, and you can finish it later from Settings → Setup Center.`}
        </StyledHelpBody>
      </StyledHelp>

      <StyledSaveNote>
        <StyledSaveDot />
        {t`Your answers save as you go`}
      </StyledSaveNote>
    </StyledRail>
  );
};
