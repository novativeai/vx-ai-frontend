import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Generator | reelzila",
  description: "Create stunning AI-generated videos with VEO 3, Seedance-1 Pro, and WAN 2.2 models",
  openGraph: {
    title: "AI Video Generator | reelzila",
    description: "Create stunning AI-generated videos",
    url: "https://reelzila.com/generator",
  },
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
