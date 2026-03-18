'use client'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"
import { MoveRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from 'react'
import strimzVector from '@/public/logoIcons/StrimzVector.svg'
import pattern from "@/public/patterns/ctaPattern.svg"

/**
 * CTA (Call-to-Action) component renders a section at the bottom of the home page 
 * that encourages users to start automating their payroll.
 * 
 * The section includes:
 * - A main heading and a subheading that introduce the concept.
 * - A button that, when clicked, navigates to the login page.
 * - An absolute positioned pattern that provides a dynamic background.
 * - A logo that is animated to draw attention.
 * 
 * The component is designed to be fully responsive, ensuring a seamless viewing experience across devices.
 */
const CTA = () => {

    const router = useRouter()

    return (
        <section className="w-full bg-primary md:py-20 py-16">
            <main className='w-full flex flex-col items-center'>
                <div className="w-full flex flex-col items-center gap-4 max-w-[812px] lg:px-0  px-6 mb-8">
                    <h3 className="text-white font-[700] lg:text-[52px] md:text-[46px] text-[36px] lg:leading-[52px] md:leading-[46px] leading-[36px] font-sora text-center">
                        Pay your bills and subscriptions with Strimz
                    </h3>
                    <p className='w-full max-w-[522px] font-poppins text-white font-[400] text-base leading-[28px] text-center'>Fast, secure, and hassle-free payments for streaming services, utilities, and mobile airtime. crypto payments made easy. </p>
                    <InteractiveHoverButton
                        type='button'
                        onClick={() => router.push("/auth")}
                        icon={<MoveRight className="w-5 h-5" />}
                        innerClassName='bg-white rounded-[8px]'
                        className='w-[150px] h-[48px] flex justify-center items-center bg-accent rounded-[8px] cursor-pointer text-[14px] font-[500] font-poppins text-white hover:text-primary shadow-ctaShadow'>
                        Get started
                    </InteractiveHoverButton>
                </div>

                <div className="relative w-full h-[145px] overflow-hidden">
                    <Image src={pattern} alt="pattern" className='w-full h-full animate-pulse' width={1440} height={151} quality={100} priority />
                    <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex lg:w-[90px] lg:h-[90px] md:w-[70px] md:h-[70px] w-[50px] h-[50px]'>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-85" />
                        <Image src={strimzVector} alt='logo' className='w-full h-full' width={120} height={120} priority quality={100} />
                    </span>
                </div>
            </main>
        </section>
    )
}

export default CTA