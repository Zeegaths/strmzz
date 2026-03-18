/**
 * Utility functions for the Transactions page
 */

/**
 * Returns the appropriate color classes for transaction status badges
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Successful":
      return "text-[#01753E] bg-[#E7FEF3]";
    case "Pending":
      return "text-[#723B13] bg-[#FDFDEA]";
    case "Failed":
      return "text-[#9B1C1C] bg-[#FDF2F2]";
    default:
      return "text-[#6B7280] bg-[#F3F4F6]";
  }
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    // TODO: Add toast notification here
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
  }
};

/**
 * Formats a transaction hash for display (truncated)
 */
export const formatTxnHash = (hash: string, length: number = 15): string => {
  if (hash.length <= length) return hash;
  return `${hash.slice(0, length)}...`;
};
