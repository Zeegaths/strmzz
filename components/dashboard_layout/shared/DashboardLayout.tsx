'use client';
import { useState } from 'react';
import { DashboardUserType, SideBarLinksTypes } from '@/types/dashboard';
import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';

interface DashboardLayoutProps {
  userType: DashboardUserType;
  logoHref: string;
  sidebarLinks: SideBarLinksTypes[];
  headerCenterContent?: React.ReactNode;
  headerRightContent?: React.ReactNode;
  sidebarFooterContent?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Shared DashboardLayout component for both user and business dashboards.
 * Eliminates code duplication by accepting configuration props.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userType,
  logoHref,
  sidebarLinks,
  headerCenterContent,
  headerRightContent,
  sidebarFooterContent,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#F9FAFB] lg:p-1.5">
      {/* Page Wrapper Start */}
      <div className="flex h-screen gap-1 overflow-hidden">
        {/* Sidebar Start */}
        <SideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          logoHref={logoHref}
          links={sidebarLinks}
          footerContent={sidebarFooterContent}
        />
        {/* Sidebar End */}

        {/* Content Area Start */}
        <div className="relative flex min-h-[100svh] rounded-t-[8px] bg-white flex-1 border border-[#E5E7EB] flex-col justify-between overflow-y-auto overflow-x-hidden no-scrollbar">
          <section>
            {/* Header Start */}
            <Header
              userType={userType}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              centerContent={headerCenterContent}
              rightContent={headerRightContent}
            />
            {/* Header End */}

            {/* Main Content Start */}
            <main>
              <div className="mx-auto 2xl:max-w-screen-2xl max-w-[800px] mt-3 md:mt-0 pb-6 md:pt-4 md:pb-10 2xl:p-10">
                <section className="w-full lg:px-1.5 px-3">{children}</section>
              </div>
            </main>
          </section>
          {/* Main Content End */}
          <Footer />
        </div>
        {/* Content Area End */}
      </div>
      {/* Page Wrapper End */}
    </div>
  );
};

export default DashboardLayout;
