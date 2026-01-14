"use client";

import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const subscriptionId = searchParams.get('subscription_id');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
        <p className="text-neutral-400 mb-2">
          Your payment was not completed.
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          No charges were made to your account. You can try again whenever you&apos;re ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
