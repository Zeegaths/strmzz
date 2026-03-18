/**
 * Strimz SDK - React Entry Point
 * React components and hooks
 */

// Components
export {
  StrimzProvider,
  useStrimz,
  useStrimzSDK,
  StrimzButton
} from './components'

// Re-export core SDK
export { StrimzSDK, createStrimzSDK } from './core/StrimzSDK'

// Types
export type {
  StrimzProviderProps,
  StrimzButtonProps,
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
} from './types'

// Utilities
export {
  parsePaymentResult,
  parsePaymentResultFromWindow,
  isStrimzError,
  createError
} from './utils'