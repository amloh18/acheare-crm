import { currentUserState } from '@/auth/states/currentUserState';
import { AchareOnboardingRail } from '@/onboarding/components/AchareOnboardingRail';
import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { ACHARE_ONBOARDING_RAIL_BREAKPOINT } from '@/onboarding/constants/AchareOnboardingRailBreakpoint';
import { useGoBackToPreviousOnboardingStep } from '@/onboarding/hooks/useGoBackToPreviousOnboardingStep';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { type ReactNode } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconArrowLeft } from 'twenty-ui/icon';
import { MainButton } from 'twenty-ui/input';
import { MOBILE_VIEWPORT, themeCssVariables } from 'twenty-ui/theme-constants';

const StyledShell = styled.div`
  background: ${themeCssVariables.background.secondary};
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
`;

const StyledMain = styled.main`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
`;

const StyledScroll = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[12]} ${themeCssVariables.spacing[8]}
    ${themeCssVariables.spacing[8]};

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[4]};
  }
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
  max-width: 620px;
  width: 100%;
`;

const StyledBrandMark = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;

  @media (min-width: ${ACHARE_ONBOARDING_RAIL_BREAKPOINT + 1}px) {
    display: none;
  }
`;

const StyledBrandLogo = styled.img`
  height: 24px;
  width: 24px;
`;

const StyledHeading = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
`;

const StyledSubtitle = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.6;
  margin: 0;
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
`;

const StyledFootnote = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.6;
  margin: 0;
`;

const StyledFooterBar = styled.div`
  background: ${themeCssVariables.background.secondary};
  border-top: 1px solid ${themeCssVariables.border.color.light};
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[8]};

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  }
`;

const StyledFooterInner = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: space-between;
  max-width: 620px;
  width: 100%;
`;

const StyledFooterSide = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  min-width: 0;
`;

export type AchareOnboardingShellProps = {
  /** The question the step asks, in plain language. */
  title: string;
  /** One or two lines explaining why the question is being asked. */
  subtitle: string;
  /** The step's questions and controls. */
  children: ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  /** True while a mutation is in flight — disables every action. */
  isLoading?: boolean;
  /** When provided, a secondary "Skip for now" action is rendered. */
  onSkip?: () => void;
  skipLabel?: string;
  /** Reassurance shown under the actions, e.g. what skipping does. */
  footnote?: string;
  /** Hide the back action on the very first step. */
  hideBack?: boolean;
};

/**
 * The frame every Achare onboarding step renders inside.
 *
 * Two panes: a persistent rail that shows where the user is in the wizard, and
 * a single content column with one question per block and the actions pinned
 * to the bottom of the viewport. Centralising the frame is what keeps the
 * steps consistent — previously each page re-declared its own heading, spacing
 * and button row, so they drifted apart.
 */
export const AchareOnboardingShell = ({
  title,
  subtitle,
  children,
  onContinue,
  continueLabel,
  isContinueDisabled = false,
  isLoading = false,
  onSkip,
  skipLabel,
  footnote,
  hideBack = false,
}: AchareOnboardingShellProps) => {
  const { t } = useLingui();
  const currentUser = useAtomStateValue(currentUserState);
  const {
    goBackToPreviousOnboardingStep,
    isGoingBackToPreviousOnboardingStep,
  } = useGoBackToPreviousOnboardingStep();

  const canGoBack =
    !hideBack && isDefined(currentUser?.previousOnboardingStatus);

  const isBusy = isLoading || isGoingBackToPreviousOnboardingStep;

  return (
    <StyledShell>
      <AchareOnboardingRail />

      <StyledMain>
        <StyledScroll>
          <StyledColumn>
            <OnboardingStepAnimatedItem index={0}>
              <StyledBrandMark>
                <StyledBrandLogo
                  src="/images/integrations/logo.png"
                  alt="Achare"
                />
              </StyledBrandMark>
            </OnboardingStepAnimatedItem>

            <OnboardingStepAnimatedItem index={1}>
              <StyledHeading>
                <StyledTitle>{title}</StyledTitle>
                <StyledSubtitle>{subtitle}</StyledSubtitle>
              </StyledHeading>
            </OnboardingStepAnimatedItem>

            <OnboardingStepAnimatedItem index={2}>
              <StyledBody>{children}</StyledBody>
            </OnboardingStepAnimatedItem>

            {footnote !== undefined && (
              <OnboardingStepAnimatedItem index={3}>
                <StyledFootnote>{footnote}</StyledFootnote>
              </OnboardingStepAnimatedItem>
            )}
          </StyledColumn>
        </StyledScroll>

        <StyledFooterBar>
          <StyledFooterInner>
            <StyledFooterSide>
              {canGoBack && (
                <MainButton
                  title={t`Go back`}
                  Icon={IconArrowLeft}
                  variant="secondary"
                  onClick={() => {
                    void goBackToPreviousOnboardingStep();
                  }}
                  disabled={isBusy}
                />
              )}
              {onSkip !== undefined && (
                <MainButton
                  title={skipLabel ?? t`Skip for now`}
                  variant="secondary"
                  onClick={onSkip}
                  disabled={isBusy}
                />
              )}
            </StyledFooterSide>

            <StyledFooterSide>
              <MainButton
                title={continueLabel ?? t`Continue`}
                variant="primary"
                onClick={onContinue}
                disabled={isBusy || isContinueDisabled}
              />
            </StyledFooterSide>
          </StyledFooterInner>
        </StyledFooterBar>
      </StyledMain>
    </StyledShell>
  );
};
