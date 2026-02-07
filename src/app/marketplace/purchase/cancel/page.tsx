"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingBag, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function MarketplacePurchaseCancelContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchase_id");
  const [isUpdating, setIsUpdating] = useState(true);

  // Cancel purchase via backend API (not client-side Firestore)
  useEffect(() => {
    async function cancelPurchase() {
      if (!user || !purchaseId) {
        setIsUpdating(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/cancel-purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ purchaseId }),
          }
        );
      } catch {
        // Cancel is best-effort — purchase might not exist or already updated
      } finally {
        setIsUpdating(false);
      }
    }

    cancelPurchase();
  }, [user, purchaseId]);

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-12 h-12 text-yellow-500" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Purchase Canceled</h1>
      <p className="text-neutral-400 max-w-md mb-2">
        Your transaction was not completed. You have not been charged.
      </p>
      <p className="text-sm text-neutral-500 max-w-md mb-8">
        The video is still available for purchase if you change your mind.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/marketplace">
          <Button variant="brand-solid" className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Back to Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function MarketplacePurchaseCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
      }
    >
      <MarketplacePurchaseCancelContent />
    </Suspense>
  );
}
