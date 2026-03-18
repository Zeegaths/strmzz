/**
 * Strimz Button Component
 * Pre-built payment button with automatic checkout redirect
 */

import React, { useState, useCallback } from 'react'
import { useStrimzSDK } from './StrimzProvider'
import type {
  PaymentOptions,
  PaymentSession,
  PaymentType,
  SubscriptionInterval,
  Currency
} from '../types'

// ============================================================================
// Button Props
// ============================================================================

export interface StrimzButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onError'> {
  // Payment configuration
  amount: number
  paymentType: PaymentType
  interval?: SubscriptionInterval
  currency?: Currency
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, any>

  // Callbacks
  onSessionCreated?: (session: PaymentSession) => void
  onError?: (error: Error) => void

  // Loading state
  loading?: boolean
  loadingText?: string

  // Children (button text)
  children: React.ReactNode
}

// ============================================================================
// Strimz Button Component
// ============================================================================

export const StrimzButton: React.FC<StrimzButtonProps> = ({
  amount,
  paymentType,
  interval,
  currency = 'USD',
  customerEmail,
  successUrl,
  cancelUrl,
  metadata,
  onSessionCreated,
  onError,
  loading: externalLoading,
  loadingText = 'Processing...',
  children,
  disabled,
  className,
  style,
  ...buttonProps
}) => {
  const sdk = useStrimzSDK()
  const [internalLoading, setInternalLoading] = useState(false)

  // Use external loading if provided, otherwise use internal state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  /**
   * Handle button click - create session and redirect to checkout
   */
  const handleClick = useCallback(async () => {
    setInternalLoading(true)

    try {
      // Build payment options
      const options: PaymentOptions = {
        amount,
        currency,
        paymentType,
        successUrl,
        cancelUrl,
        customerEmail,
        metadata,
        ...(paymentType === 'subscription' && interval ? { interval } : {})
      } as PaymentOptions

      // Create payment session
      const session = await sdk.createPaymentSession(options)

      // Call onSessionCreated callback if provided
      onSessionCreated?.(session)

      // Redirect to checkout
      await sdk.redirectToCheckout(options)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create payment session')

      // Call onError callback if provided
      onError?.(err)

      // Re-throw error if no error handler provided
      if (!onError) {
        console.error('[Strimz Button] Payment session creation failed:', err)
      }

      setInternalLoading(false)
    }
  }, [
    sdk,
    amount,
    currency,
    paymentType,
    interval,
    successUrl,
    cancelUrl,
    customerEmail,
    metadata,
    onSessionCreated,
    onError
  ])

  // Default styles (can be overridden)
  const defaultStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#02c76a',
    color: 'white',
    cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
    opacity: isLoading || disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    ...style
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={className}
      style={defaultStyle}
      {...buttonProps}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}

// ============================================================================
// Default Export
// ============================================================================

export default StrimzButton
