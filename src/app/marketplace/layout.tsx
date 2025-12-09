import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace - Buy & Sell AI Videos | reelzila",
  description: "Discover and purchase premium AI-generated videos from top creators",
  openGraph: {
    title: "Marketplace | reelzila",
    description: "Buy & sell premium AI-generated videos",
    url: "https://reelzila.com/marketplace",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
