'use client'
import { useScroll, motion, useSpring } from 'framer-motion';
import React from 'react'
import Logo from './Logo';
import StrimzBlueLogo from "@/public/logo/blueLogo.png"
import { Link as Spy } from "react-scroll";
import MobileNav from './MobileNav';
import { useRouter } from 'next/navigation';
import { navLinks } from '@/utils/guestNavLinks';
import { NavLinkTypes } from '@/types/guest';
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';
import { LogIn } from 'lucide-react';

/**
 * A responsive navigation bar with a progress bar at the top.
 *
 * This component renders a full-width header with a logo on the left,
 * and a navigation menu with links and buttons on the right. The links
 * are rendered as a list of `Spy` components from the `react-scroll`
 * library, which allows for smooth scrolling to the corresponding
 * sections of the page. The buttons are rendered as `button` elements,
 * with a `Login` button that navigates to the login page and a mobile
 * navigation menu that is only visible on small screens.
 *
 * The progress bar is rendered as a `motion.div` element with a spring
 * animation that follows the `scrollYProgress` value from the `useScroll`
 * hook.
 */
const NavBar = () => {

    const { scrollYProgress } = useScroll();

    const router = useRouter()

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 bg-accent origin-[0%] h-[6px] z-[42]"
                style={{ scaleX }}
            />
            <header className='w-full bg-white h-[80px] md:h-[82px] flex items-center px-4 md:px-8 lg:px-16'>
                <nav className='w-full max-w-6xl mx-auto flex justify-between items-center'>
                    {/* Logo */}
                    <Logo href='/' image={StrimzBlueLogo} className='w-[101px] md:w-[116px]' />

                    {/* links */}
                    <div className='hidden lg:flex gap-[24px] font-poppins items-center'>
                        {
                            navLinks.map((link: NavLinkTypes, i: number) => (
                                <Spy
                                    key={i}
                                    to={link.to}
                                    smooth={true}
                                    spy={true}
                                    duration={700}
                                    className={`capitalize font-poppins text-[#58556A] font-[400] text-[16px] cursor-pointer transition-all hover:text-primary`}
                                >
                                    {link.name}
                                </Spy>
                            ))
                        }
                    </div>

                    {/* buttons */}
                    <div className='flex items-center gap-[24px]'>
                        <InteractiveHoverButton
                            type='button'
                            onClick={() => router.push("/auth")}
                            icon={<LogIn className="h-4 w-4" />}
                            innerClassName='bg-accent rounded-[8px]'
                            className='w-[120px] h-[40px] flex justify-center items-center bg-[#F9FAFB] rounded-[8px] cursor-pointer text-[14px] font-[500] font-poppins transition-all duration-300 text-primary hover:text-white shadow-navCTA'>Login</InteractiveHoverButton>

                        <div className="lg:hidden flex items-center">
                            <MobileNav />
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default NavBar