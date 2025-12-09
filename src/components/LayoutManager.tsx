// FILE: ./src/components/LayoutManager.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {

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
      <Footer />
    </>
  );
}