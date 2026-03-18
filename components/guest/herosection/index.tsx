'use client'
import React from 'react'
import strimzVector from '@/public/logoIcons/StrimzVector.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'
import { MoveRight, FileText } from 'lucide-react'
import StackedUsers from './StackedUsers'
import electricity from "@/public/bills/electricity.png"
import airtime from "@/public/bills/airtime.png"
import data from "@/public/bills/data.png"
import cable from "@/public/bills/cable.png"
import usdc from "@/public/bills/USDC.png"
import usdt from "@/public/bills/USDT.png"
import MovingText from '@/components/shared/MovingText'

/**
 * HeroSection is a functional component that serves as the landing page for guests.
 * It contains a background pattern, a group of subscription and utility brands, and a call-to-action
 * to encourage users to start automating their payroll with Strimz.
 *
 * @returns {JSX.Element} A section element that wraps the guest page hero section.
 */
const HeroSection = () => {

    const router = useRouter()

    return (
        <>
            <section className='w-full md:min-h-screen lg:pt-[44px] pt-[36px] overflow-x-hidden bg-white'>
                <main className="max-w-[900px] mx-auto w-full flex flex-col items-center gap-6 px-4">
                    {/* top section */}
                    <div className='w-full h-[760px] md:h-auto relative flex flex-col items-center justify-start'>
                        {/* Waves 1 */}
                        <div className='relative overflow-hidden md:w-[600px] md:h-[600px] w-full aspect-square rounded-full bg-gradient-to-b from-[#F0FFF8] to-[#FFFFFF] flex justify-center items-center'>

                            {/* Waves 2 */}
                            <div className="relative md:w-[450px] md:h-[450px] w-[280px] h-[280px] rounded-full bg-gradient-to-b from-[#CCFFE7] to-[#FFFFFF] flex justify-center items-center before:absolute before:w-full before:h-full before:inset-0 before:rounded-full before:bg-accent/60 before:animate-custom-ping before:opacity-60 before:delay-[500ms]">

                                {/* Category Icons */}
                                {/* Left side */}
                                <Image src={electricity} alt="electricity" className="w-[48px] md:w-[70px] h-[48px] md:h-[70px] absolute -top-[4%] left-[30%] drop-shadow-brandShadow" width={72} height={72} priority quality={100} />

                                <Image src={airtime} alt="airtime" className="w-[48px] md:w-[70px] h-[48px] md:h-[70px] absolute top-[8%] left-[10%] drop-shadow-brandShadow" width={72} height={72} priority quality={100} />

                                <Image src={data} alt="data" className="w-[48px] md:w-[70px] h-[48px] md:h-[70px] drop-shadow-brandShadow absolute top-[30%] -left-[5%]" width={72} height={72} priority quality={100} />

                                {/* right side */}
                                <Image src={cable} alt="cable tv" className="w-[48px] md:w-[70px] h-[48px] md:h-[70px] drop-shadow-brandShadow absolute -top-[4%] right-[30%]" width={72} height={72} priority quality={100} />

                                <div className="w-[38px] md:w-[60px] h-[38px] md:h-[60px] shadow-stableShadow absolute top-[8%] right-[10%] bg-[#F9FAFB] rounded-full flex justify-center items-center">
                                    <Image src={usdc} alt="usdc" className="mt-1.5 md:w-[40px] md:h-[40px] w-[30px] h-[30px]" width={271} height={271} priority quality={100} />
                                </div>
                                <div className="w-[38px] md:w-[60px] h-[38px] md:h-[60px] shadow-stableShadow absolute top-[30%] -right-[5%] bg-[#F9FAFB] rounded-full flex justify-center items-center">
                                    <Image src={usdt} alt="usdt" className="mt-1.5 md:w-[40px] md:h-[40px] w-[30px] h-[30px]" width={271} height={271} priority quality={100} />
                                </div>

                                {/* Waves 3 */}
                                <div className='relative md:w-[300px] md:h-[300px] w-[180px] h-[180px] rounded-full bg-gradient-to-b from-[#B3FEDB] to-[#FFFFFF] flex justify-center items-center'>

                                    {/* strimz at the core */}
                                    <span className='flex lg:w-[100px] lg:h-[100px] md:w-[80px] md:h-[80px] w-[60px] h-[60px] relative'>
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-85" />
                                        <Image src={strimzVector} alt='logo' className='w-full h-full' width={120} height={120} priority quality={100} />
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* group of text */}
                        <div className='absolute lg:-bottom-44 md:-bottom-32 -bottom-0 inset-x-0 w-full bg-gradient-to-b from-white/0 to-white flex flex-col items-center gap-4 px-4'>
                            <div className='flex flex-col gap-2.5 md:gap-0'>
                                <h1 className="font-sora font-[700] lg:text-[58px] md:text-[48px] text-[36px] lg:leading-[58px] md:leading-[48px] leading-[36px] text-primary text-center">The Payment Infrastructure</h1>
                                <h3 className="font-sora font-[600] lg:text-[36px] md:text-[32px] text-[20px] lg:leading-[64px] md:leading-[32px] leading-[20px] text-primary text-center">Bridging Crypto & Everyday Services</h3>
                            </div>
                            <p className="text-[#58556A] font-poppins font-[400] text-base text-center max-w-[800px]">Whether you&apos;re paying bills with crypto or building a platform that accepts crypto payments, Strimz makes it seamless, secure, and instant.</p>
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                                <InteractiveHoverButton
                                    type='button'
                                    onClick={() => router.push("/auth")}
                                    icon={<MoveRight className="w-5 h-5" />}
                                    innerClassName='bg-accent rounded-[8px]'
                                    className='w-[150px] h-[48px] flex justify-center items-center bg-accent rounded-[8px] cursor-pointer text-[14px] font-[500] font-poppins text-white hover:text-white shadow-ctaShadow'>
                                    Get Started
                                </InteractiveHoverButton>

                                <InteractiveHoverButton
                                    type='button'
                                    onClick={() => router.push("/docs")}
                                    icon={<FileText className="w-5 h-5" />}
                                    innerClassName='bg-accent rounded-[8px]'
                                    className='w-[220px] h-[48px] flex justify-center items-center bg-[#F9FAFB] rounded-[8px] cursor-pointer text-[14px] font-[500] font-poppins transition-all duration-300 text-accent hover:text-white shadow-ctaShadow'>View Documentation</InteractiveHoverButton>
                            </div>

                            {/* bottom section */}
                            <StackedUsers />
                        </div>
                    </div>


                </main>
            </section>
            <MovingText />
        </>
    )
}

export default HeroSection