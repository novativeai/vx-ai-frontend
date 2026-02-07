"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("payment_id");
  const subscriptionId = searchParams.get("subscription_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [credits, setCredits] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function confirmPayment() {
      // Need either a payment_id or subscription_id
      if (!user || (!paymentId && !subscriptionId)) {
        router.push("/pricing");
        return;
      }

      try {
        const token = await user.getIdToken();

        if (paymentId) {
          // One-time credit purchase confirmation
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
          } else {
            setStatus("error");
            setErrorMessage(data.detail || data.message || "Failed to confirm payment");
          }
        } else if (subscriptionId) {
          // Subscription confirmation — webhook handles credit granting,
          // we just show success since PayTrust redirected here after payment
          setIsSubscription(true);
          setStatus("success");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Failed to verify payment. Please check your account.");
      }
    }

    confirmPayment();
  }, [user, paymentId, subscriptionId, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">Confirming your payment...</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="inline-block px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90"
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
