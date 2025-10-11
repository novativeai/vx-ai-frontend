// FILE: ./src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutManager from "@/components/LayoutManager"; // Import the new client component


export const metadata: Metadata = {
  title: "reelzila | AI Studio",
  description: "Generate stunning videos from text prompts using the power of AI.",
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