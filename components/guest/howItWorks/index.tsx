'use client'
import React, { useState } from 'react'
import { Wallet, Search, CheckCircle, Key, Code, Zap } from 'lucide-react'
import { Element } from 'react-scroll'

/**
 * HowItWorks component renders a section showing the step-by-step process
 * for both individual users and businesses to use Strimz.
 * Features a tab interface to switch between user types.
 */
const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState<'individuals' | 'businesses'>('individuals')

    const individualSteps = [
        {
            number: '01',
            icon: <Wallet className="w-8 h-8 text-accent" />,
            title: 'Connect Wallet',
            description: 'Link your crypto wallet to Strimz. We support all major wallets including MetaMask, WalletConnect, and more.'
        },
        {
            number: '02',
            icon: <Search className="w-8 h-8 text-accent" />,
            title: 'Select Service',
            description: 'Choose what you want to pay for—electricity bills, airtime, data bundles, or cable TV subscriptions.'
        },
        {
            number: '03',
            icon: <CheckCircle className="w-8 h-8 text-accent" />,
            title: 'Pay & Confirm',
            description: 'Complete payment with USDC or USDT. Get instant confirmation and service activation in under 5 seconds.'
        }
    ]

    const businessSteps = [
        {
            number: '01',
            icon: <Key className="w-8 h-8 text-accent" />,
            title: 'Get API Keys',
            description: 'Sign up for a business account and get your API credentials instantly from your dashboard.'
        },
        {
            number: '02',
            icon: <Code className="w-8 h-8 text-accent" />,
            title: 'Integrate SDK',
            description: 'Follow our simple documentation to integrate Strimz SDK into your platform. Takes less than an hour.'
        },
        {
            number: '03',
            icon: <Zap className="w-8 h-8 text-accent" />,
            title: 'Accept Payments',
            description: 'Start accepting crypto payments from your users. Configure webhooks and track everything in real-time.'
        }
    ]

    const steps = activeTab === 'individuals' ? individualSteps : businessSteps

    return (
        <Element name="howItWorks">
            <section className="w-full bg-[#F9FAFB] py-16 md:py-20 px-4">
                <main className="w-full max-w-[1200px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-primary font-sora font-[700] text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] mb-4">
                            How It Works
                        </h2>
                        <p className="text-[#58556A] font-poppins font-[400] text-base leading-[28px] max-w-[600px] mx-auto">
                            Get started with Strimz in three simple steps. Choose your path below.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex bg-white rounded-[8px] p-1 border border-[#E5E7EB]">
                            <button
                                onClick={() => setActiveTab('individuals')}
                                className={`px-6 py-2.5 rounded-[6px] font-poppins font-[500] text-sm transition-all ${activeTab === 'individuals'
                                    ? 'bg-accent text-white'
                                    : 'text-[#58556A] hover:text-primary'
                                    }`}
                            >
                                For Individuals
                            </button>
                            <button
                                onClick={() => setActiveTab('businesses')}
                                className={`px-6 py-2.5 rounded-[6px] font-poppins font-[500] text-sm transition-all ${activeTab === 'businesses'
                                    ? 'bg-accent text-white'
                                    : 'text-[#58556A] hover:text-primary'
                                    }`}
                            >
                                For Businesses
                            </button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Card */}
                                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 h-full flex flex-col">
                                    {/* Step Number */}
                                    <div className="text-accent/20 font-sora font-[700] text-[64px] leading-[64px] mb-4">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="mb-4">
                                        {step.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-primary font-sora font-[600] text-[20px] leading-[28px] mb-3">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[#58556A] font-poppins font-[400] text-base leading-[28px]">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Connector Arrow (hidden on last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <div className="w-8 h-0.5 bg-accent/30"></div>
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-accent/30"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </section>
        </Element>
    )
}

export default HowItWorks
