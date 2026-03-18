'use client';
import DashboardLayout from '@/components/dashboard_layout/shared/DashboardLayout';
import BusinessHeaderContent from '@/components/dashboard_layout/business/BusinessHeaderContent';
import BusinessSidebarFooter from '@/components/dashboard_layout/business/BusinessSidebarFooter';
import { BusinessSideBarLinks } from '@/utils/sideBarLinks';
import BizDropdown from '@/components/dashboard_layout/business/BizDropdown';

/**
 * The BusinessLayout component renders the layout for the business dashboard.
 * Uses the shared DashboardLayout component with business-specific configuration.
 */
export default function BusinessLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardLayout
            userType="business"
            logoHref="/business"
            sidebarLinks={BusinessSideBarLinks}
            headerCenterContent={<BusinessHeaderContent />}
            headerRightContent={<BizDropdown />}
            sidebarFooterContent={<BusinessSidebarFooter />}
        >
            {children}
        </DashboardLayout>
    );
}
