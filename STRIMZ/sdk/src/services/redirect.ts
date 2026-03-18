/**
 * Redirect Service
 * Handles payment flow redirects
 * Updated: uses session.sessionId (not session.id) for checkout URLs
 */

import type { PaymentSession, Environment } from '../types'
import { buildCheckoutUrl } from '../utils/url'

export class RedirectService {
  private environment: Environment

  constructor(environment: Environment = 'live') {
    this.environment = environment
  }

  redirectToCheckout(session: PaymentSession): void {
    if (typeof window === 'undefined') {
      throw new Error(
        'redirectToCheckout can only be called in a browser environment. ' +
        'Use session.checkoutUrl on the server side.'
      )
    }

    // Use checkoutUrl directly if available, otherwise build from sessionId
    const checkoutUrl = session.checkoutUrl || buildCheckoutUrl(session.sessionId, this.environment)
    window.location.href = checkoutUrl
  }

  openCheckoutInNewWindow(session: PaymentSession): Window | null {
    if (typeof window === 'undefined') {
      throw new Error('openCheckoutInNewWindow can only be called in a browser environment')
    }

    const checkoutUrl = session.checkoutUrl || buildCheckoutUrl(session.sessionId, this.environment)
    return window.open(checkoutUrl, '_blank')
  }

  getCheckoutUrl(session: PaymentSession): string {
    return session.checkoutUrl || buildCheckoutUrl(session.sessionId, this.environment)
  }
}

export const createRedirectService = (environment: Environment = 'live'): RedirectService => {
  return new RedirectService(environment)
}