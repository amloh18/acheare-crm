import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { FieldMetadataType } from 'twenty-shared/types';

const PRIORITY_FIELD_TYPES = new Set([
  FieldMetadataType.SELECT,
  FieldMetadataType.RELATION,
  FieldMetadataType.CURRENCY,
  FieldMetadataType.NUMBER,
  FieldMetadataType.NUMERIC,
  FieldMetadataType.DATE,
  FieldMetadataType.DATE_TIME,
  FieldMetadataType.BOOLEAN,
  FieldMetadataType.EMAILS,
  FieldMetadataType.PHONES,
  FieldMetadataType.LINKS,
  FieldMetadataType.FULL_NAME,
  FieldMetadataType.ADDRESS,
]);

const EXCLUDED_FIELD_TYPES = new Set([
  FieldMetadataType.RICH_TEXT,
  FieldMetadataType.RAW_JSON,
  FieldMetadataType.ARRAY,
  FieldMetadataType.TS_VECTOR,
  FieldMetadataType.POSITION,
]);

const MAX_PRIORITY_FIELDS = 3;

export const getPriorityFieldsForCompactMode = (
  visibleFields: RecordField[],
  fieldMetadataItemById: Record<string, FieldMetadataItem>,
): RecordField[] => {
  const priorityFields: RecordField[] = [];
  const remainingFields: RecordField[] = [];

  for (const field of visibleFields) {
    const meta = fieldMetadataItemById[field.fieldMetadataItemId];
    if (!meta) {
      remainingFields.push(field);
      continue;
    }
    if (EXCLUDED_FIELD_TYPES.has(meta.type)) {
      continue;
    }
    if (PRIORITY_FIELD_TYPES.has(meta.type)) {
      priorityFields.push(field);
    } else {
      remainingFields.push(field);
    }
  }

  const result = [...priorityFields, ...remainingFields];
  return result.slice(0, MAX_PRIORITY_FIELDS);
};
