"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Clock, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TIMEOUT_SECONDS = 60;

export default function PaymentPendingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id');

  const [status, setStatus] = useState<'pending' | 'paid' | 'failed' | 'timeout'>('pending');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Manual status check function
  const checkPaymentStatus = useCallback(async () => {
    if (!user || !paymentId) return;

    setIsChecking(true);
    try {
      const paymentDoc = await getDoc(doc(db, 'users', user.uid, 'payments', paymentId));
      if (paymentDoc.exists()) {
        const data = paymentDoc.data();
        if (data.status === 'paid') {
          setStatus('paid');
          router.push(`/payment/success?payment_id=${paymentId}`);
        } else if (data.status === 'failed' || data.status === 'cancelled') {
          setStatus('failed');
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setIsChecking(false);
    }
  }, [user, paymentId, router]);

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
            router.push(`/payment/success?payment_id=${paymentId}`);
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            setStatus('failed');
          }
        }
      }
    );

    // Timeout timer
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev >= TIMEOUT_SECONDS) {
          setStatus('timeout');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user, paymentId, router]);

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
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

  if (status === 'timeout') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Taking Longer Than Expected</h1>
          <p className="text-neutral-400 mb-4">
            Your payment is still being processed. This can sometimes take a few minutes.
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            If you completed payment, your credits will be added automatically. Check your account or contact support if needed.
          </p>
          <div className="space-y-3">
            <Button
              onClick={checkPaymentStatus}
              disabled={isChecking}
              className="w-full bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Status
                </>
              )}
            </Button>
            <Link
              href="/account"
              className="block w-full px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition-colors text-center"
            >
              Go to Account
            </Link>
          </div>
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
        <h1 className="text-3xl font-bold text-white mb-4">Verifying Payment</h1>
        <p className="text-neutral-400 mb-2">
          Please wait while we confirm your payment...
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          This usually takes just a few seconds.
        </p>
        {secondsElapsed > 10 && (
          <Button
            onClick={checkPaymentStatus}
            disabled={isChecking}
            variant="outline"
            className="mt-4"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Status
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
