import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useIcons } from 'twenty-ui/icon';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type AchareModuleSetupItem = {
  /** Icon name from the Achare feature catalogue. */
  icon: string;
  name: string;
  description: string;
};

export type AchareModuleSetupStepProps = {
  title: string;
  subtitle: string;
  items: AchareModuleSetupItem[];
  /** Reassurance shown under the checklist — always skippable, never data-destroying. */
  note: string;
  isNavigating: boolean;
  onContinue: () => void;
  onSkip: () => void;
};

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  width: 100%;
`;

const StyledItemCard = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;
`;

const StyledItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledItemName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledItemDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledNote = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
`;

/**
 * Shared layout for the module setup steps that only exist when the matching
 * module was selected during feature selection (Finance, Documents, …).
 *
 * Keeping it in one component means a new module step is a data change, not a
 * new page implementation.
 */
export const AchareModuleSetupStep = ({
  title,
  subtitle,
  items,
  note,
  isNavigating,
  onContinue,
  onSkip,
}: AchareModuleSetupStepProps) => {
  const { t } = useLingui();
  const { getIcon } = useIcons();

  return (
    <StyledOnboardingStepPage>
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>{title}</StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>{subtitle}</StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledContent>
          {items.map((item) => {
            const Icon = getIcon(item.icon);

            return (
              <StyledItemCard key={item.name}>
                <StyledIconContainer>
                  <Icon size={16} color={themeCssVariables.font.color.tertiary} />
                </StyledIconContainer>
                <StyledItemText>
                  <StyledItemName>{item.name}</StyledItemName>
                  <StyledItemDescription>
                    {item.description}
                  </StyledItemDescription>
                </StyledItemText>
              </StyledItemCard>
            );
          })}
          <StyledNote>{note}</StyledNote>
        </StyledContent>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledButtonRow>
          <MainButton
            title={t`Skip for now`}
            onClick={onSkip}
            disabled={isNavigating}
            fullWidth
            variant="secondary"
          />
          <MainButton
            title={t`Continue`}
            onClick={onContinue}
            disabled={isNavigating}
            fullWidth
          />
        </StyledButtonRow>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
