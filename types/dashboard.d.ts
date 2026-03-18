// Dashboard user type
export type DashboardUserType = 'user' | 'business';

export type SideBarLinksTypes = {
  href: string;
  title: string;
  icon: React.ReactNode;
};

// Dashboard configuration for user-specific vs business-specific content
export interface DashboardConfig {
  userType: DashboardUserType;
  logoHref: string;
  sidebarLinks: SideBarLinksTypes[];
  headerContent?: React.ReactNode;
}

export type TxPropsTypes = {
  title: string;
  date: string;
  amount: string;
  token: "USDC" | "USDT";
  status: "Completed" | "Failed" | "In progress";
};

export type CVSDataType = {
  name: string;
  address: `0x${string}`;
  amount: number;
};

export type TableDataType = {
  id: number;
  name: string;
  address: string;
  amount: number;
  isEditing?: boolean;
};