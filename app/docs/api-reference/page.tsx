import React from 'react'
import Link from 'next/link'
import CodeBlock from '@/components/docs/CodeBlock'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'API Reference - Strimz SDK Documentation',
    description: 'Complete API reference for Strimz SDK methods, REST endpoints, request/response formats, and rate limits. Comprehensive documentation for developers.',
    openGraph: {
        title: 'API Reference - Strimz SDK',
        description: 'Complete SDK methods, REST endpoints, and API documentation.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - API Reference',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'API Reference - Strimz SDK',
        description: 'Complete SDK methods, REST endpoints, and API documentation.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - API Reference',
            },
        ],
    },
}

export default function APIReference() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    API Reference
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Complete reference for all Strimz SDK methods and REST API endpoints.
                </p>
            </div>

            {/* Base URL */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Base URL</h2>
                <div className="bg-[#1e1e1e] rounded-[8px] p-4">
                    <code className="text-[#d4d4d4] font-mono text-sm">
                        https://api.strimz.io/v1
                    </code>
                </div>
            </div>

            {/* SDK Methods */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">SDK Methods</h2>

                {/* Initialize SDK */}
                <div className="mb-8 pb-8 border-b border-[#2a2a2a]">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">new StrimzSDK(config)</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Initialize the Strimz SDK with your configuration.
                    </p>
                    <CodeBlock
                        language="javascript"
                        code={`const strimz = new StrimzSDK({
  publicKey: 'STRZlive_your_public_key',
  environment: 'live' // or 'test'
})`}
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#1a1a1a]">
                                    <th className="border border-[#2a2a2a] px-4 py-2 text-left text-white font-poppins font-[600] text-sm">Parameter</th>
                                    <th className="border border-[#2a2a2a] px-4 py-2 text-left text-white font-poppins font-[600] text-sm">Type</th>
                                    <th className="border border-[#2a2a2a] px-4 py-2 text-left text-white font-poppins font-[600] text-sm">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#0a0a0a]">
                                <tr>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-mono text-sm">publicKey</td>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-mono text-sm">string</td>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-poppins text-sm">Your Strimz public API key</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-mono text-sm">environment</td>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-mono text-sm">&apos;live&apos; | &apos;test&apos;</td>
                                    <td className="border border-[#2a2a2a] px-4 py-2 text-[#a0a0a0] font-poppins text-sm">Environment mode</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Initialize Payment */}
                <div className="mb-8 pb-8 border-b border-[#2a2a2a]">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">strimz.initializePayment(options)</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Initialize a payment transaction and open the payment modal.
                    </p>
                    <CodeBlock
                        language="javascript"
                        code={`const result = await strimz.initializePayment({
  amount: 5000,
  currency: 'USD',
  serviceType: 'electricity',
  customerEmail: 'customer@example.com',
  metadata: {
    meterNumber: '1234567890'
  },
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
})`}
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#1a1a1a]">
                                    <th className="border border-[#2a2a2a] px-3 py-2 text-left text-white font-poppins font-[600] text-xs">Parameter</th>
                                    <th className="border border-[#2a2a2a] px-3 py-2 text-left text-white font-poppins font-[600] text-xs">Type</th>
                                    <th className="border border-[#2a2a2a] px-3 py-2 text-left text-white font-poppins font-[600] text-xs">Required</th>
                                    <th className="border border-[#2a2a2a] px-3 py-2 text-left text-white font-poppins font-[600] text-xs">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#0a0a0a]">
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">amount</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">number</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Yes</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Amount in cents</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">currency</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">string</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Yes</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Currency code (USD)</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">serviceType</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">string</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Yes</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Service type (electricity, airtime, data, cable)</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">customerEmail</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">string</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Yes</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Customer email</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">metadata</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">object</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">No</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Additional service data</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">onSuccess</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">function</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">No</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Success callback</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">onError</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] font-mono text-xs">function</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">No</td>
                                    <td className="border border-[#2a2a2a] px-3 py-2 text-[#a0a0a0] text-xs">Error callback</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Verify Transaction */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">strimzServer.verifyTransaction(transactionId)</h3>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Verify a transaction on the server-side (requires secret key).
                    </p>
                    <CodeBlock
                        language="javascript"
                        code={`import { StrimzServer } from '@strimz/sdk/server'

const strimzServer = new StrimzServer({
  secretKey: process.env.STRIMZ_SECRET_KEY,
  environment: 'live'
})

const transaction = await strimzServer.verifyTransaction('trx_1234567890')
console.log(transaction.status) // 'success', 'failed', 'pending'`}
                    />
                </div>
            </div>

            {/* REST API Endpoints */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">REST API Endpoints</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-6">
                    All endpoints require authentication via the Authorization header with your secret key.
                </p>

                {/* Get Transactions */}
                <div className="mb-8 pb-8 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-900 text-green-200 font-mono text-xs rounded">GET</span>
                        <code className="text-white font-mono text-sm">/transactions</code>
                    </div>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Retrieve a list of your transactions.
                    </p>
                    <CodeBlock
                        language="bash"
                        code={`curl https://api.strimz.io/v1/transactions \\
  -H "Authorization: Bearer STRZ_your_secret_key" \\
  -H "Content-Type: application/json"`}
                    />
                </div>

                {/* Get Single Transaction */}
                <div className="mb-8 pb-8 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-900 text-green-200 font-mono text-xs rounded">GET</span>
                        <code className="text-white font-mono text-sm">/transactions/:id</code>
                    </div>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Get details of a specific transaction.
                    </p>
                    <CodeBlock
                        language="bash"
                        code={`curl https://api.strimz.io/v1/transactions/trx_1234567890 \\
  -H "Authorization: Bearer STRZ_your_secret_key"`}
                    />
                </div>

                {/* Get Customers */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-900 text-green-200 font-mono text-xs rounded">GET</span>
                        <code className="text-white font-mono text-sm">/customers</code>
                    </div>
                    <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                        Retrieve a list of your customers.
                    </p>
                    <CodeBlock
                        language="bash"
                        code={`curl https://api.strimz.io/v1/customers \\
  -H "Authorization: Bearer STRZ_your_secret_key"`}
                    />
                </div>
            </div>

            {/* Rate Limits */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Rate Limits</h2>
                <div className="p-4 border border-[#2a2a2a] rounded-[8px] bg-[#1a1a1a]">
                    <ul className="space-y-2 text-[#a0a0a0] font-poppins text-sm">
                        <li>• <strong className="text-white">100 requests per minute</strong> for payment initialization</li>
                        <li>• <strong className="text-white">1000 requests per minute</strong> for read operations (GET endpoints)</li>
                        <li>• Exceeding limits returns <code className="px-2 py-1 bg-[#0a0a0a] rounded text-xs">429 Too Many Requests</code></li>
                    </ul>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Next: Error Handling</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    Learn how to handle errors and troubleshoot common issues.
                </p>
                <Link
                    href="/docs/error-handling"
                    className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                >
                    View Error Handling
                </Link>
            </div>
        </div>
    )
}
