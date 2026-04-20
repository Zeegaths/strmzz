export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  token: "USDC" | "USDT";
  payments: number;
  frequency: "Monthly" | "Yearly" | "One-off";
  lastPayment: string;
}

export interface ApiCustomer {
  payer: string;
  totalTransactions: string | number;
  totalSpent: string | number;
  lastTransaction: string;
}

export function transformCustomer(customer: ApiCustomer): Customer {
  const totalSpent = Number(customer.totalSpent);
  const totalTransactions = Number(customer.totalTransactions);
  
  let frequency: "Monthly" | "Yearly" | "One-off" = "One-off";
  if (totalTransactions >= 12) {
    frequency = "Yearly";
  } else if (totalTransactions > 1) {
    frequency = "Monthly";
  }

  return {
    id: customer.payer,
    name: customer.payer.slice(0, 10) + "..." + customer.payer.slice(-6),
    email: customer.payer,
    totalSpent,
    token: "USDC",
    payments: totalTransactions,
    frequency,
    lastPayment: customer.lastTransaction
      ? new Date(customer.lastTransaction).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "N/A",
  };
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