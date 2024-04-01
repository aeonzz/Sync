import * as z from "zod";

export const SignUpValidation = z
  .object({
    studentId: z.string().min(1, "Student id is required").max(30),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const SignInValidation = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

export const OnboardingValidation = z.object({
  username: z
    .string()
    .min(1, "Display name is required")
    .min(5, "Display name should be at least 5 characters")
    .max(12, "Display name cannot exceed 12 characters"),
  bio: z
    .string()
    .max(100, {
      message: "Bio cannot exceed 100 characters.",
    })
    .optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
});

export const EditProfileValidation = z.object({
  username: z
    .string()
    .min(1, "Display name is required")
    .min(5, "Display name should be at least 5 characters")
    .max(12, "Display name cannot exceed 12 characters")
    .optional(),
  bio: z
    .string()
    .max(100, {
      message: "Bio cannot exceed 100 characters.",
    })
    .optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
});

export const EmailValidation = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const ResetPasswordValidation = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });
