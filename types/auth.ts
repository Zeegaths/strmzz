import { z } from "zod";

/**
 * Authentication validation schemas and types
 *
 * All form validation schemas are defined using Zod.
 * Types are automatically inferred from schemas for type safety.
 */

// ============================================================================
// Base Schemas
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens"
  );

export const businessNameSchema = z
  .string()
  .min(1, "Business name is required")
  .min(2, "Business name must be at least 2 characters")
  .max(100, "Business name must not exceed 100 characters");

export const businessLocationSchema = z
  .string()
  .min(1, "Business location is required");

export const businessTypeSchema = z
  .string()
  .min(1, "Business type is required");

// ============================================================================
// Form Schemas
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const userSignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const businessSignupSchema = loginSchema;

export const businessInfoSchema = z.object({
  businessName: businessNameSchema,
  businessLocation: businessLocationSchema,
  businessType: businessTypeSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const setNewPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(4, "Code must be 4 characters")
    .max(4, "Code must be 4 characters"),
});

// ============================================================================
// Inferred Types
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type UserSignupInput = z.infer<typeof userSignupSchema>;
export type BusinessSignupInput = z.infer<typeof businessSignupSchema>;
export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SetNewPasswordInput = z.infer<typeof setNewPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

// ============================================================================
// UI Component Types
// ============================================================================

export type ErrorDisplayProps = {
  message?: string;
};