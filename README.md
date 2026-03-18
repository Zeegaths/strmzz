# Strimz Payment Platform

A crypto payment gateway that enables businesses to accept one-time payments and recurring subscriptions using USDC and USDT stablecoins. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 📋 Overview

Strimz is a comprehensive payment platform with:
- **Strimz SDK**: An npm package for businesses to integrate crypto payment infrastructure with "Pay with Strimz" button
- **Business Dashboard**: Manage API keys, webhooks, customers, and transactions
- **User Dashboard**: For end-users to manage their subscriptions and payment history

## ✨ Core Features

### User Dashboard
- Active subscription management with status tracking
- Transaction history with filtering and search
- Payment method management
- Account settings and security
- USDC/USDT payment support
- Subscription pause/cancel functionality

### Business Dashboard
- API key management (live and test modes)
- Webhook configuration and testing
- Customer subscription analytics
- Revenue insights and metrics
- Transaction monitoring and reporting
- Team management with role-based access
- IP whitelisting for security
- Integration documentation and examples

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (Dialog, Select, Tabs, Accordion)
- **Forms:** React Hook Form + Zod validation
- **State:** TanStack Query (React Query)
- **Web3:** Wagmi, Viem, Reown AppKit
- **Animations:** Framer Motion, React Confetti
- **Icons:** Lucide React, React Icons
- **Notifications:** Sonner (Toast)
- **Charts:** Recharts
- **Tables:** TanStack Table

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/strimz-headquarters/strimz-sdk.git
cd strimz-sdk
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# App Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=1

# API Configuration
NEXT_PUBLIC_API_URL=your_api_url
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Strimz SDK (npm package)

The Strimz SDK will be published as an npm package (`@strimz/sdk`) that allows businesses to integrate crypto payment functionality:

### Features
- **One-time payments**: Accept single payments for products or services
- **Recurring subscriptions**: Automated billing with daily, weekly, monthly, or yearly intervals
- **React components**: Pre-built `<StrimzButton>` and payment modal
- **TypeScript support**: Full type definitions for better developer experience
- **Webhook integration**: Real-time payment notifications
- **Server-side SDK**: Transaction verification and webhook signature validation
- **Test mode**: Sandbox environment for testing without real payments

### Quick Example
```typescript
import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: 'STRZlive_your_public_key',
  environment: 'live'
})

// Initialize subscription payment
const result = await strimz.initializePayment({
  amount: 2999,  // $29.99/month
  currency: 'USD',
  paymentType: 'subscription',
  interval: 'monthly',
  customerEmail: 'customer@example.com'
})
```

See `/app/docs` for complete SDK documentation.

## 🔑 Key Development Patterns

### Form Validation
All forms use React Hook Form with Zod schemas for type-safe validation:
```typescript
const schema = z.object({
  email: z.string().email('Invalid email address'),
  amount: z.string().min(1, 'Amount is required')
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

### Dialog Components
Uses Radix UI Dialog with controlled state:
```typescript
const [isOpen, setIsOpen] = useState(false)

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Inline Editing
Account settings use inline edit pattern:
```typescript
const [isEditing, setIsEditing] = useState(false)
const [inputValue, setInputValue] = useState(currentValue)

// Save updates the state and exits edit mode
// Cancel resets inputValue and exits edit mode
```

## 🎨 Design System

- **Fonts**: Sora (headings), Poppins (body text)
- **Primary Color**: `#161318` (dark text)
- **Accent Color**: `#02C76A` (green - buttons, highlights)
- **Background**: White with subtle grays for sections
- **Component Library**: Radix UI for accessible primitives
- **Responsive**: Mobile-first with `md:` and `lg:` breakpoints

## 🌐 Deployment

**Build for production:**
```bash
npm run build
npm start
```

**Vercel (recommended):**
```bash
vercel
```

Set required environment variables in your deployment platform dashboard.

## 🤝 Development Guidelines

- Use TypeScript for all new files
- Follow existing component patterns (see components/business/Dashboard/Withdraw.tsx for dialog examples)
- Use Zod schemas for form validation
- Write meaningful commit messages
- Test changes before committing
# strmzz
