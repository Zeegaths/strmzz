import { StrimzButton, useStrimzSDK } from '@strimz/sdk/react'

export default function Home() {
  const sdk = useStrimzSDK()

  const handleCustomCheckout = async () => {
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
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px' }}>Strimz Payment Example - React</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '64px'
        }}
      >
        {/* Free Plan */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>Free</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Perfect for getting started</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>$0</p>
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: '#e5e7eb',
              border: 'none',
              borderRadius: '8px',
              cursor: 'not-allowed'
            }}
            disabled
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>Pro</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>One-time payment</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>$49.99</p>
          <StrimzButton
            amount={4999}
            paymentType="one-time"
            successUrl={`${window.location.origin}/success`}
            cancelUrl={window.location.origin}
            metadata={{
              planId: 'pro_onetime',
              planName: 'Pro Plan'
            }}
            onSessionCreated={(session) => {
              console.log('Session created:', session.id)
            }}
            onError={(error) => {
              console.error('Payment error:', error)
              alert('Payment failed. Please try again.')
            }}
          >
            Buy Now - $49.99
          </StrimzButton>
        </div>

        {/* Premium Plan */}
        <div
          style={{
            border: '2px solid #6366f1',
            borderRadius: '12px',
            padding: '32px',
            position: 'relative'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-12px',
              left: '16px',
              background: '#6366f1',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            Most Popular
          </span>
          <h2 style={{ marginBottom: '8px' }}>Premium</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Monthly subscription</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>
            $29.99<span style={{ fontSize: '16px', color: '#6b7280' }}>/mo</span>
          </p>
          <StrimzButton
            amount={2999}
            paymentType="subscription"
            interval="monthly"
            successUrl={`${window.location.origin}/success`}
            cancelUrl={window.location.origin}
            metadata={{
              planId: 'premium_monthly',
              planName: 'Premium Plan'
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

      {/* Custom Implementation */}
      <div>
        <h2 style={{ marginBottom: '16px' }}>Custom Implementation</h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Using the <code>useStrimzSDK</code> hook for custom checkout logic
        </p>
        <button
          onClick={handleCustomCheckout}
          style={{
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Custom Checkout - $19.99
        </button>
      </div>
    </div>
  )
}
