'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import businessPic from "@/public/elements/globalPayment.png"
import { CheckCircle2, FileText } from 'lucide-react'
import PaddedLines from '@/components/shared/paddedLines'

/**
 * ForBusinesses component renders a section highlighting features for business users (B2B).
 * It showcases the ability to integrate Strimz SDK to accept crypto payments from users.
 * The component includes call-to-action buttons for documentation and API access.
 */
const ForBusinesses = () => {
    const router = useRouter()

    const features = [
        'Easy SDK integration',
        'Accept USDC/USDT, receive fiat',
        'RESTful API & webhooks',
        'Real-time analytics dashboard',
        'Team management & API keys',
        'IP whitelisting & security features'
    ]

    return (
        <>
            <section className="w-full bg-[#F9FAFB] py-16 md:py-20 px-4">
                <main className="w-full max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Content */}
                    <div className="w-full flex flex-col justify-center md:order-1 order-2">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-poppins font-[500] mb-4 w-fit">
                            For Businesses
                        </div>
                        <h2 className="text-primary font-sora font-[700] text-[32px] md:text-[40px] leading-[40px] md:leading-[40px] mb-4">
                            Accept Crypto Payments Instantly
                        </h2>
                        <p className='text-[#58556A] font-poppins font-[400] text-base leading-[28px] mb-6'>
                            Integrate Strimz SDK and let your users pay for subscriptions and services with cryptocurrency. You receive fiat, they pay with crypto. Simple integration, powerful features.
                        </p>

                        {/* Features List */}
                        <ul className="space-y-3 mb-8">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                    <span className="text-[#58556A] font-poppins font-[400] text-base leading-[28px]">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTAs */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={() => router.push("/docs")}
                                className='px-6 py-3 bg-white border-2 border-accent text-accent rounded-[8px] font-poppins font-[500] text-[14px] hover:bg-accent/5 transition-colors flex items-center gap-2'
                            >
                                <FileText className="w-4 h-4" />
                                View Documentation
                            </button>
                            <button
                                onClick={() => router.push("/auth/business/signup")}
                                className='px-6 py-3 bg-accent text-white rounded-[8px] font-poppins font-[500] text-[14px] shadow-ctaShadow hover:bg-accent/90 transition-colors'
                            >
                                Get API Access
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="w-full md:order-2 order-1">
                        <Image
                            src={businessPic}
                            alt='Accept crypto payments for your business'
                            className='w-full h-auto'
                            width={2155}
                            height={1571}
                            quality={100}
                            priority
                        />
                    </div>

                </main>
            </section>
            <PaddedLines />
        </>
    )
}

export default ForBusinesses
