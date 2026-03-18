import React from 'react'
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import type { Metadata } from 'next'
import CodeBlock from '@/components/docs/CodeBlock'

export const metadata: Metadata = {
    title: 'Error Handling - Strimz SDK Documentation',
    description: 'Learn how to handle errors in Strimz SDK. Complete error codes reference, retry strategies with exponential backoff, and debugging tips for common issues.',
    openGraph: {
        title: 'Error Handling - Strimz SDK',
        description: 'Error codes reference, retry strategies, and debugging tips for Strimz SDK.',
        type: 'article',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Error Handling',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Error Handling - Strimz SDK',
        description: 'Error codes reference, retry strategies, and debugging tips for Strimz SDK.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation - Error Handling',
            },
        ],
    },
}

export default function ErrorHandling() {
    return (
        <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white font-sora font-[700] text-[40px] leading-[48px] mb-4">
                    Error Handling
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Learn how to handle errors gracefully and troubleshoot common issues.
                </p>
            </div>

            {/* Error Structure */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Error Response Structure</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    All errors follow a consistent structure:
                </p>
                <CodeBlock
                        language="json"
                        code={`{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    // Additional context (optional)
  },
  "timestamp": "2025-01-08T10:30:00Z"
}`}
                    />
            </div>

            {/* Common Error Codes */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Common Error Codes</h2>

                {/* Authentication Errors */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-4">Authentication Errors</h3>
                    <div className="space-y-3">
                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">INVALID_API_KEY</code>
                                        <span className="text-xs text-red-400">401</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        The provided API key is invalid or missing.
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> Verify your API key is correct and properly configured.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">EXPIRED_API_KEY</code>
                                        <span className="text-xs text-red-400">401</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        The API key has expired or been revoked.
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> Generate a new API key from your dashboard.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Errors */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-4">Payment Errors</h3>
                    <div className="space-y-3">
                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">INSUFFICIENT_BALANCE</code>
                                        <span className="text-xs text-red-400">400</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        User&apos;s wallet has insufficient funds for the transaction.
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> Ask user to add funds to their wallet or use a different wallet.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">TRANSACTION_REJECTED</code>
                                        <span className="text-xs text-red-400">400</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        User rejected the transaction in their wallet.
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> User chose to cancel. Allow them to retry if desired.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-yellow-900 bg-yellow-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-yellow-300 font-mono text-sm font-[600]">NETWORK_ERROR</code>
                                        <span className="text-xs text-yellow-400">503</span>
                                    </div>
                                    <p className="text-yellow-300 font-poppins font-[400] text-sm">
                                        Blockchain network is congested or unavailable.
                                    </p>
                                    <div className="mt-2 p-2 bg-yellow-950/20 rounded text-xs text-yellow-200">
                                        <strong>Solution:</strong> Wait a few moments and retry the transaction.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation Errors */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-4">Validation Errors</h3>
                    <div className="space-y-3">
                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">INVALID_AMOUNT</code>
                                        <span className="text-xs text-red-400">400</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        The payment amount is invalid (too low, too high, or negative).
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> Ensure amount is positive and within acceptable limits (min: $1, max: $10,000).
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-red-900 bg-red-950/20 rounded-[8px]">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-red-300 font-mono text-sm font-[600]">INVALID_SERVICE_TYPE</code>
                                        <span className="text-xs text-red-400">400</span>
                                    </div>
                                    <p className="text-red-300 font-poppins font-[400] text-sm">
                                        The specified service type is not supported.
                                    </p>
                                    <div className="mt-2 p-2 bg-red-950/20 rounded text-xs text-red-200">
                                        <strong>Solution:</strong> Use one of: electricity, airtime, data, cable
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rate Limit Errors */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-4">Rate Limit Errors</h3>
                    <div className="p-4 border border-orange-900 bg-orange-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <code className="text-orange-300 font-mono text-sm font-[600]">RATE_LIMIT_EXCEEDED</code>
                                    <span className="text-xs text-orange-400">429</span>
                                </div>
                                <p className="text-orange-300 font-poppins font-[400] text-sm">
                                    Too many requests. You&apos;ve exceeded the rate limit.
                                </p>
                                <div className="mt-2 p-2 bg-orange-950/20 rounded text-xs text-orange-200">
                                    <strong>Solution:</strong> Wait 60 seconds before retrying. Implement exponential backoff.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Handling Examples */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Error Handling Examples</h2>

                {/* Try-Catch Example */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Basic Error Handling</h3>
                    <CodeBlock
                        language="typescript"
                        code={`try {
  const result = await strimz.initializePayment({
    amount: 2999,
    currency: 'USD',
    paymentType: 'subscription',
    interval: 'monthly',
    customerEmail: 'customer@example.com'
  })

  if (result.status === 'success') {
    console.log('Payment successful!')
  }
} catch (error) {
  // Handle different error types
  switch (error.code) {
    case 'INSUFFICIENT_BALANCE':
      showError('Insufficient wallet balance. Please add funds.')
      break

    case 'TRANSACTION_REJECTED':
      showError('Transaction cancelled by user.')
      break

    case 'NETWORK_ERROR':
      showError('Network error. Please try again.')
      setTimeout(() => retryPayment(), 3000)
      break

    default:
      showError(\`Payment failed: \${error.message}\`)
  }

  // Log error for debugging
  console.error('Payment error:', error)
}`}
                    />
                </div>

                {/* Retry Logic */}
                <div className="mb-8">
                    <h3 className="text-white font-poppins font-[600] text-lg mb-3">Retry Logic with Exponential Backoff</h3>
                    <CodeBlock
                        language="typescript"
                        code={`async function payWithRetry(paymentData, maxRetries = 3) {
  let retries = 0
  let delay = 1000 // Start with 1 second

  while (retries < maxRetries) {
    try {
      const result = await strimz.initializePayment(paymentData)
      return result // Success!

    } catch (error) {
      // Only retry on network errors or rate limits
      if (error.code === 'NETWORK_ERROR' || error.code === 'RATE_LIMIT_EXCEEDED') {
        retries++
        if (retries < maxRetries) {
          console.log(\`Retry \${retries}/\${maxRetries} after \${delay}ms\`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 // Exponential backoff
        } else {
          throw error // Max retries reached
        }
      } else {
        throw error // Don't retry other errors
      }
    }
  }
}`}
                    />
                </div>
            </div>

            {/* Debugging Tips */}
            <div className="mb-12">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">Debugging Tips</h2>
                <div className="space-y-4">
                    <div className="p-4 border border-blue-900 bg-blue-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-300 font-poppins font-[600] text-sm mb-1">Use Test Mode</h4>
                                <p className="text-blue-300 font-poppins font-[400] text-sm">
                                    Always test your integration in test mode first to avoid accidental charges.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-blue-900 bg-blue-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-300 font-poppins font-[600] text-sm mb-1">Check Transaction Logs</h4>
                                <p className="text-blue-300 font-poppins font-[400] text-sm">
                                    View detailed transaction logs in your dashboard to identify issues.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-blue-900 bg-blue-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-300 font-poppins font-[600] text-sm mb-1">Enable Verbose Logging</h4>
                                <p className="text-blue-300 font-poppins font-[400] text-sm mb-2">
                                    Enable debug mode to see detailed logs:
                                </p>
                                <code className="text-xs bg-blue-950/20 px-2 py-1 rounded">
                                    new StrimzSDK({'{'}publicKey, environment, debug: true{'}'})
                                </code>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-blue-900 bg-blue-950/20 rounded-[8px]">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-300 font-poppins font-[600] text-sm mb-1">Contact Support</h4>
                                <p className="text-blue-300 font-poppins font-[400] text-sm">
                                    If you encounter persistent issues, contact support at{' '}
                                    <a href="mailto:support@strimz.io" className="underline">support@strimz.io</a>{' '}
                                    with your transaction ID.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support */}
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Need Help?</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    If you&apos;re experiencing issues not covered in this guide, we&apos;re here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="mailto:support@strimz.io"
                        className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                    >
                        Contact Support
                    </a>
                    <a
                        href="https://github.com/strimz-headquarters/strimz-sdk/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-10 px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] text-white font-poppins font-[500] text-sm rounded-[8px] hover:hover:bg-[#2a2a2a] transition-colors"
                    >
                        Report an Issue
                    </a>
                </div>
            </div>
        </div>
    )
}
