import { z } from 'zod';
import { formatZodErrors } from './auth.validation.js';

export const aiInputSchema = z.object({
  text: z.string().trim()
    .min(5, { message: 'Please describe your symptoms properly (at least 5 characters required)' })
    .max(500, { message: 'Please limit your description to 500 characters' }),
});

export const validateAiInput = (text) => {
  const result = aiInputSchema.safeParse({ text });
  if (result.success) return { success: true, data: result.data.text, errors: {} };
  return { success: false, data: null, errors: formatZodErrors(result.error) };
};
