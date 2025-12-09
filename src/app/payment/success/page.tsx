"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id');

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    async function verifyPayment() {
      if (!user || !paymentId) {
        router.push('/pricing');
        return;
      }

      try {
        const paymentDoc = await getDoc(
          doc(db, 'users', user.uid, 'payments', paymentId)
        );

        if (paymentDoc.exists()) {
          const data = paymentDoc.data();
          if (data.status === 'paid') {
            setVerified(true);
            setCredits(data.creditsPurchased || 0);
          } else {
            // Payment not confirmed yet
            router.push('/payment/pending?payment_id=' + paymentId);
            return;
          }
        } else {
          router.push('/pricing');
          return;
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        router.push('/pricing');
        return;
      }

      setLoading(false);
    }

    verifyPayment();
  }, [user, paymentId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F]" />
      </div>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#D4FF4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-[#D4FF4F]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-neutral-400 mb-2">
          {credits} credits have been added to your account.
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          You can start generating videos right away.
        </p>
        <a
          href="/generator"
          className="inline-block px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90"
        >
          Start Creating
        </a>
      </div>
    </div>
  );
}
