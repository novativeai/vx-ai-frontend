"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Trash2, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { apiClient } from "@/lib/apiClient";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import { MarketplaceProduct } from "@/types/types";

export function ListingsManager() {
  const { user } = useAuth();
  const [listings, setListings] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "marketplace_items"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setListings(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MarketplaceProduct)),
        );
        setIsLoading(false);
      },
      (error) => {
        logger.error("Failed to load listings", error);
        setIsLoading(false);
      },
    );
    return () => unsub();
  }, [user]);

  const handleDelete = async (item: MarketplaceProduct) => {
    if (deletingId) return;
    const confirmed = window.confirm(
      `Remove "${item.title}" from the marketplace? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      await apiClient.deleteListing(item.id);
      // onSnapshot will remove it from the list automatically.
      toast.success("Listing removed", "Your video has been removed from the marketplace.");
    } catch (err) {
      logger.error("Failed to delete listing", err);
      toast.error(
        "Delete failed",
        err instanceof Error ? err.message : "Could not remove the listing. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="font-semibold text-lg mb-1">My Listings</h2>
        <p className="text-sm text-neutral-400 mb-4">Manage the videos you&apos;ve listed for sale.</p>
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Card key={i} className="bg-[#1C1C1C] border-neutral-800 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div>
        <h2 className="font-semibold text-lg mb-1">My Listings</h2>
        <p className="text-sm text-neutral-400 mb-4">Manage the videos you&apos;ve listed for sale.</p>
        <Card className="bg-[#1C1C1C] border-neutral-800 p-8 text-center">
          <Store className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">
            You haven&apos;t listed any videos yet. Open a video in your{" "}
            <Link href="/account?tab=history" className="text-[#D4FF4F] hover:underline">History</Link>{" "}
            and click <span className="text-white">Sell</span> to list it.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-1">My Listings</h2>
      <p className="text-sm text-neutral-400 mb-4">Manage the videos you&apos;ve listed for sale.</p>
      <div className="space-y-3">
        {listings.map((item) => (
          <Card
            key={item.id}
            className="bg-[#1C1C1C] border-neutral-800 p-3 flex items-center gap-4"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={item.thumbnailUrl.startsWith("data:")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="w-5 h-5 text-neutral-600" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#D4FF4F] font-semibold text-sm">€{item.price}</span>
                <Badge
                  variant="secondary"
                  className={
                    item.status === "published"
                      ? "bg-green-600/20 text-green-400 border-green-600/30"
                      : "bg-neutral-700 text-neutral-300"
                  }
                >
                  {item.status === "published" ? "Live" : item.status}
                </Badge>
                {typeof item.sold === "number" && item.sold > 0 && (
                  <span className="text-xs text-neutral-500">{item.sold} sold</span>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(item)}
              disabled={deletingId === item.id}
              className="border-red-900/50 bg-transparent text-red-400 hover:bg-red-950/40 hover:text-red-300 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {deletingId === item.id ? "Removing…" : "Remove"}
              </span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
