import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { isActiveFieldMetadataItem } from '@/object-metadata/utils/isActiveFieldMetadataItem';
import { RecordFieldsComponentInstanceContext } from '@/object-record/record-field/states/context/RecordFieldsComponentInstanceContext';
import { currentRecordFieldsComponentState } from '@/object-record/record-field/states/currentRecordFieldsComponentState';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { createAtomComponentSelector } from '@/ui/utilities/state/jotai/utils/createAtomComponentSelector';
import { findById } from 'twenty-shared/utils';
import { sortByProperty } from '~/utils/array/sortByProperty';

export const calendarImportantRecordFieldsComponentSelector =
  createAtomComponentSelector<RecordField[]>({
    key: 'calendarImportantRecordFieldsComponentSelector',
    componentInstanceContext: RecordFieldsComponentInstanceContext,
    get:
      (componentStateKey) =>
      ({ get }) => {
        const currentRecordFields = get(
          currentRecordFieldsComponentState,
          componentStateKey,
        );

        const objectMetadataItems = get(objectMetadataItemsSelector);

        return filterCalendarImportantAndReadableRecordFields(
          currentRecordFields,
          objectMetadataItems,
        );
      },
  });

const filterCalendarImportantAndReadableRecordFields = (
  currentRecordFields: RecordField[],
  objectMetadataItems: EnrichedObjectMetadataItem[],
): RecordField[] => {
  const filteredCalendarImportantFields = currentRecordFields.filter(
    (recordFieldToFilter) => {
      if (!recordFieldToFilter.isCalendarImportant) {
        return false;
      }

      const objectMetadataItem = objectMetadataItems.find(
        (objectMetadataItem) =>
          objectMetadataItem.fields.some(
            (fieldMetadataItem) =>
              fieldMetadataItem.id === recordFieldToFilter.fieldMetadataItemId,
          ),
      );

      if (!objectMetadataItem) {
        return false;
      }

      const fieldMetadataItem = objectMetadataItem.fields.find(
        (fieldMetadataItem) =>
          fieldMetadataItem.id === recordFieldToFilter.fieldMetadataItemId,
      );

      if (!fieldMetadataItem) {
        return false;
      }

      const isLabelIdentifier =
        fieldMetadataItem.id ===
        objectMetadataItem.labelIdentifierFieldMetadataId;

      const isActive =
        isLabelIdentifier ||
        isActiveFieldMetadataItem({
          fieldMetadata: fieldMetadataItem,
        });

      const isReadable = objectMetadataItem.readableFields.some(
        findById(fieldMetadataItem.id),
      );

      return isReadable && isActive;
    },
  );

  return [...filteredCalendarImportantFields].sort(
    sortByProperty('position'),
  );
};
