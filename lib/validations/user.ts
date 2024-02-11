import * as z from 'zod';

export const UserValidation = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100),
  username: z
    .string()
    .optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Password confirmation is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const SignInValidation = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});