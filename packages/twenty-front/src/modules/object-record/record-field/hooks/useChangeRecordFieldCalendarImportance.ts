import { useUpdateRecordField } from '@/object-record/record-field/hooks/useUpdateRecordField';
import { currentRecordFieldsComponentState } from '@/object-record/record-field/states/currentRecordFieldsComponentState';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSaveCurrentViewFields } from '@/views/hooks/useSaveCurrentViewFields';
import { mapRecordFieldToViewField } from '@/views/utils/mapRecordFieldToViewField';
import { isDefined } from 'twenty-shared/utils';

export const useChangeRecordFieldCalendarImportance = (
  recordFieldComponentInstanceId?: string,
) => {
  const currentRecordFields = useAtomComponentStateValue(
    currentRecordFieldsComponentState,
    recordFieldComponentInstanceId,
  );

  const { updateRecordField } = useUpdateRecordField(
    recordFieldComponentInstanceId,
  );

  const { saveViewFields } = useSaveCurrentViewFields();

  const changeRecordFieldCalendarImportance = async ({
    fieldMetadataId,
    isCalendarImportant,
  }: {
    fieldMetadataId: string;
    isCalendarImportant: boolean;
  }) => {
    const correspondingRecordField = currentRecordFields.find(
      (recordFieldToFind) =>
        recordFieldToFind.fieldMetadataItemId === fieldMetadataId,
    );

    if (!isDefined(correspondingRecordField)) {
      throw new Error(
        `Cannot find record field to update with field metadata item id : ${fieldMetadataId}`,
      );
    }

    updateRecordField(fieldMetadataId, {
      isCalendarImportant,
    });

    const updatedRecordField: RecordField = {
      ...correspondingRecordField,
      isCalendarImportant,
    };

    await saveViewFields([mapRecordFieldToViewField(updatedRecordField)]);
  };

  return {
    changeRecordFieldCalendarImportance,
  };
};
