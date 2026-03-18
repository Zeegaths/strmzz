import React from 'react'
import icon1 from "@/public/art/1.svg"
import icon2 from "@/public/art/2.svg"
import icon3 from "@/public/art/3.svg"
import Image from 'next/image'
import { Element } from 'react-scroll'
import PaddedLines from '@/components/shared/paddedLines'

/**
 * Features is a functional component that renders a section highlighting the features of Strimz.
 * It contains three features: Easy Payments, Pay in crypto, and Fast transactions.
 * Each feature is represented by an icon, a heading, and a description.
 * The component is styled with responsive design considerations, ensuring compatibility across various screen sizes.
 */
const Features = () => {
    return (
        <Element name='features'>
            <section className="bg-primary w-full flex justify-center items-center px-4 py-9 md:px-0 md:py-16">
                <main className='w-full max-w-[1200px] mx-auto grid md:grid-cols-3 gap-6'>

                    {/* one */}
                    <div className='w-full flex flex-col p-4'>
                        <Image src={icon1} alt="icon" width={72} height={72} quality={100} priority />
                        <h3 className='text-white font-sora font-[600] text-[24px] leading-[32px] mt-6'>One-Click Payments</h3>
                        <p className='text-[#BCBAC4] font-poppins font-[400] text-base leading-[28px] mt-2'>Pay for any service directly from your wallet in seconds. No lengthy forms, no bank approvals. Just connect and pay.</p>
                    </div>

                    {/* two */}
                    <div className='w-full flex flex-col p-4'>
                        <Image src={icon2} alt="icon" width={72} height={72} quality={100} priority />
                        <h3 className='text-white font-sora font-[600] text-[24px] leading-[32px] mt-6'>USDC & USDT Support</h3>
                        <p className='text-[#BCBAC4] font-poppins font-[400] leading-[28px] text-base mt-2'>Use stablecoins for predictable pricing without volatility. Your $100 payment stays $100, no surprises.</p>
                    </div>

                    {/* three */}
                    <div className='w-full flex flex-col p-4'>
                        <Image src={icon3} alt="icon" width={72} height={72} quality={100} priority />
                        <h3 className='text-white font-sora font-[600] text-[24px] leading-[32px] mt-6'>Instant Confirmation</h3>
                        <p className='text-[#BCBAC4] font-poppins font-[400] leading-[28px] text-base mt-2'>Your services activate immediately with blockchain-verified payments. No waiting, no delays.</p>
                    </div>

                </main>
            </section>
            <PaddedLines />
        </Element>
    )
}

export default Features