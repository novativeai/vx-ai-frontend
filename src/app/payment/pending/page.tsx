"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPendingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id');

  const [status, setStatus] = useState<'pending' | 'paid' | 'failed'>('pending');

  useEffect(() => {
    if (!user || !paymentId) {
      router.push('/pricing');
      return;
    }

    // Listen for payment status updates
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid, 'payments', paymentId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.status === 'paid') {
            setStatus('paid');
            // Redirect to success page
            router.push(`/payment/success?payment_id=${paymentId}`);
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            setStatus('failed');
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user, paymentId, router]);

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
          <p className="text-neutral-400 mb-8">
            Unfortunately, your payment could not be processed. Please try again.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#D4FF4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-12 h-12 text-[#D4FF4F] animate-spin" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Processing Payment</h1>
        <p className="text-neutral-400 mb-2">
          Please wait while we confirm your payment...
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          This usually takes just a few seconds.
        </p>
      </div>
    </div>
  );
}
