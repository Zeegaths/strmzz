export interface Transaction {
  id: string;
  email: string;
  amount: number;
  token: "USDC" | "USDT";
  status: "Pending" | "Successful" | "Failed";
  frequency: "One-off" | "Monthly" | "Yearly";
  paidVia: "Strimz" | "Transfer";
  timestamp: string;
  txnHash: string;
}

export type FilterType =
  | "token"
  | "status"
  | "frequency"
  | "paidVia"
  | "timeperiod";

export interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

export interface FilterState {
  token: string[];
  status: string[];
  frequency: string[];
  paidVia: string[];
  timeperiod: string;
}