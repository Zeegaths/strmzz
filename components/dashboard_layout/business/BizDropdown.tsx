'use client'
import Link from 'next/link';
import {
    LogOut,
    User,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RxCaretDown } from 'react-icons/rx';
import { PiUserCircleLight } from "react-icons/pi";
import { IoIosHelpCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { CgFileDocument } from 'react-icons/cg';


/**
 * A dropdown menu for the user to access their account settings.
 *
 * The menu is rendered as a `DropdownMenu` component from `@radix-ui/react-dropdown-menu`, which provides a full-screen backdrop and a dropdown menu that slides in from the top of the page.
 *
 * The menu content is a `DropdownMenuContent` component from `@radix-ui/react-dropdown-menu`, which renders a container with a heading and a list of menu items.
 *
 * The menu items are rendered as `DropdownMenuItem` components from `@radix-ui/react-dropdown-menu`, which render a link or a button with an icon and a label.
 *
 * The menu items are grouped into a `DropdownMenuGroup` component, which renders a container with a heading and a list of menu items.
 *
 * The menu is triggered by a `DropdownMenuTrigger` component from `@radix-ui/react-dropdown-menu`, which renders a button or a link that toggles the visibility of the menu.
 *
 * The menu is closed automatically when the user clicks on a menu item.
 *
 * @returns {JSX.Element} The user dropdown menu.
 */
const BizDropdown: React.FC = () => {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("strimzUser");
        router.push("/login")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button type="button" className="bg-white p-[8px] flex justify-center items-center gap-[4px] text-primary rounded-[12px] border-[1px] border-[#E5E7EB] shadow-subIconShadow">
                    <PiUserCircleLight className='w-[24px] h-[24px]' />
                    <RxCaretDown className='w-[24px] h-[24px]' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-[#58556A] w-44 z-[100] mr-2">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/business/account">
                            <User />
                            <span>Profile Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/business">
                            <CgFileDocument />
                            <span>Documentation</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/business/help">
                            <IoIosHelpCircleOutline />
                            <span>Help</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className='w-full text-[#9B1C1C]'>
                        <LogOut />
                        <span>Sign out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BizDropdown;
