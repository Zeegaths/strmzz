/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import Logo from '@/components/shared/Logo';
import StrimzLogo from '@/public/logo/whiteLogo.png';
import HamburgerButton from './HamburgerButton';
import { DashboardUserType } from '@/types/dashboard';

interface HeaderProps {
  userType: DashboardUserType;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

/**
 * Shared Header component for dashboard layouts.
 * Accepts different content for user vs business dashboards.
 */
const Header: React.FC<HeaderProps> = ({
  userType,
  sidebarOpen,
  setSidebarOpen,
  centerContent,
  rightContent,
}) => {
  const logoHref = userType === 'user' ? '/user' : '/business';

  const handleToggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="sticky top-0 z-[99] flex w-full bg-white overflow-hidden border-b border-[#E5E7EB]">
      <div className="flex flex-grow items-center justify-between py-3 px-4 shadow md:px-6">
        <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
          <HamburgerButton sidebarOpen={sidebarOpen} onClick={handleToggleSidebar} />
          <Logo
            href={logoHref}
            className="w-[101.58px] flex-shrink-0 lg:hidden flex"
            image={StrimzLogo}
          />
        </div>

        {centerContent && (
          <div className="hidden sm:flex flex-col">{centerContent}</div>
        )}

        <div className="flex items-center gap-3">{rightContent}</div>
      </div>
    </header>
  );
};

export default Header;
