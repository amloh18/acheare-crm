import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { type ViewField } from '@/views/types/ViewField';

export const mapViewFieldToRecordField = (viewField: ViewField) => {
  const recordField: RecordField = {
    id: viewField.id,
    fieldMetadataItemId: viewField.fieldMetadataId,
    isVisible: viewField.isVisible,
    isCalendarImportant: viewField.isCalendarImportant,
    position: viewField.position,
    size: viewField.size,
    aggregateOperation: viewField.aggregateOperation,
  };

  return recordField;
};
