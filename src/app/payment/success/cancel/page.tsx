"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
      <XCircle className="w-16 h-16 text-yellow-400 mb-6" />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Payment Canceled</h1>
      <p className="mt-4 text-lg text-neutral-400 max-w-md">
        Your transaction was not completed. Your account has not been charged.
      </p>
      <div className="mt-8">
        <Link href="/pricing">
          <Button variant="brand-solid">Try Again</Button>
        </Link>
      </div>
    </div>
  );
}