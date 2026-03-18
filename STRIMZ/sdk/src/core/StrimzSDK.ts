/**
 * Strimz SDK - Client-Side SDK
 * Updated for USDC-to-USDC merchant payment platform
 */

import type {
  SDKConfig,
  PaymentOptions,
  PaymentSession,
  Environment
} from '../types'
import { APIClient, createAPIClient } from '../services/api'
import { RedirectService, createRedirectService } from '../services/redirect'
import { validate, validatePaymentOptionsOrThrow } from '../utils/validation'
import { buildCheckoutUrl } from '../utils/url'

// ============================================================================
// Strimz SDK Class
// ============================================================================

export class StrimzSDK {
  private apiClient: APIClient
  private redirectService: RedirectService
  private config: Required<SDKConfig>

  constructor(config: SDKConfig) {
    const validationResult = validate.sdkConfig(config)
    if (!validationResult.success) {
      throw new Error(`Invalid SDK configuration: ${validationResult.error}`)
    }

    this.config = {
      publicKey: config.publicKey,
      environment: config.environment || 'live',
      debug: config.debug || false,
      apiUrl: config.apiUrl || ''
    }

    this.apiClient = createAPIClient({
      apiKey: this.config.publicKey,
      environment: this.config.environment,
      apiUrl: this.config.apiUrl || undefined
    })

    this.redirectService = createRedirectService(this.config.environment)

    if (this.config.debug) {
      this.log('Strimz SDK initialized', {
        environment: this.config.environment,
        keyPrefix: this.config.publicKey.substring(0, 12) + '...'
      })
    }
  }

  /**
   * Create a payment session and get the session object
   *
   * @example
   * const session = await sdk.createPaymentSession({
   *   amount: 25.00,
   *   currency: 'USDC',
   *   type: 'one_time',
   *   reference: 'order_789',
   *   successUrl: 'https://yoursite.com/success',
   *   cancelUrl: 'https://yoursite.com/cancel',
   * })
   */
  async createPaymentSession(options: PaymentOptions): Promise<PaymentSession> {
    validatePaymentOptionsOrThrow(options)

    if (this.config.debug) {
      this.log('Creating payment session', options)
    }

    try {
      const session = await this.apiClient.createPaymentSession(options)

      if (this.config.debug) {
        this.log('Payment session created', {
          sessionId: session.sessionId,
          checkoutUrl: session.checkoutUrl,
        })
      }

      return session
    } catch (error) {
      if (this.config.debug) {
        this.log('Failed to create payment session', error)
      }
      throw error
    }
  }

  /**
   * Create a payment session and redirect to Strimz checkout
   *
   * @example
   * await sdk.redirectToCheckout({
   *   amount: 9.99,
   *   currency: 'USDC',
   *   type: 'subscription',
   *   subscription: { interval: 'monthly' },
   *   successUrl: 'https://yoursite.com/subscribed',
   *   cancelUrl: 'https://yoursite.com/cancel',
   * })
   */
  async redirectToCheckout(options: PaymentOptions): Promise<void> {
    const session = await this.createPaymentSession(options)

    if (this.config.debug) {
      this.log('Redirecting to checkout', session.checkoutUrl)
    }

    this.redirectService.redirectToCheckout(session)
  }

  /**
   * Create a payment session and open checkout in a new tab
   */
  async openCheckoutInNewWindow(options: PaymentOptions): Promise<Window | null> {
    const session = await this.createPaymentSession(options)

    if (this.config.debug) {
      this.log('Opening checkout in new window', session.checkoutUrl)
    }

    return this.redirectService.openCheckoutInNewWindow(session)
  }

  /**
   * Get a payment session by its public session ID
   */
  async getPaymentSession(sessionId: string): Promise<PaymentSession> {
    if (this.config.debug) {
      this.log('Fetching payment session', sessionId)
    }

    return this.apiClient.getPaymentSession(sessionId)
  }

  /**
   * Build checkout URL from session ID without creating a new session
   */
  buildCheckoutUrl(sessionId: string): string {
    return buildCheckoutUrl(sessionId, this.config.environment)
  }

  getEnvironment(): Environment {
    return this.config.environment
  }

  isTestMode(): boolean {
    return this.config.environment === 'test'
  }

  isLiveMode(): boolean {
    return this.config.environment === 'live'
  }

  getPublicKey(): string {
    return this.config.publicKey
  }

  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Strimz SDK] ${message}`, data || '')
    }
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export const createStrimzSDK = (config: SDKConfig): StrimzSDK => {
  return new StrimzSDK(config)
}