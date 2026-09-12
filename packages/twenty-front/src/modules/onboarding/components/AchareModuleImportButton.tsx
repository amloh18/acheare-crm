import { useLingui } from '@lingui/react/macro';
import { useCallback } from 'react';

import { useOpenObjectRecordsSpreadsheetImportDialog } from '@/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog';
import { MainButton } from 'twenty-ui/input';

type AchareModuleImportButtonProps = {
  objectNameSingular: string;
  label: string;
  onImported?: (importedCount: number) => void;
  disabled?: boolean;
};

/**
 * Opens the standard spreadsheet-import dialog for one object and reports how
 * many records were imported.
 *
 * The dialog itself performs the batch create (see
 * `useOpenObjectRecordsSpreadsheetImportDialog`); this component only adds the
 * success reporting so module setup screens can acknowledge an import.
 */
export const AchareModuleImportButton = ({
  objectNameSingular,
  label,
  onImported,
  disabled = false,
}: AchareModuleImportButtonProps) => {
  const { t } = useLingui();

  const { openObjectRecordsSpreadsheetImportDialog } =
    useOpenObjectRecordsSpreadsheetImportDialog(objectNameSingular);

  const handleOpenImportDialog = useCallback(() => {
    openObjectRecordsSpreadsheetImportDialog({
      onSubmit: async (validationResult: {
        validStructuredRows: Array<unknown>;
      }) => {
        onImported?.(validationResult.validStructuredRows.length);
      },
    } as never);
  }, [openObjectRecordsSpreadsheetImportDialog, onImported]);

  return (
    <MainButton
      title={t`Import ${label}`}
      onClick={handleOpenImportDialog}
      disabled={disabled}
      variant="secondary"
    />
  );
};
