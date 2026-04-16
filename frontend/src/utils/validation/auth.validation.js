import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First Name is required' }),
  lastName: z.string().trim().min(1, { message: 'Last Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  // In the current form, confirmPassword is not strictly present. If it were, we would use refine.
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, { message: 'Email Address is required' }).email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const formatZodErrors = (zodError) => {
  const errors = {};
  if (zodError.issues) {
    zodError.issues.forEach((err) => {
      if (err.path && err.path[0]) {
        errors[err.path[0]] = err.message;
      }
    });
  }
  return errors;
};

export const validateRegister = (data) => {
  const result = registerSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data, errors: {} };
  return { success: false, data: null, errors: formatZodErrors(result.error) };
};

export const validateLogin = (data) => {
  const result = loginSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data, errors: {} };
  return { success: false, data: null, errors: formatZodErrors(result.error) };
};
