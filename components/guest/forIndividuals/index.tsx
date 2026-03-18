'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import individualsPic from "@/public/elements/buydataairtime.png"
import { CheckCircle2 } from 'lucide-react'
import { Element } from 'react-scroll'

/**
 * ForIndividuals component renders a section highlighting features for individual users (B2C).
 * It showcases the ability to pay for utility bills, airtime, data, and subscriptions using crypto.
 * The component includes a call-to-action button that directs users to sign up.
 */
const ForIndividuals = () => {
    const router = useRouter()

    const features = [
        'Pay utility bills with USDC/USDT',
        'Top up airtime instantly',
        'Manage all subscriptions in one place',
        'No bank account required',
        'Instant payment confirmations',
        'Track spending and transaction history'
    ]

    return (
        <Element name="benefits" >
            <section className="w-full bg-white py-16 md:py-20 px-4">
                <main className="w-full max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Image */}
                    <div className="w-full ">
                        <Image
                            src={individualsPic}
                            alt='Pay bills with crypto'
                            className='w-full h-auto'
                            width={2396}
                            height={2148}
                            quality={100}
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="w-full flex flex-col justify-center">
                        <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-poppins font-[500] mb-4 w-fit">
                            For Individuals
                        </div>
                        <h2 className="text-primary font-sora font-[700] text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] mb-4">
                            Pay Smarter with Crypto
                        </h2>
                        <p className='text-[#58556A] font-poppins font-[400] text-base leading-[28px] mb-6'>
                            Use your cryptocurrency to pay for everyday services. Electricity bills, mobile data, airtime, cable TV, and more. All from your wallet, instantly confirmed.
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

                        {/* CTA */}
                        <button
                            onClick={() => router.push("/auth/user/signup")}
                            className='w-fit px-6 py-3 bg-accent text-white rounded-[8px] font-poppins font-[500] text-[14px] shadow-ctaShadow hover:bg-accent/90 transition-colors'
                        >
                            Start Paying with Crypto
                        </button>
                    </div>

                </main>
            </section>
        </Element>
    )
}

export default ForIndividuals
