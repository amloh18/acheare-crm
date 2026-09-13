import { ViewFilterOperand } from 'twenty-shared/types';
import { relationFilterValueSchemaObject } from 'twenty-shared/utils';
import z from 'zod';
import { urlRecursiveFilterGroupSchema } from './urlRecursiveFilterGroupSchema';

const normalizeFilterOperands = (val: unknown) => {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return val;
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(val)) {
    normalized[key.toUpperCase()] = value;
  }
  return normalized;
};

export const filterUrlQueryParamsSchema = z.object({
  filter: z
    .record(
      z.string(),
      z.preprocess(
        normalizeFilterOperands,
        z.partialRecord(
          z.enum(ViewFilterOperand),
          z.string().or(z.array(z.string())).or(relationFilterValueSchemaObject),
        ),
      ),
    )
    .optional(),
  filterGroup: urlRecursiveFilterGroupSchema.optional(),
});
