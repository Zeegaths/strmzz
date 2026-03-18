'use client'
import CTA from "@/components/guest/CTA";
import Faqs from "@/components/guest/faqs";
import Features from "@/components/guest/features";
import HeroSection from "@/components/guest/herosection";
import Stats from "@/components/guest/stats";
import HowItWorks from "@/components/guest/howItWorks";
import ForIndividuals from "@/components/guest/forIndividuals";
import ForBusinesses from "@/components/guest/forBusinesses";
import TrustBadges from "@/components/guest/trustBadges";


/**
 * The Home component is the main entry point for the application.
 * It renders all the top-level components for the guest experience.
 *
 * Page Structure:
 * 1. Hero Section - Main value proposition for both B2C and B2B
 * 2. Features - Key platform features (One-Click Payments, USDC/USDT, Instant Confirmation)
 * 3. Stats - Platform metrics (Transactions, Services, Speed)
 * 4. How It Works - Step-by-step guide for individuals and businesses
 * 5. For Individuals (B2C) - Features for individual users paying bills with crypto
 * 6. For Businesses (B2B) - Features for businesses accepting crypto payments
 * 7. Trust Badges - Security and trust indicators
 * 8. FAQs - Frequently asked questions
 * 9. CTA - Final call-to-action
 */
export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <Features />
      <Stats />
      <HowItWorks />
      <ForIndividuals />
      <ForBusinesses />
      <TrustBadges />
      <Faqs />
      <CTA />
    </main>
  );
}
