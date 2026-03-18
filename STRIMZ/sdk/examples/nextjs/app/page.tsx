import { StrimzButton } from '@strimz/sdk/react'

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Strimz Payment Example</h1>

      <div className="grid grid-cols-3 gap-8 max-w-6xl">
        {/* Free Plan */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-gray-600 mb-4">Perfect for getting started</p>
          <p className="text-3xl font-bold mb-6">$0</p>
          <button className="w-full py-2 px-4 bg-gray-200 rounded">
            Current Plan
          </button>
        </div>

        {/* Pro Plan - One-time */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <p className="text-gray-600 mb-4">One-time payment</p>
          <p className="text-3xl font-bold mb-6">$49.99</p>
          <StrimzButton
            amount={4999}
            paymentType="one-time"
            successUrl={`${process.env.NEXT_PUBLIC_APP_URL}/success`}
            cancelUrl={`${process.env.NEXT_PUBLIC_APP_URL}`}
            metadata={{
              planId: 'pro_onetime',
              planName: 'Pro Plan (One-time)',
              userId: 'user_demo_123'
            }}
            onSessionCreated={(session) => {
              console.log('Payment session created:', session.id)
            }}
            onError={(error) => {
              console.error('Payment error:', error)
              alert('Payment failed. Please try again.')
            }}
          >
            Buy Now - $49.99
          </StrimzButton>
        </div>

        {/* Premium Plan - Subscription */}
        <div className="border rounded-lg p-6 border-blue-500">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm inline-block mb-2">
            Most Popular
          </div>
          <h2 className="text-2xl font-bold mb-2">Premium</h2>
          <p className="text-gray-600 mb-4">Monthly subscription</p>
          <p className="text-3xl font-bold mb-6">
            $29.99<span className="text-sm text-gray-600">/mo</span>
          </p>
          <StrimzButton
            amount={2999}
            paymentType="subscription"
            interval="monthly"
            successUrl={`${process.env.NEXT_PUBLIC_APP_URL}/success`}
            cancelUrl={`${process.env.NEXT_PUBLIC_APP_URL}`}
            metadata={{
              planId: 'premium_monthly',
              planName: 'Premium Plan',
              userId: 'user_demo_123'
            }}
            onSessionCreated={(session) => {
              console.log('Subscription session created:', session.id)
            }}
            onError={(error) => {
              console.error('Subscription error:', error)
              alert('Subscription failed. Please try again.')
            }}
          >
            Subscribe - $29.99/month
          </StrimzButton>
        </div>
      </div>

      {/* Custom Implementation Example */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Custom Implementation</h2>
        <CustomCheckoutButton />
      </div>
    </main>
  )
}

// Custom checkout button using useStrimzSDK hook
function CustomCheckoutButton() {
  'use client'

  const { useStrimzSDK } = require('@strimz/sdk/react')
  const sdk = useStrimzSDK()

  const handleCheckout = async () => {
    try {
      await sdk.redirectToCheckout({
        amount: 1999,
        paymentType: 'one-time',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.origin,
        metadata: {
          productId: 'custom_product',
          productName: 'Custom Product'
        }
      })
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed')
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
    >
      Custom Checkout - $19.99
    </button>
  )
}
