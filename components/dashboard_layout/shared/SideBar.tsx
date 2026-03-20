'use client';
import { useEffect, useRef } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import StrimzLogo from '@/public/logo/blueLogo.png';
import { SideBarLinksTypes } from '@/types/dashboard';

interface SideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logoHref: string;
  links: SideBarLinksTypes[];
  footerContent?: React.ReactNode;
}

/**
 * Shared SideBar component for dashboard layouts.
 * Accepts configuration for logo href and navigation links.
 */
const SideBar: React.FC<SideBarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  logoHref,
  links,
  footerContent,
}) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const toggleScroll = () => {
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    };
    toggleScroll();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[9999] flex h-[100svh] w-64 flex-col justify-between overflow-y-hidden bg-[#F9FAFB] duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex flex-col">
        {/* Sidebar Header */}
        <div className="flex flex-col gap-2 font-barlow px-6 py-8 lg:py-6.5">
          <div className="flex items-start justify-between gap-2">
            <Logo
              href={logoHref}
              className="w-[101.58px] md:w-[110.58px] lg:w-[130px]"
              image={StrimzLogo}
            />

            <button
              ref={trigger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              className="block lg:hidden text-primary"
            >
              <IoIosArrowRoundBack className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 pb-4 lg:px-6">
          <ul className="flex flex-col gap-1.5">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== logoHref && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-[8px] py-2.5 px-4 font-[500] text-[14px] font-poppins leading-[18px] duration-200 ease-in-out hover:bg-[#FFFFFF] border hover:border-[#E5E7EB] hover:shadow-sidebarLinkShadow hover:text-accent ${isActive
                      ? 'bg-white border-[#E5E7EB] shadow-sidebarLinkShadow text-accent'
                      : 'text-[#58556A]'
                      }`}
                  >
                    <div
                      className={`${isActive ? 'text-accent' : 'text-[#58556A] group-hover:text-accent'
                        }`}
                    >
                      {link.icon}
                    </div>
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Content */}
      {footerContent && <div className="px-4 pb-4 lg:px-6">{footerContent}</div>}
    </aside>
  );
};

export default SideBar;
