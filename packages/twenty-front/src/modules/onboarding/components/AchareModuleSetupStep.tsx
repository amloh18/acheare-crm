import { AchareChecklist } from '@/onboarding/components/AchareChecklist';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
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
  /** Reassurance shown under the checklist — always skippable, never data-destroying. */
  note: string;
  isNavigating: boolean;
  onContinue: () => void;
  onSkip: () => void;
};

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

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  return (
    <AchareOnboardingShell
      title={title}
      subtitle={subtitle}
      onContinue={onContinue}
      onSkip={handleSkip}
      skipLabel={t`Skip this module`}
      isLoading={isNavigating}
      footnote={note}
    >
      <AchareChecklist
        items={items.map((item) => ({
          icon: item.icon,
          name: item.name,
          description: item.description,
        }))}
      />
    </AchareOnboardingShell>
  );
};
