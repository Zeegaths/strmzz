import React from 'react'
import Link from 'next/link'
import { Key, Shield, AlertCircle } from 'lucide-react'
import CodeBlock from '@/components/docs/CodeBlock'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Authentication - Strimz SDK Documentation',
    description: 'Learn how to securely authenticate your API requests using Strimz API keys. Understand public vs secret keys, live vs test modes, and security best practices.',
    openGraph: {
        title: 'Authentication with Strimz SDK',
        description: 'Securely authenticate API requests with Strimz API keys and follow security best practices.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Authentication',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Authentication with Strimz SDK',
        description: 'Securely authenticate API requests with Strimz API keys and follow security best practices.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Authentication',
            },
        ],
    },
}

export default function Authentication() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    Authentication
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Learn how to securely authenticate your API requests using Strimz API keys.
                </p>
            </div>

            {/* API Keys Overview */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">API Keys Overview</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-6">
                    Strimz uses API keys to authenticate requests. You get two types of keys:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[12px]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <Key className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-white font-poppins font-[600] text-lg">Public Key</h3>
                        </div>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Safe to use in client-side code. Starts with <code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-accent">STRZlive_</code> or <code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-accent">STRZtest_</code>
                        </p>
                        <div className="bg-[#0a0a0a] p-3 rounded-[8px]">
                            <code className="text-xs font-mono text-accent break-all">
                                STRZlive_6gPzQlL8xNwA5fVdB7YtM2KjC9RoZ
                            </code>
                        </div>
                    </div>

                    <div className="p-6 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[12px]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-950/30 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                            <h3 className="text-white font-poppins font-[600] text-lg">Secret Key</h3>
                        </div>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                            Must be kept secure. Only use server-side. Starts with <code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-red-400">STRZ_</code>
                        </p>
                        <div className="bg-[#0a0a0a] p-3 rounded-[8px]">
                            <code className="text-xs font-mono text-red-400 break-all">
                                STRZ_9XrK2VbY4pLtN6MwA7QzCiJoF8Yd
                            </code>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-700/30 rounded-[8px]">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-red-300 font-poppins font-[600] text-sm mb-1">Security Warning</h4>
                            <p className="text-red-200 font-poppins font-[400] text-sm">
                                Never expose your secret key in client-side code, version control, or publicly accessible locations. Anyone with your secret key can perform actions on your behalf.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Getting Your API Keys */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Getting Your API Keys</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Follow these steps to get your API keys:
                </p>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            1
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Sign Up</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                <Link href="/auth/business/signup" className="text-accent hover:underline">Create a business account</Link> on the Strimz platform.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            2
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Navigate to Account Settings</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Go to Dashboard → Account Settings → API Keys tab.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            3
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Generate Keys</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Click &quot;Generate new API keys&quot; for live mode or &quot;Generate new test keys&quot; for test mode.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            4
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Copy Keys</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Copy your public and secret keys. Store them securely - you won&apos;t be able to see the secret key again.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live vs Test Keys */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Live vs Test Keys</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1a1a1a]">
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Feature</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Test Mode</th>
                                <th className="border border-[#2a2a2a] px-4 py-3 text-left text-white font-poppins font-[600] text-sm">Live Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Real payments</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">No</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Yes</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Key prefix</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm"><code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-accent">STRZtest_</code></td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm"><code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs text-accent">STRZlive_</code></td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Webhooks</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Sent to test webhook URL</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Sent to live webhook URL</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Dashboard</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Test transactions visible</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Real transactions visible</td>
                            </tr>
                            <tr>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Use case</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Development & testing</td>
                                <td className="border border-[#2a2a2a] px-4 py-3 text-[#a0a0a0] font-poppins text-sm">Production</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Authenticating Requests */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Authenticating Requests</h2>

                {/* Client-side */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Client-side (Frontend)</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                        Use only your public key for client-side integrations:
                    </p>
                    <CodeBlock
                        language="javascript"
                        code={`import { StrimzSDK } from '@strimz/sdk'

const strimz = new StrimzSDK({
  publicKey: process.env.NEXT_PUBLIC_STRIMZ_PUBLIC_KEY,
  environment: 'live'
})

// The SDK automatically includes your public key in requests
const payment = await strimz.initializePayment({
  amount: 5000,
  currency: 'USD',
  serviceType: 'electricity'
})`}
                    />
                </div>

                {/* Server-side */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Server-side (Backend)</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-3">
                        For server-side operations, use your secret key via the Authorization header:
                    </p>
                    <CodeBlock
                        language="typescript"
                        code={`// Server-side API call
const response = await fetch('https://api.strimz.io/v1/transactions', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${process.env.STRIMZ_SECRET_KEY}\`,
    'Content-Type': 'application/json'
  }
})

const transactions = await response.json()`}
                    />
                </div>

                {/* Node.js Example */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Node.js Server Example</h3>
                    <CodeBlock
                        language="javascript"
                        code={`import { StrimzServer } from '@strimz/sdk/server'

// Initialize server SDK with secret key
const strimzServer = new StrimzServer({
  secretKey: process.env.STRIMZ_SECRET_KEY,
  environment: 'live'
})

// Verify a transaction
app.post('/api/verify-transaction', async (req, res) => {
  const { transactionId } = req.body

  try {
    const transaction = await strimzServer.verifyTransaction(transactionId)
    res.json({ success: true, transaction })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})`}
                    />
                </div>
            </div>

            {/* Best Practices */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Security Best Practices</h2>
                <div className="space-y-4">
                    <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-sm mb-2">✓ Use Environment Variables</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Store API keys in environment variables, never hardcode them in your source code.
                        </p>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-sm mb-2">✓ Keep Secret Keys Server-side</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Never include secret keys in client-side code, mobile apps, or version control systems.
                        </p>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-sm mb-2">✓ Rotate Keys Regularly</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Generate new API keys periodically and if you suspect they&apos;ve been compromised.
                        </p>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-sm mb-2">✓ Use Test Keys for Development</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Always use test keys during development and testing to avoid accidental charges.
                        </p>
                    </div>
                    <div className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-sm mb-2">✓ Whitelist IP Addresses</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Configure IP whitelisting in your account settings for additional security.
                        </p>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Next: Payment Integration</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    Now that you understand authentication, learn how to integrate payment flows into your application.
                </p>
                <Link
                    href="/docs/payment-integration"
                    className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                >
                    View Payment Integration Guide
                </Link>
            </div>
        </div>
    )
}
