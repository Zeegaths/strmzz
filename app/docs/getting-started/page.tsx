import React from 'react'
import Link from 'next/link'
import { ArrowRight, Terminal, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'
import CodeBlock from '@/components/docs/CodeBlock'

export const metadata: Metadata = {
    title: 'Getting Started - Strimz SDK Documentation',
    description: 'Learn how to integrate Strimz SDK into your application and start accepting crypto payments in minutes. Install via npm, configure API keys, and implement the payment flow.',
    openGraph: {
        title: 'Getting Started with Strimz SDK',
        description: 'Integrate Strimz SDK and start accepting crypto payments in minutes.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Getting Started',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Getting Started with Strimz SDK',
        description: 'Integrate Strimz SDK and start accepting crypto payments in minutes.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Getting Started',
            },
        ],
    },
}

export default function GettingStarted() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    Getting Started
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Learn how to integrate Strimz SDK into your application and start accepting crypto payments in minutes.
                </p>
            </div>

            {/* Prerequisites */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Prerequisites</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Before you begin, make sure you have:
                </p>
                <ul className="space-y-3">
                    {[
                        'A Strimz business account with API keys',
                        'Node.js 18+ installed on your machine',
                        'Basic knowledge of React or JavaScript',
                        'A project where you want to integrate payments'
                    ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-[#a0a0a0] font-poppins font-[400] text-base">{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-[8px]">
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                        <strong className="text-white">Don&apos;t have API keys yet?</strong>{' '}
                        <Link href="/auth/business/signup" className="text-accent hover:underline">
                            Sign up for a business account
                        </Link>{' '}
                        to get your live and test API keys.
                    </p>
                </div>
            </div>

            {/* Installation */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Installation</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Install the Strimz SDK using your preferred package manager:
                </p>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-[#a0a0a0]" />
                            <span className="text-[#a0a0a0] font-poppins font-[500] text-sm">npm</span>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-[8px] p-4 overflow-x-auto">
                            <code className="text-[#d4d4d4] font-mono text-sm">
                                npm install @strimz/sdk
                            </code>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-[#a0a0a0]" />
                            <span className="text-[#a0a0a0] font-poppins font-[500] text-sm">yarn</span>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-[8px] p-4 overflow-x-auto">
                            <code className="text-[#d4d4d4] font-mono text-sm">
                                yarn add @strimz/sdk
                            </code>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-[#a0a0a0]" />
                            <span className="text-[#a0a0a0] font-poppins font-[500] text-sm">pnpm</span>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-[8px] p-4 overflow-x-auto">
                            <code className="text-[#d4d4d4] font-mono text-sm">
                                pnpm add @strimz/sdk
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Quick Start</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-6">
                    Here&apos;s a basic example to get you started with Strimz SDK:
                </p>

                {/* Step 1: Initialize */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">1. Initialize the SDK</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                        First, initialize the Strimz SDK with your public API key:
                    </p>
                    <CodeBlock
                        language="typescript"
                        code={`import { StrimzSDK } from '@strimz/sdk'

// Initialize with your public key
const strimz = new StrimzSDK({
  publicKey: 'STRZlive_your_public_key_here',
  environment: 'live' // or 'test' for testing
})`}
                    />
                </div>

                {/* Step 2: Add Payment Button */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">2. Add the Payment Button</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                        Add the &quot;Pay with Strimz&quot; button to your application:
                    </p>
                    <CodeBlock
                        language="typescript"
                        code={`import { StrimzButton } from '@strimz/sdk'

function PaymentPage() {
  const handlePayment = async () => {
    try {
      const payment = await strimz.initializePayment({
        amount: 2999, // Amount in cents ($29.99)
        currency: 'USD',
        paymentType: 'subscription',
        interval: 'monthly',
        customerEmail: 'customer@example.com',
        metadata: {
          planId: 'plan_pro_monthly',
          planName: 'Pro Plan'
        }
      })

      console.log('Payment successful:', payment)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <StrimzButton
      onClick={handlePayment}
      text="Pay with Strimz"
    />
  )
}`}
                    />
                </div>

                {/* Step 3: Handle Response */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">3. Handle the Payment Response</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                        Process the payment response and update your UI:
                    </p>
                    <CodeBlock
                        language="typescript"
                        code={`const handlePayment = async () => {
  try {
    const result = await strimz.initializePayment({
      amount: 9999,
      currency: 'USD',
      paymentType: 'one-time',
      customerEmail: 'customer@example.com'
    })

    if (result.status === 'success') {
      // Payment successful
      console.log('Transaction ID:', result.transactionId)

      // Update your UI or redirect user
      showSuccessMessage('Payment completed successfully!')
    }
  } catch (error) {
    // Handle error
    console.error('Payment error:', error.message)
    showErrorMessage('Payment failed. Please try again.')
  }
}`}
                    />
                </div>
            </div>

            {/* Environment Variables */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Environment Variables</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Store your API keys securely using environment variables:
                </p>
                <CodeBlock
                    language="bash"
                    code={`# .env.local
NEXT_PUBLIC_STRIMZ_PUBLIC_KEY=STRZlive_your_public_key
STRIMZ_SECRET_KEY=STRZ_your_secret_key

# For testing
NEXT_PUBLIC_STRIMZ_TEST_PUBLIC_KEY=STRZtest_your_test_public_key
STRIMZ_TEST_SECRET_KEY=STRZtest_your_test_secret_key`}
                />
                <div className="mt-4 p-4 bg-yellow-950/20 border border-yellow-700/30 rounded-[8px]">
                    <p className="text-sm text-yellow-300 font-poppins">
                        <strong>⚠️ Security Warning:</strong> Never expose your secret key in client-side code. Only use the public key on the frontend.
                    </p>
                </div>
            </div>

            {/* Testing */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Testing Your Integration</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Use test mode to verify your integration without processing real payments:
                </p>
                <CodeBlock
                    language="typescript"
                    code={`const strimz = new StrimzSDK({
  publicKey: process.env.NEXT_PUBLIC_STRIMZ_TEST_PUBLIC_KEY,
  environment: 'test' // Use test mode
})`}
                />
                <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[8px]">
                    <h4 className="text-white font-poppins font-[600] text-sm mb-2">Test Mode Features:</h4>
                    <ul className="space-y-2">
                        {[
                            'No real money is charged',
                            'Test all payment flows safely',
                            'View test transactions in your dashboard',
                            'Test webhook notifications'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-accent">•</span>
                                <span className="text-[#a0a0a0] font-poppins font-[400] text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-4">Next Steps</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link
                        href="/docs/authentication"
                        className="p-4 bg-[#1a1a1a] rounded-[8px] border border-[#2a2a2a] hover:border-accent transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-poppins font-[600] text-base">Authentication</h4>
                            <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Learn how to authenticate API requests
                        </p>
                    </Link>
                    <Link
                        href="/docs/payment-integration"
                        className="p-4 bg-[#1a1a1a] rounded-[8px] border border-[#2a2a2a] hover:border-accent transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-poppins font-[600] text-base">Payment Integration</h4>
                            <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Deep dive into payment implementation
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
