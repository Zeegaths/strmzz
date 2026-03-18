/**
 * Utility functions for the Customers page
 */

/**
 * Formats currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Check if total spent matches filter range
 */
export const matchesTotalSpentRange = (amount: number, range: string): boolean => {
  switch (range) {
    case '0-100':
      return amount >= 0 && amount <= 100;
    case '100-500':
      return amount > 100 && amount <= 500;
    case '500-1000':
      return amount > 500 && amount <= 1000;
    case '1000+':
      return amount > 1000;
    default:
      return true;
  }
};

/**
 * Check if last payment date matches filter period
 */
export const matchesLastPaymentPeriod = (lastPayment: string, period: string): boolean => {
  const paymentDate = new Date(lastPayment);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - paymentDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (period) {
    case 'last7days':
      return diffDays <= 7;
    case 'last30days':
      return diffDays <= 30;
    case 'last90days':
      return diffDays <= 90;
    case '90plus':
      return diffDays > 90;
    default:
      return true;
  }
};
