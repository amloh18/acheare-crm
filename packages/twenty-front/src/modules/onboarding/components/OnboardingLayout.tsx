import { OnboardingHeader } from '@/onboarding/components/OnboardingHeader';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledBackground = styled.div`
  background: ${themeCssVariables.background.secondary};
  display: flex;
  flex-direction: column;
  height: calc(100dvh / var(--t-zoom, 1));
  width: 100%;
`;

type OnboardingLayoutProps = {
  children: ReactNode;
  onBack?: () => void;
  isBackDisabled?: boolean;
  freeCredits?: number;
  /**
   * The Achare steps draw their own rail, heading and action bar, so the
   * shared header would only duplicate the brand and the back affordance.
   */
  isHeaderHidden?: boolean;
};

export const OnboardingLayout = ({
  children,
  onBack,
  isBackDisabled,
  freeCredits,
  isHeaderHidden = false,
}: OnboardingLayoutProps) => (
  <StyledBackground>
    {!isHeaderHidden && (
      <OnboardingHeader
        onBack={onBack}
        isBackDisabled={isBackDisabled}
        freeCredits={freeCredits}
      />
    )}
    {children}
  </StyledBackground>
);
