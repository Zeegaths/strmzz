# Next.js Example - Strimz SDK

This example demonstrates how to integrate Strimz payments into a Next.js 14+ application using the App Router.

## Features

- Client-side payment button with React components
- Server-side webhook handling
- Transaction verification
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install @strimz/sdk
```

2. Set up environment variables:
```env
# .env.local
NEXT_PUBLIC_STRIMZ_PUBLIC_KEY=STRZtest_your_public_key
STRIMZ_SECRET_KEY=STRZ_your_secret_key
STRIMZ_WEBHOOK_SECRET=whsec_your_webhook_secret
```

3. Run the development server:
```bash
npm run dev
```

## File Structure

```
app/
├── layout.tsx              # Root layout with StrimzProvider
├── page.tsx                # Home page with pricing
├── success/
│   └── page.tsx           # Success page after payment
└── api/
    └── webhooks/
        └── strimz/
            └── route.ts   # Webhook handler
```

## Usage

See the example files for implementation details.
