/**
 * Filter options and constants for the Transactions page
 */

export const FILTER_OPTIONS = {
  token: [
    { label: 'USDC', value: 'USDC' },
    { label: 'USDT', value: 'USDT' },
  ],
  status: [
    { label: 'Successful', value: 'Successful' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' },
  ],
  frequency: [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'One-off', value: 'One-off' },
  ],
  paidVia: [
    { label: 'Strimz', value: 'Strimz' },
    { label: 'Transfer', value: 'Transfer' },
  ],
};

export const TIME_PERIOD_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'This month', value: 'thismonth' },
  { label: 'Last month', value: 'lastmonth' },
  { label: 'This year', value: 'thisyear' },
  { label: 'Custom', value: 'custom' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;
