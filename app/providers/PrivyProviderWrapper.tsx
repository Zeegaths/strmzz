'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { base } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import StrimzLogo from '@/public/logo/whiteLogo.png'; // 👈 Import your logo

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'light',
          accentColor: '#10B981',
          logo: StrimzLogo.src, // 👈 Use .src to get the URL string
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: base,
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </PrivyProvider>
  );
}