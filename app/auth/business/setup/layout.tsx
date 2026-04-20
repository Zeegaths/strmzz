import Web3Provider from '@/providers/Web3Provider'

export default function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  )
}
