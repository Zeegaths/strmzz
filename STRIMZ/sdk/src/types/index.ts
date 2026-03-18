/**
 * Strimz SDK Type Definitions
 * Updated for USDC-to-USDC merchant payment platform
 */

// ============================================================================
// Environment & Configuration
// ============================================================================

export type Environment = "live" | "test";

export interface SDKConfig {
  publicKey: string;
  environment?: Environment;
  debug?: boolean;
  apiUrl?: string;
}

export interface ServerSDKConfig {
  secretKey: string;
  environment?: Environment;
  apiUrl?: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentType = "one_time" | "subscription";

export type SubscriptionInterval = "weekly" | "monthly" | "quarterly" | "yearly";

export type Currency = "USDC" | "USDT";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type PaymentSessionStatus =
  | "pending"
  | "awaiting_approval"
  | "processing"
  | "completed"
  | "failed"
  | "expired";

// ============================================================================
// Payment Options
// ============================================================================

export interface PaymentOptions {
  amount: number;
  currency?: Currency;
  type: PaymentType;
  reference?: string;
  customerEmail?: string;
  description?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
  /** Subscription-specific options */
  subscription?: {
    interval: SubscriptionInterval;
  };
}

// ============================================================================
// Metadata Types
// ============================================================================

export interface OneTimePaymentMetadata {
  orderId?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  userId?: string;
  [key: string]: any;
}

export interface SubscriptionMetadata {
  planId?: string;
  planName?: string;
  userId?: string;
  [key: string]: any;
}

// ============================================================================
// Payment Session
// ============================================================================

export interface PaymentSession {
  id: string;
  sessionId: string;
  type: PaymentType;
  amount: number;
  currency: Currency;
  status: PaymentSessionStatus;
  checkoutUrl: string;
  reference?: string;
  customerEmail?: string;
  description?: string;
  metadata?: Record<string, any>;
  /** Populated after on-chain confirmation */
  onChain?: {
    paymentId: string;
    transactionHash: string;
    blockNumber: number;
    subscriptionId?: string;
  };
  expiresAt: string;
  createdAt: string;
}

// ============================================================================
// Checkout Session (returned to payer at checkout page)
// ============================================================================

export interface CheckoutSession {
  sessionId: string;
  type: PaymentType;
  amount: number;
  currency: Currency;
  status: PaymentSessionStatus;
  merchantName: string;
  merchantWallet: string;
  merchantOnChainId: string;
  description?: string;
  subscriptionInterval?: SubscriptionInterval;
  successUrl?: string;
  cancelUrl?: string;
}

// ============================================================================
// Transaction
// ============================================================================

export interface Transaction {
  id: string;
  onChainPaymentId: string;
  amount: number;
  fee: number;
  currency: Currency;
  status: PaymentStatus;
  type: PaymentType;
  payer: string;
  reference?: string;
  subscriptionId?: string;
  transactionHash: string;
  blockNumber: number;
  createdAt: string;
}

// ============================================================================
// Subscription
// ============================================================================

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due";

export interface Subscription {
  id: string;
  onChainSubscriptionId: string;
  subscriber: string;
  amount: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  chargeCount: number;
  lastChargeAt?: string;
  nextChargeAt?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============================================================================
// Payment Result (parsed from redirect URL)
// ============================================================================

export interface PaymentResult {
  status: PaymentStatus | "cancelled";
  paymentId?: string;
  transactionId?: string;
  subscriptionId?: string;
  sessionId?: string;
  message?: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookEventType =
  | "payment.created"
  | "payment.completed"
  | "payment.failed"
  | "subscription.created"
  | "subscription.charged"
  | "subscription.charge_failed"
  | "subscription.paused"
  | "subscription.resumed"
  | "subscription.cancelled"
  | "merchant.payout";

export interface WebhookEvent<T = any> {
  id: string;
  type: WebhookEventType;
  data: T;
  merchantId: string;
  createdAt: string;
  livemode: boolean;
}

export interface PaymentWebhookData {
  paymentId: string;
  sessionId?: string;
  amount: number;
  fee: number;
  currency: Currency;
  payer: string;
  reference?: string;
  transactionHash: string;
  subscriptionId?: string;
}

export interface SubscriptionWebhookData {
  subscriptionId: string;
  subscriber: string;
  amount: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  chargeCount: number;
  nextChargeAt?: number;
  paymentId?: string;
  transactionHash?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedData<T = any> {
  count: number;
  rows: T[];
}

// ============================================================================
// React Component Props
// ============================================================================

export interface StrimzProviderProps {
  publicKey: string;
  environment?: Environment;
  children: React.ReactNode;
}

export interface StrimzButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "onError"
  > {
  amount: number;
  type: PaymentType;
  currency?: Currency;
  reference?: string;
  description?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  subscription?: {
    interval: SubscriptionInterval;
  };
  metadata?: Record<string, any>;
  onSessionCreated?: (session: PaymentSession) => void;
  onError?: (error: Error) => void;
  loading?: boolean;
}

// ============================================================================
// Validation
// ============================================================================

export interface ValidationResult {
  success: boolean;
  error?: string;
  data?: any;
}