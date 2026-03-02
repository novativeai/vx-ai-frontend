"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("payment_id");
  const subscriptionId = searchParams.get("subscription_id");

  const [status, setStatus] = useState<"loading" | "confirming" | "success" | "retrying" | "error">("loading");
  const [credits, setCredits] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const confirmPayment = useCallback(async () => {
    if (!user || (!paymentId && !subscriptionId)) return;

    setStatus("confirming");
    setErrorMessage("");

    try {
      const token = await user.getIdToken();

      if (paymentId) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ paymentId }),
          }
        );

        const data = await response.json();

        if (response.ok && (data.status === "paid" || data.already_processed)) {
          setStatus("success");
          setCredits(data.credits || 0);
        } else if (response.status === 503) {
          // Verification temporarily unavailable — retry
          setStatus("retrying");
        } else {
          setStatus("error");
          setErrorMessage(data.detail || data.message || "Failed to confirm payment");
        }
      } else if (subscriptionId) {
        setIsSubscription(true);
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to verify payment. Please check your account.");
    }
  }, [user, paymentId, subscriptionId]);

  // Initial confirmation
  useEffect(() => {
    if (authLoading) return;

    if (!authLoading && !user) {
      router.push("/pricing");
      return;
    }

    if (!paymentId && !subscriptionId) {
      router.push("/pricing");
      return;
    }

    confirmPayment();
  }, [authLoading, user, paymentId, subscriptionId, router, confirmPayment]);

  // Auto-retry on 503 (verification temporarily unavailable)
  useEffect(() => {
    if (status === "retrying" && retryCount < maxRetries) {
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        confirmPayment();
      }, 3000);
      return () => clearTimeout(timeout);
    } else if (status === "retrying" && retryCount >= maxRetries) {
      setStatus("error");
      setErrorMessage("Unable to verify payment status. If you completed the payment, your credits will appear shortly via automatic processing.");
    }
  }, [status, retryCount, confirmPayment]);

  const handleRetry = () => {
    setRetryCount(0);
    confirmPayment();
  };

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (status === "confirming" || status === "retrying") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">
          {status === "retrying"
            ? `Verifying payment... (${retryCount + 1}/${maxRetries + 1})`
            : "Confirming your payment..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Verification Issue</h1>
          <p className="text-neutral-400 mb-2">{errorMessage}</p>
          <p className="text-sm text-neutral-500 mb-8">
            If you completed the payment, your credits should appear in your account shortly.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Button
              onClick={handleRetry}
              className="w-full max-w-xs bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90 font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account"
                className="inline-block px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700"
              >
                Check Account
              </Link>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700"
              >
                Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#D4FF4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-[#D4FF4F]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        {isSubscription ? (
          <>
            <p className="text-neutral-400 mb-2">
              Your subscription has been activated successfully.
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              Credits have been added to your account. You can start generating videos right away.
            </p>
          </>
        ) : (
          <>
            <p className="text-neutral-400 mb-2">
              {credits} credits have been added to your account.
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              You can start generating videos right away.
            </p>
          </>
        )}
        <Link
          href="/explore"
          className="inline-block px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90"
        >
          Start Creating
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
