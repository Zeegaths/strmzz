import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Code } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Strimz SDK Documentation - Crypto Payment Gateway',
    description: 'Accept cryptocurrency payments with USDC and USDT. Support one-time payments and automated recurring subscriptions. Get started in minutes with our simple integration.',
    openGraph: {
        title: 'Strimz SDK Documentation',
        description: 'Crypto payment gateway supporting one-time and recurring subscription payments with USDC and USDT.',
        type: 'website',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Strimz SDK Documentation',
        description: 'Crypto payment gateway supporting one-time and recurring subscription payments with USDC and USDT.',
        images: [
            {
                url: '/thumbnail-docs.png',
                alt: 'Strimz SDK Documentation',
            },
        ],
    },
}

export default function DocsIntroduction() {
    return (
        <div className="w-full max-w-4xl">
            {/* Hero Section */}
            <div className="mb-12">
                <h1 className="text-white font-sora font-[700] text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] mb-4">
                    Strimz SDK Documentation
                </h1>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-lg leading-[32px]">
                    Powerful crypto payment gateway for accepting one-time payments and automated recurring subscriptions with USDC and USDT. Integrate seamlessly into your platform in minutes.
                </p>
            </div>

            {/* Quick Start CTA */}
            <div className="mb-16 p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-[12px] border border-accent/20">
                <h2 className="text-white font-sora font-[600] text-xl mb-2">Ready to integrate?</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base mb-4">
                    Get your API keys and start accepting crypto payments in under 10 minutes.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/docs/getting-started"
                        className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                    >
                        Getting Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/auth/business/signup"
                        className="inline-flex items-center gap-2 h-10 px-4 py-2 border border-[#2a2a2a] bg-[#1a1a1a] text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-[#2a2a2a] transition-colors"
                    >
                        Get API Keys
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-16">
                <h2 className="text-white font-sora font-[600] text-2xl mb-6">Why Strimz?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Fast Integration</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm leading-[24px]">
                            Install our SDK and start accepting payments in minutes with just a few lines of code.
                        </p>
                    </div>
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Secure & Reliable</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm leading-[24px]">
                            Bank-level security with blockchain verification. All transactions are audited and encrypted.
                        </p>
                    </div>
                    <div className="p-6 border border-[#2a2a2a] rounded-[12px] bg-[#1a1a1a]">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <Code className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-white font-sora font-[600] text-lg mb-2">Developer Friendly</h3>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm leading-[24px]">
                            RESTful API, webhooks, comprehensive documentation, and code examples in multiple languages.
                        </p>
                    </div>
                </div>
            </div>

            {/* What You Can Build */}
            <div className="mb-16">
                <h2 className="text-white font-sora font-[600] text-2xl mb-4">What You Can Build</h2>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-base leading-[28px] mb-6">
                    Strimz SDK empowers your platform to accept crypto payments for:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">SaaS Subscriptions</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Monthly, yearly, or custom billing cycles with automated recurring payments
                        </p>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">E-commerce Payments</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            One-time checkout payments for physical or digital products
                        </p>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">Membership Platforms</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Recurring memberships with daily, weekly, monthly, or yearly plans
                        </p>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[8px]">
                        <h4 className="text-white font-poppins font-[600] text-base mb-2">Any Digital Service</h4>
                        <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                            Custom payment flows for your unique business model
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="mb-16">
                <h2 className="text-white font-sora font-[600] text-2xl mb-6">How It Works</h2>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            1
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Get API Keys</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Sign up for a business account and generate your live and test API keys from the dashboard.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            2
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Install SDK</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Install the Strimz SDK via npm or yarn, and configure it with your API keys.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            3
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Integrate Payment Flow</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Add the payment button to your platform and handle the payment response.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-poppins font-[600] text-sm">
                            4
                        </div>
                        <div>
                            <h4 className="text-white font-poppins font-[600] text-base mb-1">Configure Webhooks</h4>
                            <p className="text-[#a0a0a0] font-poppins font-[400] text-sm">
                                Set up webhooks to receive real-time notifications about payment events.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support */}
            <div className="p-6 bg-[#1a1a1a] rounded-[12px] border border-[#2a2a2a]">
                <h3 className="text-white font-sora font-[600] text-lg mb-2">Need Help?</h3>
                <p className="text-[#a0a0a0] font-poppins font-[400] text-sm mb-4">
                    Have questions or need assistance with integration? We&apos;re here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/docs/getting-started"
                        className="inline-flex items-center gap-2 h-9 px-4 py-2 bg-accent text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-accent/90 transition-colors"
                    >
                        View Guides
                    </Link>
                    <a
                        href="mailto:support@strimz.io"
                        className="inline-flex items-center gap-2 h-9 px-4 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white font-poppins font-[500] text-sm rounded-[8px] hover:bg-[#2a2a2a] transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    )
}
