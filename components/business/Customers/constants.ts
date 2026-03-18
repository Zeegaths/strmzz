/**
 * Filter options and constants for the Customers page
 */

export const CUSTOMER_FILTER_OPTIONS = {
  totalSpent: [
    { label: '$0 - $100', value: '0-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: '$1000+', value: '1000+' },
  ],
  frequency: [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'One-off', value: 'One-off' },
  ],
  lastPayment: [
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 90 days', value: 'last90days' },
    { label: '90+ days ago', value: '90plus' },
  ],
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;
