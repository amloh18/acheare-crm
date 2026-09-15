import { currentRecordFieldsComponentState } from '@/object-record/record-field/states/currentRecordFieldsComponentState';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useStore } from 'jotai';

export const useToggleCalendarImportantRecordField = (
  recordFieldComponentInstanceId?: string,
) => {
  const store = useStore();
  const currentRecordFields = useAtomComponentStateCallbackState(
    currentRecordFieldsComponentState,
    recordFieldComponentInstanceId,
  );

  const toggleCalendarImportant = useCallback(
    (fieldMetadataItemId: string) => {
      const existingRecordFields = store.get(currentRecordFields);

      const foundRecordFieldInCurrentRecordFields = existingRecordFields.find(
        (existingRecordField) =>
          existingRecordField.fieldMetadataItemId === fieldMetadataItemId,
      );

      if (!isDefined(foundRecordFieldInCurrentRecordFields)) {
        throw new Error(
          `Cannot find record field to update with field metadata item id : ${fieldMetadataItemId}`,
        );
      }

      const newValue =
        !foundRecordFieldInCurrentRecordFields.isCalendarImportant;

      store.set(currentRecordFields, (previousRecordFields) => {
        const newCurrentRecordFields = [...previousRecordFields];

        const indexOfRecordFieldToUpdate = newCurrentRecordFields.findIndex(
          (existingRecordField) =>
            existingRecordField.fieldMetadataItemId === fieldMetadataItemId,
        );

        newCurrentRecordFields[indexOfRecordFieldToUpdate] = {
          ...newCurrentRecordFields[indexOfRecordFieldToUpdate],
          isCalendarImportant: newValue,
        };

        return newCurrentRecordFields;
      });

      return {
        ...foundRecordFieldInCurrentRecordFields,
        isCalendarImportant: newValue,
      } satisfies RecordField as RecordField;
    },
    [currentRecordFields, store],
  );

  return {
    toggleCalendarImportant,
  };
};
