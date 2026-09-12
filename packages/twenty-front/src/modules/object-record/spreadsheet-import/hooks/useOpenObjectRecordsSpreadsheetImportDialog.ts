import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useGenerateDepthRecordGqlFieldsFromObject } from '@/object-record/graphql/record-gql-fields/hooks/useGenerateDepthRecordGqlFieldsFromObject';
import { useBatchCreateManyRecords } from '@/object-record/hooks/useBatchCreateManyRecords';
import { useBuildSpreadsheetImportFields } from '@/object-record/spreadsheet-import/hooks/useBuildSpreadSheetImportFields';
import { buildRecordFromImportedStructuredRow } from '@/object-record/spreadsheet-import/utils/buildRecordFromImportedStructuredRow';
import { spreadsheetImportFilterAvailableFieldMetadataItems } from '@/object-record/spreadsheet-import/utils/spreadsheetImportFilterAvailableFieldMetadataItems';
import { spreadsheetImportGetUnicityTableHook } from '@/object-record/spreadsheet-import/utils/spreadsheetImportGetUnicityTableHook';
import { SPREADSHEET_IMPORT_CREATE_RECORDS_BATCH_SIZE } from '@/spreadsheet-import/constants/SpreadsheetImportCreateRecordsBatchSize';
import { useOpenSpreadsheetImportDialog } from '@/spreadsheet-import/hooks/useOpenSpreadsheetImportDialog';
import { spreadsheetImportCreatedRecordsProgressState } from '@/spreadsheet-import/states/spreadsheetImportCreatedRecordsProgressState';
import { type SpreadsheetImportDialogOptions } from '@/spreadsheet-import/types';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

export const useOpenObjectRecordsSpreadsheetImportDialog = (
  objectNameSingular: string,
) => {
  const apolloCoreClient = useApolloCoreClient();
  const { openSpreadsheetImportDialog } = useOpenSpreadsheetImportDialog();
  const { buildSpreadsheetImportFields } = useBuildSpreadsheetImportFields();

  const { enqueueErrorSnackBar } = useSnackBar();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const setSpreadsheetImportCreatedRecordsProgress = useSetAtomState(
    spreadsheetImportCreatedRecordsProgressState,
  );

  const abortController = new AbortController();

  const { recordGqlFields } = useGenerateDepthRecordGqlFieldsFromObject({
    objectNameSingular,
    depth: 0,
  });

  const { batchCreateManyRecords } = useBatchCreateManyRecords({
    objectNameSingular,
    recordGqlFields,
    mutationBatchSize: SPREADSHEET_IMPORT_CREATE_RECORDS_BATCH_SIZE,
    setBatchedRecordsCount: setSpreadsheetImportCreatedRecordsProgress,
    abortController,
    skipPostOptimisticEffect: true,
  });

  const openObjectRecordsSpreadsheetImportDialog = (
    options?: Omit<
      SpreadsheetImportDialogOptions,
      'fields' | 'isOpen' | 'onClose'
    >,
  ) => {
    const availableFieldMetadataItemsToImport =
      spreadsheetImportFilterAvailableFieldMetadataItems(
        objectMetadataItem.updatableFields,
      );

    const spreadsheetImportFields = buildSpreadsheetImportFields(
      availableFieldMetadataItemsToImport,
    );

    const performRecordCreation = async (data: {
      validStructuredRows: Array<Record<string, any>>;
    }) => {
      const createInputs = data.validStructuredRows.map((record) => {
        const fieldMapping: Record<string, any> =
          buildRecordFromImportedStructuredRow({
            importedStructuredRow: record,
            fieldMetadataItems: availableFieldMetadataItemsToImport,
            spreadsheetImportFields,
          });

        return fieldMapping;
      });

      try {
        await batchCreateManyRecords({
          recordsToCreate: createInputs,
          upsert: true,
        });
        apolloCoreClient.cache.evict({
          id: 'ROOT_QUERY',
          fieldName: objectMetadataItem.namePlural,
        });
        await apolloCoreClient.refetchQueries({
          include: 'active',
        });
      } catch (error: any) {
        enqueueErrorSnackBar({
          apolloError: error,
        });
      }
    };

    openSpreadsheetImportDialog({
      ...options,
      /**
       * The caller's `onSubmit` still runs — after the records are created — so
       * a caller can react to a finished import (show a snackbar, advance a
       * wizard step). Previously the caller's callback was spread away by
       * `{...options}` below it and never invoked.
       */
      onSubmit: async (validationResult, file) => {
        await performRecordCreation(validationResult);

        await options?.onSubmit?.(validationResult, file);
      },
      spreadsheetImportFields,
      availableFieldMetadataItems: availableFieldMetadataItemsToImport,
      onAbortSubmit: () => {
        options?.onAbortSubmit?.();
        abortController.abort();
      },
      tableHook: spreadsheetImportGetUnicityTableHook(objectMetadataItem),
    });
  };

  return {
    openObjectRecordsSpreadsheetImportDialog,
  };
};
