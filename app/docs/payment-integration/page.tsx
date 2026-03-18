import React from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'
import CodeBlock from '@/components/docs/CodeBlock'

export const metadata: Metadata = {
    title: 'Payment Integration - Strimz SDK Documentation',
    description: 'Implement one-time and recurring subscription payments with crypto. Learn the complete payment flow for your SaaS, e-commerce, or membership platform.',
    openGraph: {
        title: 'Payment Integration with Strimz SDK',
        description: 'Implement one-time and recurring subscription payments with crypto for your platform.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Payment Integration',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Payment Integration with Strimz SDK',
        description: 'Implement one-time and recurring subscription payments with crypto for your platform.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Payment Integration',
            },
        ],
    },
}

export default function PaymentIntegration() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    Payment Integration
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Learn how to integrate Strimz payments into your application and handle various payment flows.
                </p>
            </div>

            {/* Payment Flow Overview */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Payment Flow Overview</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-6">
                    The Strimz payment flow consists of the following steps:
                </p>

                <div className="space-y-4 mb-6">
                    {[
                        { step: '1', title: 'User clicks "Pay with Strimz"', desc: 'Customer initiates payment on your platform' },
                        { step: '2', title: 'Payment modal opens', desc: 'Strimz payment widget displays with wallet connection options' },
                        { step: '3', title: 'User connects wallet', desc: 'Customer connects their crypto wallet (MetaMask, WalletConnect, etc.)' },
                        { step: '4', title: 'User approves transaction', desc: 'Customer approves the blockchain transaction in their wallet' },
                        { step: '5', title: 'Transaction confirmed', desc: 'Payment is verified on-chain and service is activated' },
                        { step: '6', title: 'Webhook sent', desc: 'Your server receives a webhook notification with transaction details' }
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                                {item.step}
                            </div>
                            <div>
                                <h4 className="text-white font-poppins font-[600] text-base mb-1">{item.title}</h4>
                                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Types */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Supported Payment Types</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-6">
                    Strimz supports the following payment types for your business:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { type: 'one-time', name: 'One-time Payments', desc: 'Single checkout payments for products or services' },
                        { type: 'subscription', name: 'Recurring Subscriptions', desc: 'Automated billing cycles (daily, weekly, monthly, yearly)' }
                    ].map((service) => (
                        <div key={service.type} className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">{service.name}</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-2">{service.desc}</p>
                            <code className="px-2 py-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-xs text-accent">
                                paymentType: &apos;{service.type}&apos;
                            </code>
                        </div>
                    ))}
                </div>
            </div>

            {/* Basic Implementation */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Basic Implementation</h2>

                {/* React Example */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">React / Next.js</h3>
                    <CodeBlock
                        language="tsx"
                        code={`'use client'
import { useState } from 'react'
import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: process.env.NEXT_PUBLIC_STRIMZ_PUBLIC_KEY!,
  environment: 'live'
})

export function PaymentButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await strimz.initializePayment({
        amount: 2999, // $29.99 in cents
        currency: 'USD',
        paymentType: 'subscription',
        interval: 'monthly',
        customerEmail: 'customer@example.com',
        metadata: {
          planId: 'plan_pro_monthly',
          planName: 'Pro Plan',
          userId: 'user_123'
        }
      })

      if (result.status === 'success') {
        // Payment successful
        console.log('Transaction ID:', result.transactionId)
        alert('Payment successful!')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-3 bg-accent text-white rounded-lg font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay with Strimz'}
      </button>
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}`}
                    />
                </div>

                {/* Vanilla JS Example */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Vanilla JavaScript</h3>
                    <CodeBlock
                        language="javascript"
                        code={`import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: 'STRZlive_your_public_key',
  environment: 'live'
})

const paymentButton = document.getElementById('pay-button')

paymentButton.addEventListener('click', async () => {
  try {
    const result = await strimz.initializePayment({
      amount: 9999,
      currency: 'USD',
      paymentType: 'one-time',
      customerEmail: 'customer@example.com',
      metadata: {
        productId: 'prod_abc123',
        productName: 'Premium Course'
      }
    })

    if (result.status === 'success') {
      console.log('Payment successful:', result)
      // Update UI, redirect, etc.
    }
  } catch (error) {
    console.error('Payment failed:', error)
    alert('Payment failed: ' + error.message)
  }
})`}
                    />
                </div>
            </div>

            {/* Payment Options */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Payment Configuration</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    The <code className="px-2 py-1 bg-[#1a1a1a] rounded text-sm">initializePayment</code> method accepts the following parameters:
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1a1a1a]">
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Parameter</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Type</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Required</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#0a0a0a]">
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">amount</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">number</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Yes</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Payment amount in cents (e.g., 5000 = $50.00)</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">currency</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">string</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Yes</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Currency code (USD)</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">serviceType</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">string</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Yes</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Type of service (electricity, airtime, data, cable)</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">customerEmail</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">string</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Yes</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Customer&apos;s email address for receipt</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">metadata</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">object</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">No</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Additional data specific to the service type</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">onSuccess</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">function</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">No</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Callback function for successful payment</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">onError</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">function</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">No</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Callback function for payment errors</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Response Handling */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Response Handling</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    The payment response includes the following structure:
                </p>

                <CodeBlock
                    language="json"
                    code={`// Success Response
{
  "status": "success",
  "transactionId": "trx_1234567890abcdef",
  "amount": 2999,
  "currency": "USD",
  "paymentType": "subscription",
  "interval": "monthly",
  "subscriptionId": "sub_abc123xyz",
  "nextBillingDate": "2025-02-08T10:30:00Z",
  "timestamp": "2025-01-08T10:30:00Z"
}

// Error Response
{
  "status": "error",
  "code": "INSUFFICIENT_BALANCE",
  "message": "Insufficient wallet balance",
  "timestamp": "2025-01-08T10:30:00Z"
}`}
                />

                <div className="space-y-4">
                    <div className="p-4 border border-green-700/30 bg-green-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-green-300 font-poppins font-[600] text-sm mb-1">Success Status</h4>
                                <p className="text-green-300 font-poppins font-[400] text-sm">
                                    Payment completed successfully. Update your UI and notify the user.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-red-300 font-poppins font-[600] text-sm mb-1">Error Status</h4>
                                <p className="text-red-300 font-poppins font-[400] text-sm">
                                    Payment failed. Display error message to the user.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-yellow-900 bg-yellow-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-yellow-300 font-poppins font-[600] text-sm mb-1">Pending Status</h4>
                                <p className="text-yellow-300 font-poppins font-[400] text-sm">
                                    Payment is being processed. Wait for webhook confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Examples */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Payment Examples</h2>

                <div className="space-y-6">
                    {/* One-time Payment */}
                    <div>
                        <h3 className="text-white font-poppins font-[600] text-lg mb-3">One-time Payment</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Accept a single payment for a product or service:
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`const result = await strimz.initializePayment({
  amount: 9999, // $99.99
  currency: 'USD',
  paymentType: 'one-time',
  customerEmail: 'customer@example.com',
  metadata: {
    productId: 'prod_abc123',
    productName: 'Premium Course',
    orderId: 'order_xyz789'
  }
})`}
                        />
                    </div>

                    {/* Monthly Subscription */}
                    <div>
                        <h3 className="text-white font-poppins font-[600] text-lg mb-3">Monthly Subscription</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Set up automated monthly recurring payments:
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`const result = await strimz.initializePayment({
  amount: 2999, // $29.99/month
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'monthly',
  customerEmail: 'customer@example.com',
  metadata: {
    planId: 'plan_pro_monthly',
    planName: 'Pro Plan',
    userId: 'user_123'
  }
})`}
                        />
                    </div>

                    {/* Yearly Subscription */}
                    <div>
                        <h3 className="text-white font-poppins font-[600] text-lg mb-3">Yearly Subscription</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Annual billing with automated renewal:
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`const result = await strimz.initializePayment({
  amount: 29999, // $299.99/year
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'yearly',
  customerEmail: 'customer@example.com',
  metadata: {
    planId: 'plan_enterprise_yearly',
    planName: 'Enterprise Plan',
    userId: 'user_123',
    discount: '20% annual discount'
  }
})`}
                        />
                    </div>

                    {/* Custom Interval Subscription */}
                    <div>
                        <h3 className="text-white font-poppins font-[600] text-lg mb-3">Custom Interval Subscription</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Weekly, daily, or custom billing cycles:
                        </p>
                        <CodeBlock
                            language="typescript"
                            code={`const result = await strimz.initializePayment({
  amount: 999, // $9.99/week
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'weekly', // or 'daily', 'bi-weekly', 'quarterly'
  customerEmail: 'customer@example.com',
  metadata: {
    planId: 'plan_premium_weekly',
    planName: 'Weekly Premium Access',
    userId: 'user_123'
  }
})`}
                        />
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Next: Webhooks</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    Learn how to set up webhooks to receive real-time payment notifications on your server.
                </p>
                <Link
                    href="/docs/webhooks"
                    className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                >
                    Configure Webhooks
                </Link>
            </div>
        </div>
    )
}
