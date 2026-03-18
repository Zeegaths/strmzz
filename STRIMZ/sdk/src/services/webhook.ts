/**
 * Webhook Service
 * Handles webhook signature verification and event processing
 */

import crypto from 'crypto'
import type { WebhookEvent } from '../types'

// ============================================================================
// Webhook Verification
// ============================================================================

/**
 * Verify webhook signature using HMAC SHA256
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    return false
  }
}

/**
 * Construct webhook event from raw payload
 */
export const constructWebhookEvent = <T = any>(
  payload: string | object,
  signature: string,
  secret: string
): WebhookEvent<T> => {
  const rawPayload = typeof payload === 'string' ? payload : JSON.stringify(payload)

  // Verify signature
  if (!verifyWebhookSignature(rawPayload, signature, secret)) {
    throw new Error('Invalid webhook signature')
  }

  // Parse and return event
  const event = typeof payload === 'string' ? JSON.parse(payload) : payload
  return event as WebhookEvent<T>
}

// ============================================================================
// Webhook Event Helpers
// ============================================================================

/**
 * Type guard for payment success events
 */
export const isPaymentSuccessEvent = (event: WebhookEvent): boolean => {
  return event.type === 'payment.success'
}

/**
 * Type guard for payment failed events
 */
export const isPaymentFailedEvent = (event: WebhookEvent): boolean => {
  return event.type === 'payment.failed'
}

/**
 * Type guard for subscription events
 */
export const isSubscriptionEvent = (event: WebhookEvent): boolean => {
  return event.type.startsWith('subscription.')
}

/**
 * Extract event type from webhook event
 */
export const getEventType = (event: WebhookEvent): string => {
  return event.type
}

/**
 * Extract event data from webhook event
 */
export const getEventData = <T = any>(event: WebhookEvent<T>): T => {
  return event.data
}
