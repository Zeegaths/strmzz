import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.strimz.com/api/v1'
console.log('[Checkout] API_BASE:', API_BASE)

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

export function useCheckoutSession(sessionId: string | null) {
  const [session, setSession] = useState<CheckoutSessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      setError('No session ID provided')
      return
    }

    const fetchSession = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('[Checkout] Fetching:', `${API_BASE}/payments/checkout/${sessionId}`)

        const res = await fetch(`${API_BASE}/payments/checkout/${sessionId}`)
        const json = await res.json()
        console.log('[Checkout] Response:', json)

        if (!res.ok || !json.success) {
          setError(json.error || json.message || 'Session not found or expired')
          return
        }

        setSession(json.data)
      } catch (err: any) {
        setError(err.message || 'Failed to load payment session')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  /**
   * Report submitted tx hash back to the backend
   * so the indexer knows to watch for it
   */
  const reportSubmitted = async (transactionHash: string) => {
    if (!sessionId) return
    try {
      await fetch(`${API_BASE}/payments/checkout/${sessionId}/submitted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionHash }),
      })
    } catch (err) {
      console.error('Failed to report transaction:', err)
    }
  }

  return { session, loading, error, reportSubmitted }
}