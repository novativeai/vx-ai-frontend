"use client";

import { ProductGridSkeleton, PremiumSkeleton } from "@/components/ui/premium-skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-black pt-32">
      <div className="container mx-auto px-4">
        {/* Banner skeleton */}
        <PremiumSkeleton className="w-full h-64 rounded-2xl mb-8" variant="card" />

        {/* Tags filter skeleton */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <PremiumSkeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
