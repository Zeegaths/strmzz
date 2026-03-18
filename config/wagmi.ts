import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// Use Sepolia for dev, Base mainnet for prod
export const ACTIVE_CHAIN = process.env.NEXT_PUBLIC_CHAIN === 'mainnet' ? base : baseSepolia
export const ACTIVE_CHAIN_ID = ACTIVE_CHAIN.id