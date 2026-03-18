import { StrimzProvider } from '@strimz/sdk/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StrimzProvider
          publicKey={process.env.NEXT_PUBLIC_STRIMZ_PUBLIC_KEY!}
          environment="test"
        >
          {children}
        </StrimzProvider>
      </body>
    </html>
  )
}
