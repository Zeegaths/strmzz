import { z } from "zod";

/**
 * Utility Bills validation schemas and types
 *
 * All form validation schemas are defined using Zod.
 * Types are automatically inferred from schemas for type safety.
 */

// ============================================================================
// Base Schemas
// ============================================================================

export const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[0-9]{11}$/, "Phone number must be 11 digits");

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

export const amountSchema = z
  .string()
  .min(1, "Amount is required")
  .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format");

export const networkProviderSchema = z
  .string()
  .min(1, "Network provider is required");

export const dataPlanSchema = z
  .string()
  .min(1, "Data plan is required");

export const cableProviderSchema = z
  .string()
  .min(1, "Cable provider is required");

export const iucNumberSchema = z
  .string()
  .min(1, "IUC number is required")
  .regex(/^[0-9]+$/, "IUC number must contain only digits");

export const cablePlanSchema = z
  .string()
  .min(1, "Cable plan is required");

export const electricityProviderSchema = z
  .string()
  .min(1, "Electricity provider is required");

export const meterNumberSchema = z
  .string()
  .min(1, "Meter number is required")
  .regex(/^[0-9]+$/, "Meter number must contain only digits");

export const meterTypeSchema = z
  .string()
  .min(1, "Meter type is required");

export const tokenSchema = z
  .enum(["USDC", "USDT"], {
    required_error: "Token is required",
  });

// ============================================================================
// Form Schemas
// ============================================================================

export const airtimeSchema = z.object({
  networkProvider: networkProviderSchema,
  phoneNumber: phoneNumberSchema,
  amount: amountSchema,
  token: tokenSchema,
  email: emailSchema,
});

export const dataSchema = z.object({
  networkProvider: networkProviderSchema,
  phoneNumber: phoneNumberSchema,
  dataPlan: dataPlanSchema,
  amount: amountSchema,
  token: tokenSchema,
  email: emailSchema,
});

export const cableTvSchema = z.object({
  cableProvider: cableProviderSchema,
  iucNumber: iucNumberSchema,
  cablePlan: cablePlanSchema,
  amount: amountSchema,
  token: tokenSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
});

export const electricitySchema = z.object({
  electricityProvider: electricityProviderSchema,
  meterType: meterTypeSchema,
  meterNumber: meterNumberSchema,
  amount: amountSchema,
  token: tokenSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
});

// ============================================================================
// Inferred Types
// ============================================================================

export type AirtimeInput = z.infer<typeof airtimeSchema>;
export type DataInput = z.infer<typeof dataSchema>;
export type CableTvInput = z.infer<typeof cableTvSchema>;
export type ElectricityInput = z.infer<typeof electricitySchema>;

// ============================================================================
// Provider Options
// ============================================================================

export const networkProviders = [
  { value: "mtn", label: "MTN" },
  { value: "airtel", label: "Airtel" },
  { value: "glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
];

export const dataPlans = {
  mtn: [
    { value: "1gb", label: "1GB - $2.50", amount: "2.50" },
    { value: "2gb", label: "2GB - $4.00", amount: "4.00" },
    { value: "5gb", label: "5GB - $8.00", amount: "8.00" },
    { value: "10gb", label: "10GB - $15.00", amount: "15.00" },
  ],
  airtel: [
    { value: "1gb", label: "1GB - $2.50", amount: "2.50" },
    { value: "2gb", label: "2GB - $4.00", amount: "4.00" },
    { value: "5gb", label: "5GB - $8.00", amount: "8.00" },
    { value: "10gb", label: "10GB - $15.00", amount: "15.00" },
  ],
  glo: [
    { value: "1gb", label: "1GB - $2.00", amount: "2.00" },
    { value: "2gb", label: "2GB - $3.50", amount: "3.50" },
    { value: "5gb", label: "5GB - $7.50", amount: "7.50" },
    { value: "10gb", label: "10GB - $14.00", amount: "14.00" },
  ],
  "9mobile": [
    { value: "1gb", label: "1GB - $2.50", amount: "2.50" },
    { value: "2gb", label: "2GB - $4.00", amount: "4.00" },
    { value: "5gb", label: "5GB - $8.00", amount: "8.00" },
    { value: "10gb", label: "10GB - $15.00", amount: "15.00" },
  ],
};

export const cableProviders = [
  { value: "gotv", label: "GOTV" },
  { value: "dstv", label: "DSTV" },
  { value: "startimes", label: "Startimes" },
  { value: "showmax", label: "Showmax" },
];

export const cablePlans = {
  gotv: [
    { value: "gotv_supa", label: "GOTV Supa - $8.00", amount: "8.00" },
    { value: "gotv_max", label: "GOTV Max - $10.00", amount: "10.00" },
    { value: "gotv_jolli", label: "GOTV Jolli - $5.00", amount: "5.00" },
  ],
  dstv: [
    { value: "dstv_compact", label: "DSTV Compact - $25.00", amount: "25.00" },
    { value: "dstv_premium", label: "DSTV Premium - $50.00", amount: "50.00" },
    { value: "dstv_family", label: "DSTV Family - $15.00", amount: "15.00" },
  ],
  startimes: [
    { value: "startimes_basic", label: "Startimes Basic - $6.00", amount: "6.00" },
    { value: "startimes_smart", label: "Startimes Smart - $10.00", amount: "10.00" },
    { value: "startimes_classic", label: "Startimes Classic - $8.00", amount: "8.00" },
  ],
  showmax: [
    { value: "showmax_mobile", label: "Showmax Mobile - $5.00", amount: "5.00" },
    { value: "showmax_standard", label: "Showmax Standard - $12.00", amount: "12.00" },
    { value: "showmax_pro", label: "Showmax Pro - $20.00", amount: "20.00" },
  ],
};

export const electricityProviders = [
  { value: "abuja_electric", label: "Abuja Electric" },
  { value: "aba_power", label: "Aba Power" },
  { value: "benin_electric", label: "Benin Electric" },
  { value: "enugu_electric", label: "Enugu Electric" },
  { value: "eko_electric", label: "Eko Electric" },
  { value: "ikeja_electric", label: "Ikeja Electric" },
  { value: "port_harcourt_electric", label: "Port Harcourt Electric" },
  { value: "kaduna_electric", label: "Kaduna Electric" },
  { value: "kano_electric", label: "Kano Electric" },
  { value: "jos_electric", label: "Jos Electric" },
];

export const meterTypes = [
  { value: "prepaid", label: "Prepaid" },
  { value: "postpaid", label: "Postpaid" },
];