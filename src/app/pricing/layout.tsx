import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits - Pay As You Go | reelzila",
  description: "Purchase credits for AI video generation. No subscriptions, no commitments. Credits never expire.",
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
