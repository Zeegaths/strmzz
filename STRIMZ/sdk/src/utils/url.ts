/**
 * URL Building Utilities
 * Updated for new backend API structure
 */

import type { PaymentSession, PaymentResult, Environment } from '../types'

// ============================================================================
// Constants — Update these when deploying
// ============================================================================

export const API_URLS = {
  live: 'https://api.strimz.com/api/v1',
  test: 'https://api-test.strimz.com/api/v1'
} as const

export const CHECKOUT_URLS = {
  live: 'https://pay.strimz.com/payment',
  test: 'https://pay-test.strimz.com/payment'
} as const

// ============================================================================
// URL Building
// ============================================================================

export const getApiUrl = (environment: Environment = 'live', customUrl?: string): string => {
  if (customUrl) return customUrl
  return API_URLS[environment]
}

export const getCheckoutUrl = (environment: Environment = 'live'): string => {
  return CHECKOUT_URLS[environment]
}

export const buildCheckoutUrl = (
  sessionId: string,
  environment: Environment = 'live'
): string => {
  const baseUrl = getCheckoutUrl(environment)
  const url = new URL(baseUrl)
  url.searchParams.set('session', sessionId)
  return url.toString()
}

export const buildApiEndpoint = (
  path: string,
  environment: Environment = 'live',
  customUrl?: string
): string => {
  const baseUrl = getApiUrl(environment, customUrl)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}/${cleanPath}`
}

// ============================================================================
// URL Parsing
// ============================================================================

export const parsePaymentResult = (url: string | URL): PaymentResult | null => {
  try {
    const urlObj = typeof url === 'string' ? new URL(url) : url
    const params = urlObj.searchParams

    const status = params.get('status') as PaymentResult['status']
    if (!status) return null

    return {
      status,
      paymentId: params.get('payment_id') || undefined,
      transactionId: params.get('transaction_id') || undefined,
      subscriptionId: params.get('subscription_id') || undefined,
      sessionId: params.get('session_id') || undefined,
      message: params.get('message') || undefined,
    }
  } catch {
    return null
  }
}

export const parsePaymentResultFromWindow = (): PaymentResult | null => {
  if (typeof window === 'undefined') return null
  return parsePaymentResult(window.location.href)
}

export const isValidHttpsUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export const addQueryParams = (
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string => {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

// ============================================================================
// Redirect Functions (Browser Only)
// ============================================================================

export const redirectToCheckout = (checkoutUrl: string): void => {
  if (typeof window === 'undefined') {
    throw new Error('redirectToCheckout can only be called in a browser environment')
  }
  window.location.href = checkoutUrl
}

export const redirectToCheckoutWithSession = (
  session: PaymentSession,
  environment: Environment = 'live'
): void => {
  const checkoutUrl = buildCheckoutUrl(session.sessionId, environment)
  redirectToCheckout(checkoutUrl)
}

export const buildSuccessUrl = (
  baseUrl: string,
  result: Partial<PaymentResult>
): string => {
  return addQueryParams(baseUrl, {
    status: result.status,
    payment_id: result.paymentId,
    transaction_id: result.transactionId,
    subscription_id: result.subscriptionId,
    session_id: result.sessionId,
    message: result.message,
  })
}

export const buildCancelUrl = (
  baseUrl: string,
  sessionId: string
): string => {
  return addQueryParams(baseUrl, {
    status: 'cancelled',
    session_id: sessionId,
  })
}