'use client'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import StrimzLogo from "@/public/logo/whiteLogo.png"
import Link from 'next/link'
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { footerLinks } from '@/utils/guestNavLinks'
import { footerLinksTypes } from '@/types/guest'
import PaddedLines from './paddedLines'

/**
 * GuestFooter is a functional component that renders the footer section for guest pages.
 * 
 * The footer includes the Strimz logo, a list of links to Strimz's social media profiles and important pages,
 * and a copyright notice with the current year.
 * 
 * The component is styled to be fully responsive and centered, with padding adjustments for large screens.
 * 
 * @returns {JSX.Element} A section element that wraps the guest page footer.
 */
const GuestFooter = () => {

    const [year, setYear] = useState('')

    useEffect(() => {
        const year = new Date().getFullYear()
        setYear(year.toString())
    }, [])

    return (
        <>
            <footer className='w-full bg-primary flex flex-col lg:px-20 md:px-12 px-4 pb-10 lg:pt-20 pt-12'>
                <section className='w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-6 md:gap-0 border-b border-[#58556A] pb-4'>
                    <Logo href='/' className='lg:w-[126.98px] md:w-[101px] w-[126.98px]' image={StrimzLogo} />

                    <div className='flex md:flex-row flex-col items-center lg:gap-6 md:gap-4 gap-4'>
                        {
                            footerLinks.map((link: footerLinksTypes, index: number) => (
                                <Link key={index} href={link.link} target='_blank' className='font-[400] font-poppins text-base text-[#D1D5DB] transition hover:text-white'>{link.name}</Link>
                            ))
                        }
                    </div>

                    <div className='flex items-center gap-4'>
                        <Link href="https://x.com/Strimz_HQ" target='_blank' className='text-[#D1D5DB] transition hover:text-white'>
                            <FaXTwitter className='w-6 h-6' />
                        </Link>
                        <Link href="https://www.linkedin.com/company/strimzhq/" target='_blank' className='text-[#D1D5DB] transition hover:text-white'>
                            <FaLinkedin className='w-6 h-6' />
                        </Link>
                    </div>
                </section>
                <section className='w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 md:gap-0 pt-4'>
                    <p className='text-sm md:text-base font-[400] font-poppins text-[#D1D5DB]'>Made with 💖 by the Strimz team</p>
                    <p className='font-[400] font-poppins md:text-base text-sm text-[#D1D5DB]'>© {year} Strimz. All rights reserved.</p>
                </section>
            </footer>
            <PaddedLines />
        </>
    )
}

export default GuestFooter