import { type MatchColumnsStepProps } from '@/spreadsheet-import/steps/components/MatchColumnsStep/MatchColumnsStep';

import {
  type SpreadsheetImportField,
  type SpreadsheetImportFields,
} from '@/spreadsheet-import/types';
import { type SpreadsheetColumn } from '@/spreadsheet-import/types/SpreadsheetColumn';
import { type SpreadsheetColumns } from '@/spreadsheet-import/types/SpreadsheetColumns';
import { SpreadsheetColumnType } from '@/spreadsheet-import/types/SpreadsheetColumnType';
import { setColumn } from '@/spreadsheet-import/utils/setColumn';
import Fuse from 'fuse.js';
import { isDefined } from 'twenty-shared/utils';

// Data type detection patterns for smart matching
const DATA_TYPE_PATTERNS: Record<string, RegExp> = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
  url: /^https?:\/\/.+/,
  date: /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/,
  number: /^\d+\.?\d*$/,
  boolean: /^(true|false|yes|no|1|0)$/i,
};

// Field type to data type mapping for smart matching
const FIELD_TYPE_TO_DATA_TYPE: Record<string, string[]> = {
  email: ['email'],
  emails: ['email'],
  phone: ['phone'],
  phones: ['phone'],
  url: ['url'],
  links: ['url'],
  date: ['date'],
  date_time: ['date'],
  number: ['number'],
  numeric: ['number'],
  boolean: ['boolean'],
  checkbox: ['boolean'],
};

// Detect data type from sample values
const detectDataTypeFromValues = (
  values: (string | null | undefined)[],
): string | null => {
  const nonNullValues = values.filter(
    (v): v is string => isDefined(v) && v.trim() !== '',
  );

  if (nonNullValues.length === 0) return null;

  // Sample up to 10 values for pattern detection
  const sampleValues = nonNullValues.slice(0, 10);

  // Count pattern matches
  const patternCounts: Record<string, number> = {};

  for (const pattern of Object.keys(DATA_TYPE_PATTERNS)) {
    patternCounts[pattern] = 0;
  }

  for (const value of sampleValues) {
    for (const [patternName, pattern] of Object.entries(DATA_TYPE_PATTERNS)) {
      if (pattern.test(value)) {
        patternCounts[patternName]++;
      }
    }
  }

  // Find the pattern with the highest match rate (at least 70% of samples)
  let bestPattern: string | null = null;
  let bestCount = 0;

  for (const [patternName, count] of Object.entries(patternCounts)) {
    const matchRate = count / sampleValues.length;
    if (matchRate >= 0.7 && count > bestCount) {
      bestPattern = patternName;
      bestCount = count;
    }
  }

  return bestPattern;
};

// Get data type from column header name (heuristic)
const getDataTypeFromHeader = (header: string): string | null => {
  const lowerHeader = header.toLowerCase();

  if (lowerHeader.includes('email') || lowerHeader.includes('e-mail')) {
    return 'email';
  }
  if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('tel')) {
    return 'phone';
  }
  if (lowerHeader.includes('url') || lowerHeader.includes('link') || lowerHeader.includes('website') || lowerHeader.includes('domain')) {
    return 'url';
  }
  if (lowerHeader.includes('date') || lowerHeader.includes('time') || lowerHeader.includes('created') || lowerHeader.includes('updated')) {
    return 'date';
  }
  if (lowerHeader.includes('amount') || lowerHeader.includes('price') || lowerHeader.includes('revenue') || lowerHeader.includes('salary')) {
    return 'number';
  }
  if (lowerHeader.includes('is') || lowerHeader.includes('has') || lowerHeader.includes('active') || lowerHeader.includes('enabled')) {
    return 'boolean';
  }

  return null;
};

// Check if a field matches a data type
const fieldMatchesDataType = (
  field: SpreadsheetImportField,
  dataType: string,
): boolean => {
  const fieldDataType = FIELD_TYPE_TO_DATA_TYPE[field.fieldMetadataType] || [];
  return fieldDataType.includes(dataType);
};

export const getMatchedColumnsWithFuse = ({
  columns,
  fields,
  data,
}: {
  columns: SpreadsheetColumns;
  fields: SpreadsheetImportFields;
  data: MatchColumnsStepProps['data'];
}) => {
  const matchedColumns: SpreadsheetColumn[] = [];

  const fieldsToSearch = new Fuse(fields, {
    keys: ['label'],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.3,
  });

  const suggestedFieldsByColumnHeader: Record<
    SpreadsheetColumn['header'],
    SpreadsheetImportField[]
  > = {};

  for (const column of columns) {
    // First, try to detect data type from column values
    // data is ImportedRow[] (Array<Array<string | undefined>>), column.index gives the column position
    const columnValues: (string | null | undefined)[] = data.map((row) => {
      const value = row[column.index];
      return typeof value === 'string' ? value : null;
    });
    const detectedDataType = detectDataTypeFromValues(columnValues);

    // Also try to detect from header name
    const headerDataType = getDataTypeFromHeader(column.header);

    // Use the detected data type (value-based takes precedence over header-based)
    const dataType = detectedDataType || headerDataType;

    // Get fuzzy matches based on label
    let fieldsThatMatch = fieldsToSearch.search(column.header);

    // If we detected a data type, boost fields that match that type
    if (dataType) {
      const dataTypeMatches = fields.filter((field) =>
        fieldMatchesDataType(field as unknown as SpreadsheetImportField, dataType),
      );

      // Add data type matches to the beginning if they're not already there
      for (const dataTypeField of dataTypeMatches) {
        if (!fieldsThatMatch.some((m) => m.item.key === dataTypeField.key)) {
          fieldsThatMatch = [
            { item: dataTypeField as any, score: 0.1, refIndex: 0 },
            ...fieldsThatMatch,
          ];
        }
      }
    }

    const firstMatch = fieldsThatMatch[0] ?? null;
    const secondMatch = fieldsThatMatch[1] ?? null;

    const isFirstMatchValid =
      isDefined(firstMatch?.item) &&
      isDefined(firstMatch?.score) &&
      firstMatch.score < 0.4 &&
      ((isDefined(secondMatch?.score) &&
        secondMatch.score !== firstMatch.score) ||
        !isDefined(secondMatch));

    const isFieldStillUnmatched = !matchedColumns.some(
      (matchedColumn) =>
        (matchedColumn.type === SpreadsheetColumnType.matched ||
          matchedColumn.type === SpreadsheetColumnType.matchedCheckbox ||
          matchedColumn.type === SpreadsheetColumnType.matchedSelect ||
          matchedColumn.type === SpreadsheetColumnType.matchedSelectOptions) &&
        matchedColumn?.value === firstMatch?.item?.key,
    );

    suggestedFieldsByColumnHeader[column.header] = fieldsThatMatch.map(
      (match) => match.item as unknown as SpreadsheetImportField,
    );

    if (isFirstMatchValid && isFieldStillUnmatched) {
      const newColumn = setColumn(column, firstMatch.item as any, data);

      matchedColumns.push(newColumn);
    } else {
      matchedColumns.push(column);
    }
  }

  return { matchedColumns, suggestedFieldsByColumnHeader };
};
