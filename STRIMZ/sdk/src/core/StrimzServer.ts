/**
 * Strimz Server SDK
 * Server-side SDK for transaction verification, subscription management,
 * and webhook handling
 */

import type {
  ServerSDKConfig,
  Transaction,
  Subscription,
  WebhookEvent,
  Environment,
  PaginatedData,
} from '../types'
import { APIClient, createAPIClient } from '../services/api'
import {
  verifyWebhookSignature,
  constructWebhookEvent
} from '../services/webhook'
import { validate } from '../utils/validation'

// ============================================================================
// Strimz Server SDK Class
// ============================================================================

export class StrimzServer {
  private apiClient: APIClient
  private config: Required<ServerSDKConfig>

  constructor(config: ServerSDKConfig) {
    const validationResult = validate.serverConfig(config)
    if (!validationResult.success) {
      throw new Error(`Invalid server SDK configuration: ${validationResult.error}`)
    }

    this.config = {
      secretKey: config.secretKey,
      environment: config.environment || 'live',
      apiUrl: config.apiUrl || ''
    }

    this.apiClient = createAPIClient({
      apiKey: this.config.secretKey,
      environment: this.config.environment,
      apiUrl: this.config.apiUrl || undefined
    })
  }

  // ==========================================================================
  // Transactions
  // ==========================================================================

  /**
   * Verify a transaction by ID
   *
   * @example
   * const tx = await strimz.verifyTransaction('uuid-here')
   * if (tx.status === 'completed') {
   *   // Fulfill order
   * }
   */
  async verifyTransaction(transactionId: string): Promise<Transaction> {
    return this.apiClient.verifyTransaction(transactionId)
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string): Promise<Transaction['status']> {
    return this.apiClient.getTransactionStatus(transactionId)
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    return this.apiClient.getTransaction(transactionId)
  }

  /**
   * List transactions for your merchant account
   */
  async listTransactions(page = 0, size = 20): Promise<PaginatedData<Transaction>> {
    return this.apiClient.listTransactions(page, size)
  }

  // ==========================================================================
  // Subscriptions
  // ==========================================================================

  /**
   * Get a subscription by ID
   *
   * @example
   * const sub = await strimz.getSubscription('uuid-here')
   * console.log(sub.status, sub.chargeCount)
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    return this.apiClient.getSubscription(subscriptionId)
  }

  /**
   * List subscriptions for your merchant account
   */
  async listSubscriptions(page = 0, size = 20): Promise<PaginatedData<Subscription>> {
    return this.apiClient.listSubscriptions(page, size)
  }

  /**
   * Cancel a subscription (merchant-initiated)
   *
   * @example
   * await strimz.cancelSubscription('uuid-here')
   */
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    return this.apiClient.cancelSubscription(subscriptionId)
  }

  // ==========================================================================
  // Webhooks
  // ==========================================================================

  /**
   * Verify webhook signature
   *
   * @example
   * const isValid = strimz.verifyWebhookSignature(
   *   rawBody,
   *   req.headers['x-strimz-signature'],
   *   webhookSecret
   * )
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    return verifyWebhookSignature(payload, signature, webhookSecret)
  }

  /**
   * Construct and verify webhook event
   *
   * @example
   * const event = strimz.constructWebhookEvent(
   *   rawBody,
   *   req.headers['x-strimz-signature'],
   *   webhookSecret
   * )
   *
   * switch (event.type) {
   *   case 'payment.completed':
   *     // Handle completed payment
   *     break
   *   case 'subscription.charged':
   *     // Handle subscription renewal
   *     break
   *   case 'subscription.charge_failed':
   *     // Handle failed charge
   *     break
   * }
   */
  constructWebhookEvent<T = any>(
    payload: string | object,
    signature: string,
    webhookSecret: string
  ): WebhookEvent<T> {
    return constructWebhookEvent<T>(payload, signature, webhookSecret)
  }

  // ==========================================================================
  // Utility
  // ==========================================================================

  getEnvironment(): Environment {
    return this.config.environment
  }

  isTestMode(): boolean {
    return this.config.environment === 'test'
  }

  isLiveMode(): boolean {
    return this.config.environment === 'live'
  }
}

// ============================================================================
// Standalone Functions
// ============================================================================

export const verifyWebhook = verifyWebhookSignature
export const constructEvent = constructWebhookEvent

// ============================================================================
// Factory Function
// ============================================================================

export const createStrimzServer = (config: ServerSDKConfig): StrimzServer => {
  return new StrimzServer(config)
}