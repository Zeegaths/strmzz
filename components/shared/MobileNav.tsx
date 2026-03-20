'use client'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetTrigger,
} from "@/components/ui/sheet";
import strimzBlueLogo from "@/public/logo/blueLogo.png";
import Logo from './Logo';
import { Link as Spy } from "react-scroll";
import { LayoutDashboard, MoveUpRight } from 'lucide-react';
import { navLinks } from '@/utils/guestNavLinks';
import { NavLinkTypes } from '@/types/guest';

/**
 * A mobile navigation menu that slides up from the bottom of the screen when the burger icon is clicked.
 *
 * The menu is rendered as a `Sheet` component from `@radix-ui/react-dialog`, which provides a full-screen backdrop and a sheet that slides in from the bottom.
 *
 * The sheet content is a simple `main` element with a flex container that contains a logo and a list of links.
 *
 * The links are rendered as `Spy` components from the `react-scroll` library, which provides smooth scrolling to the corresponding sections of the page.
 *
 * The logo is rendered as a `Logo` component from the `@/components/shared/Logo` module, which renders a Next.js `Image` component with a custom className.
 *
 * When the user clicks on a link, the sheet is closed automatically.
 *
 * @returns {JSX.Element} The mobile navigation menu.
 */
const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-primary">
                    <LayoutDashboard className='w-6 h-6' />
                </button>
            </SheetTrigger>
            <SheetContent className='w-full bg-[#F9FAFB] border-none outline-none'>
                <main className="w-full flex flex-col">
                    <div className="w-full py-6 px-6 flex justify-between items-center">
                        {/* logo */}
                        <Logo href='/' className='w-[120px]' image={strimzBlueLogo} />
                    </div>
                    <div className="w-full mt-16 flex flex-col justify-center gap-6 items-center">
                        {
                            navLinks.map((link: NavLinkTypes, i: number) => (
                                <SheetClose asChild key={i}>
                                    <Spy
                                        to={link.to}
                                        smooth={true}
                                        spy={true}
                                        duration={500}
                                        className={`capitalize font-poppins text-primary font-[500] text-2xl cursor-pointer hover:underline flex items-center gap-2`}
                                    >
                                        {link.name}
                                        <MoveUpRight className="w-6 h-6" />
                                    </Spy>
                                </SheetClose>
                            ))
                        }
                    </div>
                </main>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav