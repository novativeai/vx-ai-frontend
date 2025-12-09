// FILE: ./src/components/LayoutManager.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {/* Skip to main content link - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4FF4F]"
      >
        Skip to main content
      </a>

      {!isHomePage && <Navbar />}
      {/*
        If it's the homepage, the page itself (`src/app/page.tsx`) handles
        the full-screen scroll container, so `main` doesn't need flex-grow.
        For all other pages, `flex-grow` ensures the content pushes the
        footer down to the bottom of the viewport.
      */}
      <main id="main-content" tabIndex={-1} className={!isHomePage ? "flex-grow" : ""}>{children}</main>
      {/*
        Conditionally render the Footer. It will not appear on the homepage
        because the homepage includes it in its final snap-scroll section.
      */}
      {!isHomePage && <Footer />}
    </>
  );
}