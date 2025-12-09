import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Flexible Plans | reelzila",
  description: "Choose the perfect plan for your AI video generation needs. Pay as you go or subscribe for more credits.",
  openGraph: {
    title: "Pricing | reelzila",
    description: "Flexible pricing plans for AI video generation",
    url: "https://reelzila.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
