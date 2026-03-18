'use client'

import { useSearchParams } from 'next/navigation'
import { parsePaymentResult } from '@strimz/sdk'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Parse payment result from URL
    const paymentResult = parsePaymentResult(window.location.href)
    setResult(paymentResult)

    // Optionally verify transaction on the server
    if (paymentResult?.transactionId) {
      verifyTransaction(paymentResult.transactionId)
    }
  }, [])

  const verifyTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/verify-transaction?id=${transactionId}`)
      const data = await response.json()
      console.log('Server verification:', data)
    } catch (error) {
      console.error('Verification error:', error)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (result.status !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Payment Failed</h1>
          <p className="text-gray-600 mb-8">{result.message || 'Something went wrong'}</p>
          <a href="/" className="text-blue-500 hover:underline">
            Return to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-green-500"
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

        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. You should receive a confirmation email shortly.
        </p>

        <div className="bg-gray-100 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4">Payment Details:</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono">{result.paymentId}</span>
            </div>
            {result.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono">{result.transactionId}</span>
              </div>
            )}
            {result.subscriptionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Subscription ID:</span>
                <span className="font-mono">{result.subscriptionId}</span>
              </div>
            )}
          </div>
        </div>

        <a
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
