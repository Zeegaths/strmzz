'use client';
import DashboardLayout from '@/components/dashboard_layout/shared/DashboardLayout';
import UserHeaderContent from '@/components/dashboard_layout/user/UserHeaderContent';
import UserDropdown from '@/components/dashboard_layout/user/UserDropdown';
import { UserSideBarLinks } from '@/utils/sideBarLinks';

/**
 * The UserLayout component renders the layout for the user dashboard.
 * Uses the shared DashboardLayout component with user-specific configuration.
 */
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout
      userType="user"
      logoHref="/user"
      sidebarLinks={UserSideBarLinks}
      headerCenterContent={<UserHeaderContent />}
      headerRightContent={<UserDropdown />}
    >
      {children}
    </DashboardLayout>
  );
}
