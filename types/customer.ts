export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  token: "USDC" | "USDT";
  payments: number; // Number of payments made
  frequency: "Monthly" | "Yearly" | "One-off";
  lastPayment: string;
}

export type FilterType =
  | "totalSpent"
  | "frequency"
  | "lastPayment";

export interface FilterOption {
  label: string;
  value: string;
}

export interface CustomerFilterState {
  totalSpent: string[];
  frequency: string[];
  lastPayment: string[];
}