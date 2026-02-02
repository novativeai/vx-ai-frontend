// FILE: ./src/components/LayoutManager.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages that should NOT trigger the profile-completion redirect
const PUBLIC_PATHS = [
  '/signin',
  '/signup',
  '/complete-profile',
  '/terms',
  '/privacy',
  '/legal',
  '/verify-email',
  '/forgot-password',
  '/payment/success',
  '/payment/cancel',
  '/payment/pending',
  '/marketplace/purchase/success',
  '/marketplace/purchase/cancel',
  '/about',
  '/blog',
  '/contact',
  '/refund',
];

export default function LayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, profileComplete } = useAuth();

  // Hide external footer on homepage (it has its own integrated footer)
  const hideFooter = pathname === "/";

  // Redirect authenticated users with incomplete profiles
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p));
    if (isPublicPath) return;

    if (!profileComplete) {
      router.push('/complete-profile');
    }
  }, [user, loading, profileComplete, pathname, router]);

  return (
    <>
      {/* Skip to main content link - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4FF4F]"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
