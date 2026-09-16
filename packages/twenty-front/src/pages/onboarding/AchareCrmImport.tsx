import { AchareFieldGroup } from '@/onboarding/components/AchareFieldGroup';
import { AchareOnboardingShell } from '@/onboarding/components/AchareOnboardingShell';
import {
  AchareSelectableCard,
  AchareSelectableCardGroup,
} from '@/onboarding/components/AchareSelectableCard';
import { useCompleteAchareCrmImportMutation } from '@/onboarding/hooks/useCompleteAchareCrmImportMutation';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';

type ImportChoice = 'FRESH' | 'COMPANIES' | 'CONTACTS';

export const AchareCrmImport = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const [completeCrmImport] = useCompleteAchareCrmImportMutation();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [choice, setChoice] = useState<ImportChoice>('FRESH');

  const { openObjectRecordsSpreadsheetImportDialog: openCompanyImport } =
    useOpenObjectRecordsSpreadsheetImportDialog('company');

  const { openObjectRecordsSpreadsheetImportDialog: openPersonImport } =
    useOpenObjectRecordsSpreadsheetImportDialog('person');

  const handleContinue = useCallback(() => {
    if (choice === 'FRESH') {
      setIsNavigating(true);
      void completeCrmImport({ variables: { input: { skipImport: true } } })
        .then(() => {
          setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
        })
        .catch((error) => {
          setIsNavigating(false);
          enqueueErrorSnackBar({
            apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
          });
        });

      return;
    }

    const openImport =
      choice === 'COMPANIES' ? openCompanyImport : openPersonImport;

    openImport({
      onSubmit: async () => {
        // The import dialog creates the records; advancing the wizard here
        // only works because the caller's onSubmit is invoked after the
        // records are created (see useOpenObjectRecordsSpreadsheetImportDialog).
        await completeCrmImport({ variables: { input: { hasData: true } } });
        setNextOnboardingStatus({ stepHistoryEffect: 'leaveUnchanged' });
      },
    } as never);
  }, [
    choice,
    openCompanyImport,
    openPersonImport,
    completeCrmImport,
    setNextOnboardingStatus,
    enqueueErrorSnackBar,
  ]);

  return (
    <AchareOnboardingShell
      title={t`Do you already have client data?`}
      subtitle={t`Bring your existing companies and contacts across so Achare starts with your real book of business, or begin with an empty workspace.`}
      onContinue={handleContinue}
      continueLabel={
        choice === 'FRESH' ? t`Start with an empty workspace` : t`Choose a file`
      }
      isLoading={isNavigating}
      footnote={t`Imports are matched on name and email, so re-importing later updates existing records instead of duplicating them.`}
    >
      <AchareFieldGroup
        label={t`How would you like to start?`}
        hint={t`You can import at any time later from Settings → Setup Center.`}
      >
        <AchareSelectableCardGroup>
          <AchareSelectableCard
            role="radio"
            title={t`Start with an empty workspace`}
            description={t`Nothing is imported. Add companies and contacts as you go.`}
            isSelected={choice === 'FRESH'}
            onClick={() => setChoice('FRESH')}
            disabled={isNavigating}
          />
          <AchareSelectableCard
            role="radio"
            title={t`Import companies from a CSV`}
            description={t`Upload a spreadsheet of your clients and accounts.`}
            isSelected={choice === 'COMPANIES'}
            onClick={() => setChoice('COMPANIES')}
            disabled={isNavigating}
          />
          <AchareSelectableCard
            role="radio"
            title={t`Import contacts from a CSV`}
            description={t`Upload a spreadsheet of the people you deal with.`}
            isSelected={choice === 'CONTACTS'}
            onClick={() => setChoice('CONTACTS')}
            disabled={isNavigating}
          />
        </AchareSelectableCardGroup>
      </AchareFieldGroup>
    </AchareOnboardingShell>
  );
};
