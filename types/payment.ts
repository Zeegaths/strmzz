import { z } from 'zod'

// Checkout flow steps
export type CheckoutStep =
  | 'loading'
  | 'error'
  | 'connect'
  | 'approve'
  | 'pay'
  | 'processing'
  | 'confirmed'

// Session data from API
export interface CheckoutSessionData {
  sessionId: string
  type: 'one_time' | 'subscription'
  amount: number
  currency: 'USDC' | 'USDT'
  status: string
  merchantName: string
  merchantWallet: string
  merchantOnChainId: string
  description?: string
  subscriptionInterval?: string
  successUrl?: string
  cancelUrl?: string
}

// Keep old schemas for other parts of the app that still use them
export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type EmailInput = z.infer<typeof emailSchema>
export type LoginInput = z.infer<typeof loginSchema>

// Legacy exports (kept for other components that import these)
export type PaymentStep = 'email' | 'payment' | 'wallet-payment' | 'confirmed'

export interface UserWallet {
  username: string
  balance: number
  token: string
  hasInsufficientBalance: boolean
}

export interface PaymentData {
  brandName: string
  brandLogo: string
  tokenLogo: string
  totalAmount: string
  planName: string
  billingPeriod: string
  planPrice: string
  subtotal: string
  tax: string
  totalDue: string
  walletAddress?: string
  qrCode?: string
}