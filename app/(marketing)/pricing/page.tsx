import { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing/pricing-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/global/header";

export const metadata: Metadata = {
  title: "Pricing | AI Doctor Assistant",
  description: "Simple, transparent pricing for everyone. Pay by the month or the year, and cancel at any time.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <PricingSection />
      <Footer />
    </>
  );
} 