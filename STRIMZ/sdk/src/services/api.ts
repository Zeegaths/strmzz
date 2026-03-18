/**
 * API Client Service
 * Updated for new backend (/api/v1/payments/*, /api/v1/subscriptions/*)
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  PaymentSession,
  PaymentOptions,
  Transaction,
  Subscription,
  Environment,
  APIResponse,
  PaginatedData,
} from '../types'
import {
  createError,
  NetworkError,
  AuthenticationError,
  StrimzError
} from '../utils/errors'
import { getApiUrl } from '../utils/url'

// ============================================================================
// API Client Configuration
// ============================================================================

export interface APIClientConfig {
  apiKey: string
  environment: Environment
  apiUrl?: string
  timeout?: number
  maxRetries?: number
}

// ============================================================================
// API Client Class
// ============================================================================

export class APIClient {
  private client: AxiosInstance
  private apiKey: string
  private environment: Environment
  private maxRetries: number

  constructor(config: APIClientConfig) {
    this.apiKey = config.apiKey
    this.environment = config.environment
    this.maxRetries = config.maxRetries || 3

    const baseURL = getApiUrl(config.environment, config.apiUrl)

    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Strimz-SDK-Version': '2.0.0'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        return this.handleError(error)
      }
    )
  }

  private async handleError(error: AxiosError): Promise<never> {
    if (!error.response) {
      throw createError.networkError(error)
    }

    const { status, data } = error.response as any

    if (status === 429) {
      const retryAfter = error.response.headers['retry-after']
      throw createError.rateLimitExceeded(
        retryAfter ? parseInt(retryAfter, 10) : undefined
      )
    }

    if (status === 401) {
      throw new AuthenticationError(data?.message || 'Invalid API key')
    }

    if (status === 404) {
      throw new StrimzError(
        data?.message || 'Resource not found',
        'NOT_FOUND',
        undefined,
        404
      )
    }

    if (status === 410) {
      throw createError.sessionExpired()
    }

    if (data?.message) {
      throw new StrimzError(data.message, data.error || 'API_ERROR', undefined, status)
    }

    throw new NetworkError(`API request failed with status ${status}`, { status, data })
  }

  private async requestWithRetry<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    retryCount = 0
  ): Promise<T> {
    try {
      const response = method === 'get' || method === 'delete'
        ? await this.client[method](url)
        : await this.client[method](url, data)
      return response.data
    } catch (error) {
      if (error instanceof NetworkError && retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.requestWithRetry<T>(method, url, data, retryCount + 1)
      }
      throw error
    }
  }

  // ==========================================================================
  // Payment Sessions
  // ==========================================================================

  /**
   * Create a payment session
   * Endpoint: POST /payments/sessions
   */
  async createPaymentSession(options: PaymentOptions): Promise<PaymentSession> {
    const response = await this.requestWithRetry<APIResponse<PaymentSession>>(
      'post',
      '/payments/sessions',
      {
        amount: options.amount,
        currency: options.currency || 'USDC',
        type: options.type,
        reference: options.reference,
        customerEmail: options.customerEmail,
        description: options.description,
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
        metadata: options.metadata,
        subscription: options.type === 'subscription' ? options.subscription : undefined,
      }
    )

    if (!response.success || !response.data) {
      throw new StrimzError(
        response.error || 'Failed to create payment session',
        'SESSION_CREATE_FAILED'
      )
    }

    return response.data
  }

  /**
   * Get a payment session by session ID
   * Endpoint: GET /payments/sessions/:sessionId
   */
  async getPaymentSession(sessionId: string): Promise<PaymentSession> {
    const response = await this.requestWithRetry<APIResponse<PaymentSession>>(
      'get',
      `/payments/sessions/${sessionId}`
    )

    if (!response.success || !response.data) {
      throw createError.sessionNotFound(sessionId)
    }

    return response.data
  }

  /**
   * List payment sessions
   * Endpoint: GET /payments/sessions
   */
  async listPaymentSessions(page = 0, size = 20): Promise<PaginatedData<PaymentSession>> {
    const response = await this.requestWithRetry<APIResponse<PaginatedData<PaymentSession>>>(
      'get',
      `/payments/sessions?page=${page}&size=${size}`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Failed to list sessions', 'LIST_SESSIONS_FAILED')
    }

    return response.data
  }

  // ==========================================================================
  // Transactions
  // ==========================================================================

  /**
   * Verify a transaction by ID
   * Endpoint: GET /payments/transactions/:transactionId/verify
   */
  async verifyTransaction(transactionId: string): Promise<Transaction> {
    const response = await this.requestWithRetry<APIResponse<Transaction>>(
      'get',
      `/payments/transactions/${transactionId}/verify`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Failed to verify transaction', 'TRANSACTION_VERIFY_FAILED')
    }

    return response.data
  }

  /**
   * Get a transaction by ID
   * Endpoint: GET /payments/transactions/:transactionId
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    const response = await this.requestWithRetry<APIResponse<Transaction>>(
      'get',
      `/payments/transactions/${transactionId}`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Transaction not found', 'TRANSACTION_NOT_FOUND')
    }

    return response.data
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string): Promise<Transaction['status']> {
    const transaction = await this.verifyTransaction(transactionId)
    return transaction.status
  }

  /**
   * List transactions
   * Endpoint: GET /payments/transactions
   */
  async listTransactions(page = 0, size = 20): Promise<PaginatedData<Transaction>> {
    const response = await this.requestWithRetry<APIResponse<PaginatedData<Transaction>>>(
      'get',
      `/payments/transactions?page=${page}&size=${size}`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Failed to list transactions', 'LIST_TRANSACTIONS_FAILED')
    }

    return response.data
  }

  // ==========================================================================
  // Subscriptions
  // ==========================================================================

  /**
   * Get a subscription by ID
   * Endpoint: GET /subscriptions/sdk/:subscriptionId
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await this.requestWithRetry<APIResponse<Subscription>>(
      'get',
      `/subscriptions/sdk/${subscriptionId}`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Subscription not found', 'SUBSCRIPTION_NOT_FOUND')
    }

    return response.data
  }

  /**
   * List subscriptions for this merchant
   * Endpoint: GET /subscriptions/sdk
   */
  async listSubscriptions(page = 0, size = 20): Promise<PaginatedData<Subscription>> {
    const response = await this.requestWithRetry<APIResponse<PaginatedData<Subscription>>>(
      'get',
      `/subscriptions/sdk?page=${page}&size=${size}`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Failed to list subscriptions', 'LIST_SUBSCRIPTIONS_FAILED')
    }

    return response.data
  }

  /**
   * Cancel a subscription (merchant-initiated)
   * Endpoint: POST /subscriptions/sdk/:subscriptionId/cancel
   */
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await this.requestWithRetry<APIResponse<Subscription>>(
      'post',
      `/subscriptions/sdk/${subscriptionId}/cancel`
    )

    if (!response.success || !response.data) {
      throw new StrimzError('Failed to cancel subscription', 'SUBSCRIPTION_CANCEL_FAILED')
    }

    return response.data
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export const createAPIClient = (config: APIClientConfig): APIClient => {
  return new APIClient(config)
}