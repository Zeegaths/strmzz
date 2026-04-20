export interface Transaction {
  id: string;
  onChainPaymentId: string;
  payer: string;
  token: "USDC" | "USDT";
  amount: number;
  fee: number;
  currency: "USDC" | "USDT";
  status: "pending" | "completed" | "failed" | "refunded";
  type: "one_time" | "subscription";
  reference?: string;
  transactionHash: string;
  blockNumber: number;
  createdAt: string;
}

export interface TransactionRow {
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

export function transformTransaction(tx: Transaction): TransactionRow {
  const statusMap: Record<string, "Pending" | "Successful" | "Failed"> = {
    pending: "Pending",
    completed: "Successful",
    failed: "Failed",
    refunded: "Failed",
  };

  const typeMap: Record<string, "One-off" | "Monthly" | "Yearly"> = {
    one_time: "One-off",
    subscription: "Monthly",
  };

  return {
    id: tx.id,
    email: tx.payer || "Unknown",
    amount: Number(tx.amount),
    token: tx.token,
    status: statusMap[tx.status] || "Pending",
    frequency: typeMap[tx.type] || "One-off",
    paidVia: "Strimz",
    timestamp: new Date(tx.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    txnHash: tx.transactionHash ? `${tx.transactionHash.slice(0, 10)}...` : "",
  };
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