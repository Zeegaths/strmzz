/**
 * Strimz SDK - Server Entry Point
 * Server-side SDK for Node.js backend usage
 */

// Server SDK
export {
  StrimzServer,
  createStrimzServer,
  verifyWebhook,
  constructEvent
} from './core/StrimzServer'

// Webhook utilities
export {
  verifyWebhookSignature,
  constructWebhookEvent,
  isPaymentCompletedEvent,
  isPaymentSuccessEvent,
  isPaymentFailedEvent,
  isSubscriptionEvent,
  isSubscriptionChargedEvent,
  isSubscriptionChargeFailedEvent,
  isSubscriptionCancelledEvent,
  isSubscriptionPausedEvent,
  isSubscriptionResumedEvent,
  getEventType,
  getEventData
} from './services/webhook'

// Types
export type {
  ServerSDKConfig,
  Environment,
  Currency,
  Transaction,
  PaymentStatus,
  WebhookEvent,
  WebhookEventType,
  PaymentWebhookData,
  SubscriptionWebhookData,
  Subscription,
  SubscriptionInterval,
  SubscriptionStatus,
  PaymentType,
  OneTimePaymentMetadata,
  SubscriptionMetadata,
  APIResponse,
  APIError,
  PaginatedData,
} from './types'

// Errors
export {
  StrimzError,
  PaymentError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  RateLimitError,
  SessionError,
  createError,
  isStrimzError
} from './utils/errors'

// Validation
export {
  validate
} from './utils/validation'