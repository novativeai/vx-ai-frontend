"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, Download, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PurchaseDetails {
  id: string;
  status: string;
  title: string;
  price: number;
  videoUrl: string | null;
}

type PageState = "loading" | "confirming" | "success" | "pending" | "error";

export default function MarketplacePurchaseSuccessPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const purchaseId = searchParams.get("purchase_id");

  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const confirmPurchase = useCallback(async () => {
    if (!user || !purchaseId) return;

    setPageState("confirming");
    setError(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/confirm-purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ purchaseId }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "completed") {
        setPurchase({
          id: purchaseId,
          status: data.status,
          title: data.title,
          price: data.price,
          videoUrl: data.videoUrl,
        });
        setPageState("success");
      } else if (response.ok && data.status === "pending") {
        // Payment webhook hasn't arrived yet - show pending state
        setPageState("pending");
      } else {
        // Check if it's a timing issue (payment not yet processed)
        const errorMsg = data.detail || data.message || "Failed to confirm purchase";
        if (errorMsg.toLowerCase().includes("pending") || errorMsg.toLowerCase().includes("processing")) {
          setPageState("pending");
        } else {
          setError(errorMsg);
          setPageState("error");
        }
      }
    } catch (err) {
      logger.error("Error confirming purchase", err);
      setError("Unable to verify purchase. Please try again.");
      setPageState("error");
    }
  }, [user, purchaseId]);

  // Initial confirmation attempt
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // If no user after auth loads, redirect to signin
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/marketplace/purchase/success?purchase_id=${purchaseId}`);
      return;
    }

    // If no purchase ID, redirect to marketplace
    if (!purchaseId) {
      router.push("/marketplace");
      return;
    }

    // Attempt to confirm the purchase
    confirmPurchase();
  }, [authLoading, user, purchaseId, router, confirmPurchase]);

  // Auto-retry for pending state (webhook may still be processing)
  useEffect(() => {
    if (pageState === "pending" && retryCount < maxRetries) {
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        confirmPurchase();
      }, 3000); // Retry every 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [pageState, retryCount, confirmPurchase]);

  const handleRetry = () => {
    setRetryCount(0);
    confirmPurchase();
  };

  // Loading state (auth loading)
  if (authLoading || pageState === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  // Confirming state
  if (pageState === "confirming") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">Confirming your purchase...</p>
      </div>
    );
  }

  // Pending state (payment processing)
  if (pageState === "pending") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Processing</h1>
          <p className="text-neutral-400 mb-2">
            Your payment is being processed. This usually takes a few seconds.
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            {retryCount < maxRetries
              ? `Checking status... (${retryCount + 1}/${maxRetries + 1})`
              : "Still processing. You can wait or check your purchases later."}
          </p>

          <div className="space-y-4">
            {retryCount >= maxRetries && (
              <Button
                onClick={handleRetry}
                className="w-full bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            )}
            <Link href="/account?tab=purchased" className="block">
              <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:text-white">
                Go to My Purchases
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
          <p className="text-neutral-400 mb-8">{error}</p>

          <div className="space-y-4">
            <Button
              onClick={handleRetry}
              className="w-full bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/account?tab=purchased" className="block">
              <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:text-white">
                Check My Purchases
              </Button>
            </Link>
            <Link href="/marketplace" className="block">
              <Button variant="ghost" className="w-full text-neutral-500 hover:text-white">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (pageState === "success" && purchase) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#D4FF4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#D4FF4F]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Successful!</h1>
          <p className="text-neutral-400 mb-2">
            You now own <span className="text-white font-semibold">{purchase.title}</span>
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            The video is now available in your purchases.
          </p>

          <div className="space-y-4">
            {purchase.videoUrl && (
              <a
                href={purchase.videoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4FF4F] text-black rounded-lg font-semibold hover:bg-[#D4FF4F]/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Video
              </a>
            )}

            <Link
              href="/account?tab=purchased"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition-colors"
            >
              View My Purchases
            </Link>

            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-neutral-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
