// FILE: ./src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutManager from "@/components/LayoutManager"; // Import the new client component


export const metadata: Metadata = {
  title: "reelzila | AI-Powered Video Generation Studio",
  description: "Transform your creative vision into stunning, high-definition videos with AI. A platform for filmmakers, advertisers & creative teams featuring VEO 3, Seedance-1 Pro, and WAN 2.2 models.",
  keywords: ["AI video generation", "text to video", "AI video creator", "filmmaking AI", "video generation platform", "VEO 3", "AI studio", "creative video tools"],
  authors: [{ name: "reelzila" }],
  creator: "reelzila",
  publisher: "reelzila",
  metadataBase: new URL('https://reelzila.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reelzila.com',
    title: 'reelzila | AI-Powered Video Generation Studio',
    description: 'Transform your creative vision into stunning videos with advanced AI models. Professional-grade video generation for filmmakers and creative teams.',
    siteName: 'reelzila',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'reelzila AI Video Studio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'reelzila | AI-Powered Video Generation',
    description: 'Create stunning videos with AI. Advanced models for professional filmmakers and creative teams.',
    creator: '@reelzila',
    images: ['/images/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // THE FIX: Add className="dark" to the <html> tag. This will now work.
    <html lang="en" className="dark h-full">
      <body className={`flex flex-col h-full`}>
        <AuthProvider>
          {/*
            The LayoutManager now contains all the client-side logic
            for handling the navbar and conditional footer.
          */}
          <LayoutManager>{children}</LayoutManager>
        </AuthProvider>
      </body>
    </html>
  );
}