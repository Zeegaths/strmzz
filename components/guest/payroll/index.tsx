import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import globalPay from "@/public/elements/globalPayment.png"
import PaddedLines from '@/components/shared/paddedLines'

/**
 * Payroll component renders a section describing the ease of use of Strimz for
 * making crypto payments to team members. The section includes a heading, a
 * paragraph of text, a call-to-action button, and an illustration. Designed for
 * startups, DAOs, and freelancers.
 */
const Payroll = () => {
    return (
        <>
            <section className="w-full bg-[#F3F4F6] md:py-20 lg:px-0 py-16 px-6">
                <main className='w-full max-w-[1040px] mx-auto grid md:grid-cols-7 gap-8 md:gap-0'>
                    <div className='w-full md:col-span-3 max-w-[368px] flex flex-col justify-center items-start gap-4'>
                        <h3 className="text-primary font-[700] md:text-[40px] text-[32px] md:leading-[48px] leading-[40px] font-sora">Pay your team in crypto with ease</h3>
                        <p className='font-poppins text-[#58556A] font-[400] text-base leading-[28px]'>Strimz makes payroll simple by automating crypto payments on a set schedule. Designed for startups, DAOs, and freelancers.</p>
                        <Link href="/" target='_blank' className='w-[160px] h-[48px] flex justify-center items-center bg-accent rounded-[8px] shadow-ctaShadow text-white md:text-[14px] text-base font-poppins font-[600] leading-[24px]'>Explore payroll</Link>
                    </div>

                    <Image src={globalPay} alt='illustration' className='w-full md:col-span-4' width={2155} height={1571} quality={100} priority />
                </main>
            </section>
            <PaddedLines />
        </>
    )
}

export default Payroll