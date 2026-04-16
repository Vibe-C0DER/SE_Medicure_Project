import { z } from 'zod';
import { formatZodErrors } from './auth.validation.js';

export const profileSchema = z.object({
  fullname: z.string().trim().min(1, { message: 'Full name is required' }).max(100, { message: 'Full name is too long' }),
  age: z.coerce.number().int({ message: 'Age must be an integer' }).min(0, { message: 'Age must be between 0 and 120' }).max(120, { message: 'Age must be between 0 and 120' }),
  gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Gender must be male, female, or other' }) }),
  location: z.string().trim().min(1, { message: 'Location is required' }).max(100, { message: 'Location must be at most 100 characters' }),
  bio: z.string().max(500, { message: 'Bio must be at most 500 characters' }),
});

export const validateProfile = (data) => {
  const result = profileSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data, errors: {} };
  return { success: false, data: null, errors: formatZodErrors(result.error) };
};
