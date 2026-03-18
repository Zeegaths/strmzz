import React from 'react'
import Link from 'next/link'
import { Webhook, Shield, Code, CheckCircle } from 'lucide-react'
import CodeBlock from '@/components/docs/CodeBlock'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Webhooks - Strimz SDK Documentation',
    description: 'Set up webhooks to receive real-time notifications about payment events. Learn webhook security, signature verification, and implementation best practices.',
    openGraph: {
        title: 'Webhooks - Strimz SDK',
        description: 'Receive real-time payment notifications with secure webhook implementation.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Webhooks',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Webhooks - Strimz SDK',
        description: 'Receive real-time payment notifications with secure webhook implementation.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Webhooks',
            },
        ],
    },
}

export default function Webhooks() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    Webhooks
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Receive real-time notifications about payment events on your server using webhooks.
                </p>
            </div>

            {/* Overview */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">What are Webhooks?</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-6">
                    Webhooks are HTTP callbacks that Strimz sends to your server when specific events occur (e.g., successful payment, failed transaction). This allows you to automate processes and keep your database in sync with Strimz transactions.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Webhook className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Real-time Updates</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Get instant notifications when payment events occur.
                        </p>
                    </div>
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Secure Verification</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Verify webhook authenticity using signature validation.
                        </p>
                    </div>
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Code className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Easy Integration</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Simple setup with any backend framework.
                        </p>
                    </div>
                </div>
            </div>

            {/* Setting Up Webhooks */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Setting Up Webhooks</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            1
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Create Webhook Endpoint</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Create an endpoint on your server to receive webhook events (e.g., <code className="px-2 py-1 bg-[#1a1a1a] rounded text-xs">/api/webhooks/strimz</code>).
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            2
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Configure in Dashboard</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Go to Dashboard → Account Settings → Webhooks tab and add your webhook URL.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            3
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Verify Signature</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Implement signature verification to ensure webhooks are from Strimz.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            4
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Test Webhooks</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Use test mode to send test webhook events and verify your integration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Webhook Events */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Webhook Events</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Strimz sends webhooks for the following events:
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1a1a1a]">
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Event</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#0a0a0a]">
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">payment.success</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Payment completed successfully</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">payment.failed</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Payment failed or was rejected</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">payment.pending</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Payment is being processed</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-mono text-sm">refund.processed</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Refund has been processed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Webhook Payload */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Webhook Payload</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    All webhooks are sent as POST requests with the following structure:
                </p>

                <CodeBlock
                        language="json"
                        code={`{
  "event": "payment.success",
  "data": {
    "transactionId": "trx_1234567890abcdef",
    "amount": 5000,
    "currency": "USD",
    "serviceType": "electricity",
    "customerEmail": "customer@example.com",
    "status": "success",
    "metadata": {
      "meterNumber": "1234567890",
      "providerCode": "IKEJA_ELECTRIC"
    },
    "receipt": {
      "tokenCode": "1234-5678-9012",
      "units": "50 kWh",
      "providerRef": "IKEJA-REF-123456"
    },
    "createdAt": "2025-01-08T10:30:00Z",
    "updatedAt": "2025-01-08T10:30:05Z"
  },
  "signature": "sha256_signature_here"
}`}
                    />
            </div>

            {/* Implementation Examples */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Implementation Examples</h2>

                {/* Node.js/Express */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Node.js / Express</h3>
                    <CodeBlock
                        language="javascript"
                        code={`import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json())

// Your webhook secret from dashboard
const WEBHOOK_SECRET = process.env.STRIMZ_WEBHOOK_SECRET

app.post('/api/webhooks/strimz', (req, res) => {
  const signature = req.headers['x-strimz-signature']
  const payload = JSON.stringify(req.body)

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  // Process webhook event
  const { event, data } = req.body

  switch (event) {
    case 'payment.success':
      // Update database, send confirmation email, etc.
      console.log('Payment successful:', data.transactionId)
      break

    case 'payment.failed':
      // Handle failed payment
      console.log('Payment failed:', data.transactionId)
      break

    case 'payment.pending':
      // Handle pending payment
      console.log('Payment pending:', data.transactionId)
      break

    default:
      console.log('Unknown event:', event)
  }

  // Respond with 200 to acknowledge receipt
  res.status(200).json({ received: true })
})

app.listen(3000, () => console.log('Webhook server running on port 3000'))`}
                    />
                </div>

                {/* Next.js API Route */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Next.js API Route</h3>
                    <CodeBlock
                        language="typescript"
                        code={`// app/api/webhooks/strimz/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.STRIMZ_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-strimz-signature')
    const payload = await req.text()
    const body = JSON.parse(payload)

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { event, data } = body

    // Process event
    switch (event) {
      case 'payment.success':
        // Update database
        await updatePaymentStatus(data.transactionId, 'success')
        break

      case 'payment.failed':
        await updatePaymentStatus(data.transactionId, 'failed')
        break

      default:
        console.log('Unhandled event:', event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function updatePaymentStatus(transactionId: string, status: string) {
  // Your database update logic
  console.log(\`Updating transaction \${transactionId} to \${status}\`)
}`}
                    />
                </div>
            </div>

            {/* Security Best Practices */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Security Best Practices</h2>
                <div className="space-y-4">
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <div className="flex gap-3">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-poppins font-[600] text-sm mb-1">Always Verify Signatures</h4>
                                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                    Never trust webhook data without verifying the signature. This prevents malicious actors from sending fake webhooks.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <div className="flex gap-3">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-poppins font-[600] text-sm mb-1">Use HTTPS</h4>
                                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                    Always use HTTPS for your webhook endpoint to ensure data is encrypted in transit.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <div className="flex gap-3">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-poppins font-[600] text-sm mb-1">Respond Quickly</h4>
                                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                    Process webhooks asynchronously and respond with 200 status quickly (within 5 seconds) to acknowledge receipt.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <div className="flex gap-3">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-poppins font-[600] text-sm mb-1">Handle Retries</h4>
                                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                    Strimz will retry failed webhooks up to 3 times. Implement idempotency to handle duplicate events gracefully.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testing Webhooks */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Testing Webhooks</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    During development, you can use these tools to test webhooks locally:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">ngrok</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Create a public URL for your local server
                        </p>
                        <code className="text-xs bg-[#0a0a0a] px-2 py-1 rounded">ngrok http 3000</code>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">Test Mode</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Use test API keys to trigger test webhooks
                        </p>
                        <code className="text-xs bg-[#0a0a0a] px-2 py-1 rounded">environment: &apos;test&apos;</code>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Next: API Reference</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    Explore the complete API reference with all available endpoints and methods.
                </p>
                <Link
                    href="/docs/api-reference"
                    className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                >
                    View API Reference
                </Link>
            </div>
        </div>
    )
}
