/**
 * Strimz SDK - Main Entry Point
 * Client-side SDK for browser usage
 */

// Core SDK
export { StrimzSDK, createStrimzSDK } from './core/StrimzSDK'

// Types
export type {
  SDKConfig,
  Environment,
  Currency,
  PaymentType,
  PaymentOptions,
  SubscriptionInterval,
  PaymentStatus,
  PaymentSessionStatus,
  OneTimePaymentMetadata,
  SubscriptionMetadata,
  PaymentSession,
  CheckoutSession,
  PaymentResult,
  Transaction,
  Subscription,
  SubscriptionStatus,
  ValidationResult,
  PaginatedData,
} from './types'

// Utilities
export {
  StrimzError,
  PaymentError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  RateLimitError,
  SessionError,
  createError,
  isStrimzError,
  isPaymentError,
  isAuthenticationError,
  isValidationError,
  isNetworkError,
  isRateLimitError,
  parsePaymentResult,
  parsePaymentResultFromWindow,
  isValidHttpsUrl,
  validate,
  validatePaymentOptionsOrThrow,
  sanitizeMetadata
} from './utils'