/**
 * Contract configuration for checkout flow
 * Only includes the ABIs needed for the checkout page:
 * - USDC: allowance, approve
 * - StrimzPayments: pay, createSubscription
 */

// Addresses — update these after deployment
export const CONTRACTS = {
  // StrimzPayments contract on Base
  STRIMZ_PAYMENTS: process.env.NEXT_PUBLIC_STRIMZ_CONTRACT as `0x${string}` || '0x0000000000000000000000000000000000000000',

  // USDC on Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  // USDC on Base Sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',

  // USDT on Base (if supported)
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000',
}

export const getTokenAddress = (currency: 'USDC' | 'USDT'): `0x${string}` => {
  return currency === 'USDT' ? CONTRACTS.USDT : CONTRACTS.USDC
}

// USDC has 6 decimals
export const TOKEN_DECIMALS = 6

export const toTokenUnits = (amount: number): bigint => {
  return BigInt(Math.round(amount * 10 ** TOKEN_DECIMALS))
}

// ============================================================================
// ERC20 ABI (approve + allowance only)
// ============================================================================

export const ERC20_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// ============================================================================
// StrimzPayments ABI (pay + createSubscription only)
// ============================================================================

export const STRIMZ_PAYMENTS_ABI = [
  {
    name: 'pay',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'merchantId', type: 'bytes32' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'preference', type: 'string' },
    ],
    outputs: [{ name: 'paymentId', type: 'bytes32' }],
  },
  {
    name: 'createSubscription',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'merchantId', type: 'bytes32' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'interval', type: 'uint8' },
    ],
    outputs: [{ name: 'subscriptionId', type: 'bytes32' }],
  },
] as const

// Map interval strings to contract enum values
export const INTERVAL_TO_ENUM: Record<string, number> = {
  weekly: 0,
  monthly: 1,
  quarterly: 2,
  yearly: 3,
}


