import * as z from "zod";

export const SignUpValidation = z
  .object({
    studentId: z.string().min(1, "Student id is required").max(30),
    username: z
      .string()
      .min(1, "Username is required")
      .min(10, "Username should be at least 10 characters")
      .max(20, "Username cannot exceed 20 characters"),
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
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

export const OnboardingValidation = z.object({
  displayName: z
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

export const OnboardingServerValidation = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(10, "Username should be at least 10 characters")
    .max(20, "Username cannot exceed 20 characters"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .min(5, "Display name should be at least 5 characters")
    .max(8, "Display name cannot exceed 8 characters"),
  bio: z.string().max(100, {
    message: "Bio cannot exceed 100 characters.",
  }),
  urls: z.array(
    z.object({
      value: z.string().url({ message: "Please enter a valid URL." }),
    }),
  ),
  avatarUrl: z.string().url(),
  onboarded: z.boolean(),
});
