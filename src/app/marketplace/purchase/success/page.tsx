"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, Download, ShoppingBag } from "lucide-react";
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

export default function MarketplacePurchaseSuccessPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const purchaseId = searchParams.get("purchase_id");

  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function verifyPurchase() {
      if (!user || !purchaseId) {
        router.push("/marketplace");
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/purchase/${purchaseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch purchase details");
        }

        const data = await response.json();

        if (data.status === "completed") {
          setPurchase(data);
          setLoading(false);
        } else if (data.status === "pending" && retryCount < 10) {
          // Payment webhook might not have processed yet, retry
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        } else {
          setError("Purchase is still being processed. Please check back later.");
          setLoading(false);
        }
      } catch (err) {
        logger.error("Error verifying purchase", err);
        setError("Unable to verify purchase. Please contact support.");
        setLoading(false);
      }
    }

    verifyPurchase();
  }, [user, purchaseId, router, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F] mb-4" />
        <p className="text-neutral-400">Verifying your purchase...</p>
        {retryCount > 0 && (
          <p className="text-sm text-neutral-500 mt-2">
            Processing payment... ({retryCount}/10)
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Processing...</h1>
          <p className="text-neutral-400 mb-8">{error}</p>
          <Link href="/marketplace">
            <Button variant="brand-solid">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return null;
  }

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
            href="/marketplace"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
