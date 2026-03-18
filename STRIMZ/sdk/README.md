# @strimz/sdk

> Accept crypto payments with one-time and recurring subscription support

[![npm version](https://img.shields.io/npm/v/@strimz/sdk.svg)](https://www.npmjs.com/package/@strimz/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official Strimz SDK for accepting cryptocurrency payments (USDC & USDT) with support for one-time payments and recurring subscriptions.

## Features

- **Easy Integration**: Get started in under 10 minutes
- **Hosted Checkout**: Secure, PCI-compliant payment page hosted by Strimz
- **Payment Types**: One-time payments and recurring subscriptions (daily, weekly, monthly, yearly)
- **TypeScript First**: Fully typed with TypeScript for great developer experience
- **Framework Agnostic**: Works with React, Vue, Angular, vanilla JS, and Node.js
- **Modular Design**: Import only what you need - tree-shakeable and lightweight
- **Server-Side Verification**: Built-in transaction verification and webhook handling
- **Test Mode**: Full test mode support for development

## Installation

```bash
npm install @strimz/sdk
# or
yarn add @strimz/sdk
# or
pnpm add @strimz/sdk
```

## Quick Start

### 1. Client-Side Usage (Browser)

```typescript
import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: 'STRZlive_your_public_key',
  environment: 'live' // or 'test'
})

// Create payment and redirect to checkout
await strimz.redirectToCheckout({
  amount: 2999, // Amount in cents ($29.99)
  paymentType: 'subscription',
  interval: 'monthly',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/pricing',
  metadata: {
    planId: 'pro',
    userId: 'user_123'
  }
})
```

### 2. React Components

```tsx
import { StrimzProvider, StrimzButton } from '@strimz/sdk/react'

function App() {
  return (
    <StrimzProvider publicKey="STRZlive_your_public_key">
      <StrimzButton
        amount={2999}
        paymentType="subscription"
        interval="monthly"
        successUrl="https://yourapp.com/success"
        cancelUrl="https://yourapp.com/pricing"
        metadata={{ planId: 'pro' }}
      >
        Subscribe for $29.99/month
      </StrimzButton>
    </StrimzProvider>
  )
}
```

### 3. Server-Side Verification (Node.js)

```typescript
import { StrimzServer } from '@strimz/sdk/server'

const strimzServer = new StrimzServer({
  secretKey: process.env.STRIMZ_SECRET_KEY
})

// Verify transaction
const transaction = await strimzServer.verifyTransaction('txn_123')
console.log(transaction.status) // 'success' | 'failed' | 'pending'

// Verify webhook
const isValid = strimzServer.verifyWebhookSignature(
  req.body,
  req.headers['strimz-signature'],
  process.env.STRIMZ_WEBHOOK_SECRET
)
```

## Payment Flow

1. **User clicks "Pay with Strimz"** → SDK creates payment session
2. **User redirected to hosted checkout** → `strimz-subscription.vercel.app/payment`
3. **User completes payment** → Connects wallet and pays with USDC/USDT
4. **User redirected back** → Returns to your app with payment status
5. **Webhook notification** → Your server receives real-time payment confirmation

## Documentation

### Client-Side SDK

#### Initialize SDK

```typescript
import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: 'STRZlive_...',
  environment: 'live', // or 'test'
  debug: false // Enable debug logging
})
```

#### Create Payment Session

```typescript
// One-time payment
const session = await strimz.createPaymentSession({
  amount: 4999, // $49.99
  currency: 'USD',
  paymentType: 'one-time',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/checkout',
  metadata: {
    orderId: 'order_123',
    productName: 'Premium Course'
  }
})

// Subscription payment
const session = await strimz.createPaymentSession({
  amount: 2999, // $29.99
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'monthly', // 'daily' | 'weekly' | 'monthly' | 'yearly'
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/pricing',
  metadata: {
    planId: 'pro_monthly',
    userId: 'user_123'
  }
})
```

#### Redirect to Checkout

```typescript
// Create session and redirect in one call
await strimz.redirectToCheckout({
  amount: 2999,
  paymentType: 'subscription',
  interval: 'monthly',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/pricing'
})

// Or open in new window
const checkoutWindow = await strimz.openCheckoutInNewWindow({
  amount: 2999,
  paymentType: 'one-time',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/checkout'
})
```

#### Handle Return from Checkout

```typescript
import { parsePaymentResultFromWindow } from '@strimz/sdk'

// On your success page
const result = parsePaymentResultFromWindow()

if (result && result.status === 'success') {
  console.log('Payment successful!', result.paymentId)
  console.log('Transaction ID:', result.transactionId)
}
```

### React Components

#### StrimzProvider

Wrap your app with the provider to use Strimz components and hooks:

```tsx
import { StrimzProvider } from '@strimz/sdk/react'

function App() {
  return (
    <StrimzProvider
      publicKey={process.env.NEXT_PUBLIC_STRIMZ_PUBLIC_KEY}
      environment="live"
    >
      <YourApp />
    </StrimzProvider>
  )
}
```

#### StrimzButton

Pre-built payment button with automatic checkout redirect:

```tsx
import { StrimzButton } from '@strimz/sdk/react'

<StrimzButton
  amount={2999}
  paymentType="subscription"
  interval="monthly"
  successUrl={`${window.location.origin}/success`}
  cancelUrl={`${window.location.origin}/pricing`}
  metadata={{
    planId: 'pro_monthly',
    userId: 'user_123'
  }}
  onSessionCreated={(session) => {
    console.log('Session created:', session.id)
  }}
  onError={(error) => {
    console.error('Payment error:', error)
  }}
  className="custom-button-class"
>
  Subscribe for $29.99/month
</StrimzButton>
```

#### useStrimz Hook

Access SDK instance in React components:

```tsx
import { useStrimzSDK } from '@strimz/sdk/react'

function CheckoutButton() {
  const sdk = useStrimzSDK()

  const handleCheckout = async () => {
    await sdk.redirectToCheckout({
      amount: 4999,
      paymentType: 'one-time',
      successUrl: '/success',
      cancelUrl: '/checkout'
    })
  }

  return <button onClick={handleCheckout}>Pay Now</button>
}
```

### Server-Side SDK

#### Initialize Server SDK

```typescript
import { StrimzServer } from '@strimz/sdk/server'

const strimzServer = new StrimzServer({
  secretKey: process.env.STRIMZ_SECRET_KEY,
  environment: 'live'
})
```

#### Verify Transaction

```typescript
// Verify a transaction by ID
const transaction = await strimzServer.verifyTransaction('txn_123abc')

console.log(transaction)
// {
//   id: 'txn_123abc',
//   status: 'success',
//   amount: 2999,
//   currency: 'USD',
//   paymentType: 'subscription',
//   interval: 'monthly',
//   subscriptionId: 'sub_456def',
//   customerEmail: 'user@example.com',
//   metadata: { planId: 'pro', userId: 'user_123' },
//   createdAt: '2025-01-08T12:00:00Z',
//   ...
// }
```

#### Webhook Handling

```typescript
import { verifyWebhook, constructEvent } from '@strimz/sdk/server'
import express from 'express'

const app = express()

app.post('/api/webhooks/strimz', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['strimz-signature'] as string
  const webhookSecret = process.env.STRIMZ_WEBHOOK_SECRET!

  try {
    // Verify and construct event
    const event = constructEvent(
      req.body,
      signature,
      webhookSecret
    )

    // Handle event
    switch (event.type) {
      case 'payment.success':
        const payment = event.data.payment
        console.log('Payment succeeded:', payment.id)
        // Grant access to user
        await grantSubscriptionAccess(payment.metadata.userId)
        break

      case 'payment.failed':
        console.log('Payment failed')
        break

      case 'subscription.created':
        console.log('Subscription created')
        break

      case 'subscription.cancelled':
        console.log('Subscription cancelled')
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook verification failed:', error)
    res.status(400).send('Webhook verification failed')
  }
})
```

## Error Handling

The SDK provides typed error classes for different scenarios:

```typescript
import {
  StrimzError,
  PaymentError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  isStrimzError
} from '@strimz/sdk'

try {
  await strimz.redirectToCheckout({ ... })
} catch (error) {
  if (isStrimzError(error)) {
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error details:', error.details)
  }
}
```

### Error Codes

| Code | Description | Retry? |
|------|-------------|--------|
| `INVALID_API_KEY` | Invalid or missing API key | No |
| `EXPIRED_API_KEY` | API key expired | No |
| `INVALID_AMOUNT` | Invalid payment amount | No |
| `INVALID_PAYMENT_TYPE` | Unsupported payment type | No |
| `INVALID_INTERVAL` | Invalid subscription interval | No |
| `SESSION_EXPIRED` | Payment session expired | No |
| `SESSION_NOT_FOUND` | Payment session not found | No |
| `NETWORK_ERROR` | Network connectivity error | Yes |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Yes |

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  PaymentOptions,
  PaymentSession,
  Transaction,
  WebhookEvent,
  OneTimePaymentOptions,
  SubscriptionPaymentOptions
} from '@strimz/sdk'

// Strong typing for payment options
const options: SubscriptionPaymentOptions = {
  amount: 2999,
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'monthly', // TypeScript ensures this is valid
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/pricing',
  metadata: {
    planId: 'pro',
    userId: 'user_123'
  }
}
```

## Environment Configuration

### Client-Side (Public Keys)

```env
# .env.local
NEXT_PUBLIC_STRIMZ_PUBLIC_KEY=STRZlive_pk_abc123...
```

### Server-Side (Secret Keys)

```env
# .env (server-only)
STRIMZ_SECRET_KEY=STRZ_sk_xyz789...
STRIMZ_WEBHOOK_SECRET=whsec_abc123...
```

## Examples

Check out the `/examples` directory for complete integration examples:

- **Next.js App Router** - Full-stack Next.js 14+ example
- **React SPA** - Client-side React application
- **Vanilla JS** - Pure JavaScript implementation
- **Express Server** - Node.js backend with webhook handling

## API Reference

For complete API documentation, visit: [https://strimz-subscription.vercel.app/docs](https://strimz-subscription.vercel.app/docs)

## Support

- **Email**: support@strimz.io
- **GitHub Issues**: [Report a bug](https://github.com/strimz-headquarters/strimz-sdk/issues)
- **Documentation**: [https://strimz-subscription.vercel.app/docs](https://strimz-subscription.vercel.app/docs)

## License

MIT License - see [LICENSE](LICENSE) for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

Made with ❤️ by the Strimz Team
