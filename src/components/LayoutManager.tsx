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
      <Navbar />
      {/*
        If it's the homepage, the page itself (`src/app/page.tsx`) handles
        the full-screen scroll container, so `main` doesn't need flex-grow.
        For all other pages, `flex-grow` ensures the content pushes the
        footer down to the bottom of the viewport.
      */}
      <main className={!isHomePage ? "flex-grow" : ""}>{children}</main>
      {/*
        Conditionally render the Footer. It will not appear on the homepage
        because the homepage includes it in its final snap-scroll section.
      */}
      {!isHomePage && <Footer />}
    </>
  );
}