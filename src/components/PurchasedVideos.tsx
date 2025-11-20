"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

interface PurchasedVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  price: number;
  sellerName: string;
  purchasedAt: {
    toDate: () => Date;
  };
}

export function PurchasedVideos() {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState<PurchasedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "purchased_videos"),
      orderBy("purchasedAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setPurchased(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as PurchasedVideo))
      );
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-semibold text-lg">Purchased Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Card className="overflow-hidden rounded-2xl bg-transparent">
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="w-full h-full bg-[#1C1C1C]" />
                </AspectRatio>
              </Card>
              <Skeleton className="h-4 bg-[#1C1C1C] w-3/4" />
              <Skeleton className="h-3 bg-[#1C1C1C] w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (purchased.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-semibold text-lg">Purchased Videos</h2>
        <Card className="bg-[#1C1C1C] border-neutral-800 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
          <p className="text-neutral-400 mb-2">No purchased videos yet</p>
          <p className="text-sm text-neutral-500">
            Browse the marketplace to purchase videos
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Purchased Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchased.map((video) => (
          <div key={video.id} className="group cursor-pointer">
            <Card className="overflow-hidden rounded-2xl border-neutral-800 hover:border-neutral-700 transition-colors">
              <AspectRatio ratio={16 / 9} className="bg-neutral-800 relative">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                  />
                ) : video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </AspectRatio>
            </Card>
            <div className="mt-3">
              <h3 className="font-medium text-white line-clamp-2 text-sm">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                by {video.sellerName}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold text-[#D4FF4F]">
                  €{video.price.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500">
                  {video.purchasedAt?.toDate().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
