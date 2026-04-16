import { z } from 'zod';
import { formatZodErrors } from './auth.validation.js';

export const symptomSelectionSchema = z.object({
  selectedIds: z.array(z.string()).min(1, { message: 'Please select at least one symptom' }),
});

export const symptomSearchSchema = z.object({
  query: z.string().trim().max(100, { message: 'Search query is too long' }),
});

export const validateSymptomSelection = (selectedIds) => {
  const result = symptomSelectionSchema.safeParse({ selectedIds });
  if (result.success) return { success: true, errors: {} };
  return { success: false, errors: formatZodErrors(result.error) };
};

export const validateSymptomSearch = (query) => {
  const result = symptomSearchSchema.safeParse({ query });
  if (result.success) return { success: true, data: result.data.query, errors: {} };
  return { success: false, data: null, errors: formatZodErrors(result.error) };
};
