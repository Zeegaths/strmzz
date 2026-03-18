/**
 * Validation Utilities
 * Updated for new payment platform (pk_live/sk_live keys, USDC/USDT, merchant model)
 */

import { z } from "zod";
import type {
  PaymentOptions,
  SDKConfig,
  ServerSDKConfig,
  ValidationResult,
} from "../types";
import { createError } from "./errors";

// ============================================================================
// Zod Schemas
// ============================================================================

const environmentSchema = z.enum(["live", "test"]);

const currencySchema = z.enum(["USDC", "USDT"]);

const paymentTypeSchema = z.enum(["one_time", "subscription"]);

const subscriptionIntervalSchema = z.enum([
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
]);

const amountSchema = z
  .number()
  .min(0.01, "Amount must be at least 0.01")
  .max(1000000, "Amount cannot exceed 1,000,000");

const emailSchema = z.string().email("Invalid email format").optional();

const urlSchema = z
  .string()
  .url("Invalid URL format")
  .refine((url) => url.startsWith("https://") || url.startsWith("http://localhost"), {
    message: "URL must use HTTPS protocol (or localhost for testing)",
  });

const publicKeySchema = z
  .string()
  .refine(
    (key) => key.startsWith("pk_live_") || key.startsWith("pk_test_"),
    "Public key must start with pk_live_ or pk_test_"
  );

const secretKeySchema = z
  .string()
  .refine(
    (key) => key.startsWith("sk_live_") || key.startsWith("sk_test_"),
    "Secret key must start with sk_live_ or sk_test_"
  );

// ============================================================================
// Config Schemas
// ============================================================================

const sdkConfigSchema = z.object({
  publicKey: publicKeySchema,
  environment: environmentSchema.optional(),
  debug: z.boolean().optional(),
  apiUrl: z.string().url().optional(),
});

const serverSDKConfigSchema = z.object({
  secretKey: secretKeySchema,
  environment: environmentSchema.optional(),
  apiUrl: z.string().url().optional(),
});

// ============================================================================
// Payment Options Schema
// ============================================================================

const paymentOptionsSchema = z.object({
  amount: amountSchema,
  currency: currencySchema.optional().default("USDC"),
  type: paymentTypeSchema,
  reference: z.string().optional(),
  customerEmail: emailSchema,
  description: z.string().optional(),
  successUrl: urlSchema,
  cancelUrl: urlSchema,
  metadata: z.record(z.string(), z.any()).optional(),
  subscription: z.object({
    interval: subscriptionIntervalSchema,
  }).optional(),
}).refine(
  (data) => {
    if (data.type === "subscription" && !data.subscription?.interval) {
      return false;
    }
    return true;
  },
  {
    message: "subscription.interval is required when type is 'subscription'",
    path: ["subscription"],
  }
);

// ============================================================================
// Validation Functions
// ============================================================================

export const validate = {
  sdkConfig: (config: SDKConfig): ValidationResult => {
    try {
      const validated = sdkConfigSchema.parse(config);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: "Invalid configuration" };
    }
  },

  serverConfig: (config: ServerSDKConfig): ValidationResult => {
    try {
      const validated = serverSDKConfigSchema.parse(config);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: "Invalid server configuration" };
    }
  },

  paymentOptions: (options: PaymentOptions): ValidationResult => {
    try {
      const validated = paymentOptionsSchema.parse(options);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: "Invalid payment options" };
    }
  },

  amount: (amount: number): void => {
    const result = amountSchema.safeParse(amount);
    if (!result.success) throw createError.invalidAmount(amount);
  },

  paymentType: (type: string): void => {
    const result = paymentTypeSchema.safeParse(type);
    if (!result.success) throw createError.invalidPaymentType(type);
  },

  interval: (interval: string): void => {
    const result = subscriptionIntervalSchema.safeParse(interval);
    if (!result.success) throw createError.invalidInterval(interval);
  },

  email: (email: string): void => {
    const result = emailSchema.safeParse(email);
    if (!result.success) throw createError.invalidEmail(email);
  },

  url: (url: string, field: "successUrl" | "cancelUrl"): void => {
    const result = urlSchema.safeParse(url);
    if (!result.success) throw createError.invalidUrl(field, url);
  },

  publicKey: (key: string): void => {
    const result = publicKeySchema.safeParse(key);
    if (!result.success) throw createError.invalidApiKey("public");
  },

  secretKey: (key: string): void => {
    const result = secretKeySchema.safeParse(key);
    if (!result.success) throw createError.invalidApiKey("secret");
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

export const requiresInterval = (options: PaymentOptions): boolean => {
  return options.type === "subscription";
};

export const validatePaymentOptionsOrThrow = (options: PaymentOptions): void => {
  const result = validate.paymentOptions(options);
  if (!result.success) {
    throw new Error(result.error);
  }
};

export const sanitizeMetadata = (
  metadata?: Record<string, any>
): Record<string, any> | undefined => {
  if (!metadata) return undefined;
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value !== "function" && typeof value !== "symbol") {
      sanitized[key] = value;
    }
  }
  return sanitized;
};