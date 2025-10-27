"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
      <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Payment Successful!</h1>
      <p className="mt-4 text-lg text-neutral-400 max-w-md">
        Your credits have been added to your account. You can now continue creating.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/account">
          <Button variant="brand-solid">Go to My Account</Button>
        </Link>
        <Link href="/explore">
          <Button variant="brand-outline">Explore Models</Button>
        </Link>
      </div>
    </div>
  );
}