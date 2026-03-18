import "@/styles/globals.css";
import { getMetadata } from "@/utils/getMetadata";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import PrivyProviderWrapper from "./providers/PrivyProviderWrapper";
import { Toaster } from 'sonner';

export const metadata = getMetadata({
  title: "Strimz Subscription Platform - Pay Bills & Subscriptions with Crypto",
  description: "Pay for utility bills, mobile data, airtime, cable TV, and manage subscriptions using cryptocurrency (USDC/USDT). Seamless DeFi payment gateway bridging crypto and traditional services.",
})

/**
 * The root layout component for the app.
 *
 * This component renders the basic HTML structure for the app, including the
 * `<html>` and `<body>` elements, as well as the React Query provider and a
 * toaster component.
 *
 * @param {React.ReactNode} children - The content to be rendered within the
 *   root layout.
 * @returns {JSX.Element} The rendered root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="w-full min-h-screen antialiased bg-[#FFFFFF]"
      >
        <ReactQueryProvider>
          <PrivyProviderWrapper>
            {children}
            <Toaster richColors position="top-right" />
          </PrivyProviderWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}