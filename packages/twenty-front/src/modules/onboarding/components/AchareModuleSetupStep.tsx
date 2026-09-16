import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import { useIcons } from 'twenty-ui/icon';
import { styled, themeCssVariables } from 'twenty-ui/theme-constants';
import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';

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
  /** Reassurance shown under the feature list — always skippable, never data-destroying. */
  note: string;
  /** Label for the primary action, e.g. "Enable Finance". */
  actionLabel: string;
  isNavigating: boolean;
  onContinue: () => void;
  onSkip: () => void;
};

const StyledFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledFeatureCard = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledFeatureIcon = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-shrink: 0;
  height: 36px;
  justify-content: center;
  width: 36px;
`;

const StyledFeatureBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledFeatureName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledFeatureDescription = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledActionHint = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.6;
  margin: 0;
`;

/**
 * Shared layout for module setup steps that have no user-configurable fields
 * (Finance, Documents, …).
 *
 * Instead of a confusing pre-checked checklist, it shows each feature as an
 * info card and uses an explicit "Enable …" action so the user knows exactly
 * what the button does.
 */
export const AchareModuleSetupStep = ({
  title,
  subtitle,
  items,
  note,
  actionLabel,
  isNavigating,
  onContinue,
  onSkip,
}: AchareModuleSetupStepProps) => {
  const { t } = useLingui();
  const { getIcon } = useIcons();

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  return (
    <AchareOnboardingShell
      title={title}
      subtitle={subtitle}
      onContinue={onContinue}
      continueLabel={actionLabel}
      onSkip={handleSkip}
      skipLabel={t`Skip for now`}
      isLoading={isNavigating}
      footnote={note}
    >
      <StyledFeatureList>
        {items.map((item) => {
          const Icon = getIcon(item.icon);

          return (
            <StyledFeatureCard key={item.name}>
              <StyledFeatureIcon>
                {Icon !== undefined && (
                  <Icon
                    size={18}
                    color={themeCssVariables.font.color.secondary}
                  />
                )}
              </StyledFeatureIcon>
              <StyledFeatureBody>
                <StyledFeatureName>{item.name}</StyledFeatureName>
                <StyledFeatureDescription>
                  {item.description}
                </StyledFeatureDescription>
              </StyledFeatureBody>
            </StyledFeatureCard>
          );
        })}
      </StyledFeatureList>

      <StyledActionHint>
        {t`Nothing to configure — just tap "${actionLabel}" to turn it on.`}
      </StyledActionHint>
    </AchareOnboardingShell>
  );
};
