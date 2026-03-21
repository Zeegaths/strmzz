import { FaqsTypes } from "@/types/guest";

export const subscriptionFaqs: FaqsTypes[] = [
  {
    question: "What is Strimz, and what can I use it for?",
    answer:
      "Strimz is a payment infrastructure that bridges cryptocurrency and everyday services. As an individual, you can pay for utility bills, mobile airtime, data bundles, and cable TV subscriptions using crypto. As a business, you can integrate our SDK to accept crypto payments from your users while receiving fiat. No bank accounts needed—fast, secure, and seamless.",
  },
  {
    question: "What services can I pay for with Strimz?",
    answer:
      "You can pay for electricity bills (prepaid and postpaid meters), mobile airtime top-ups, data bundles from various network providers, and cable TV subscriptions (DSTV, GOTV, Startimes, Showmax). Simply connect your wallet, select the service, and pay instantly with USDC or USDT.",
  },
  {
    question: "What cryptocurrencies does Strimz support?",
    answer:
      "Strimz currently supports stablecoins including USDC and USDT. Using stablecoins ensures predictable pricing without volatility—your $100 payment stays $100. You can pay directly from your wallet without conversions.",
  },
  {
    question: "How fast are payments processed?",
    answer:
      "Payments on Strimz process instantly, typically in under 5 seconds. Your services activate immediately with blockchain-verified payments. No waiting periods, no bank approvals—just instant confirmation and service activation.",
  },
  {
    question: "How do I integrate Strimz SDK into my platform?",
    answer:
      "Integrating Strimz is simple. Sign up for a business account, get your API keys, and follow our documentation to integrate our RESTful API. You can configure webhooks for real-time notifications, manage your team, and access analytics through your business dashboard. Your users pay with crypto, and you receive fiat—we handle the complexity.",
  },
  {
    question: "Is Strimz safe and secure?",
    answer:
      "Yes! Strimz uses blockchain technology to ensure secure transactions. All payments are verified on-chain, and we implement industry-standard security measures including IP whitelisting for business accounts, secure API key management, and encrypted data transmission. You maintain full control of your wallet and payments.",
  },
  {
    question: "Do I need a bank account to use Strimz?",
    answer:
      "No! That's the beauty of Strimz. As an individual user, you only need a crypto wallet to start paying for services. No bank account, no credit card—just connect your wallet and pay. For businesses integrating our SDK, you'll need to set up how you want to receive payments (fiat or crypto).",
  },
  {
    question: "What are the fees for using Strimz?",
    answer:
      "For individual users, we charge a small service fee per transaction, which is displayed before you confirm payment. For businesses integrating our SDK, pricing depends on your transaction volume. Contact our team or check your business dashboard for detailed pricing information.",
  },
  {
    question: "Can I track my payment history?",
    answer:
      "Yes! Both individual users and businesses have access to comprehensive dashboards. View your complete transaction history, filter by service type or date, track your spending, and download transaction records. Businesses also get advanced analytics and reporting features.",
  },
  {
    question: "What if I have an issue with a payment?",
    answer:
      "If you encounter any payment issues, you can reach out to our support team via email. We also provide real-time transaction status updates in your dashboard. For businesses, we offer dedicated support channels and webhook notifications to help you handle any payment-related issues with your users.",
  },
];
