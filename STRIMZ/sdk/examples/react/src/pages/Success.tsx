import { useEffect, useState } from 'react'
import { parsePaymentResultFromWindow } from '@strimz/sdk'
import type { PaymentResult } from '@strimz/sdk'

export default function Success() {
  const [result, setResult] = useState<PaymentResult | null>(null)

  useEffect(() => {
    const paymentResult = parsePaymentResultFromWindow()
    setResult(paymentResult)
  }, [])

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (result.status !== 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', color: '#ef4444', marginBottom: '16px' }}>Payment Failed</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            {result.message || 'Something went wrong'}
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#6366f1',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ marginBottom: '24px' }}>
          <svg
            style={{ width: '80px', height: '80px', margin: '0 auto', color: '#10b981' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Payment Successful!</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Thank you for your payment. You should receive a confirmation email shortly.
        </p>

        <div
          style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left'
          }}
        >
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Payment Details:</h2>
          <div style={{ fontSize: '14px' }}>
            {result.paymentId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>Payment ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{result.paymentId}</span>
              </div>
            )}
            {result.transactionId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{result.transactionId}</span>
              </div>
            )}
            {result.subscriptionId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>Subscription ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{result.subscriptionId}</span>
              </div>
            )}
          </div>
        </div>

        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#6366f1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
