import { z } from 'zod';

export const LoginSchema = z.object({
  password: z.string().min(10, { message: "Password must be at least 10 characters" }).refine(value => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter",
  }).refine(value => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter",
  }).refine(value => /[0-9]/.test(value), {
    message: "Password must contain at least one number",
  }).refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: "Password must contain at least one special character",
  }),
    email: z.string().email({ message: "Invalid email address" }),
  });

export type LoginSchemaType = z.infer<typeof LoginSchema>;