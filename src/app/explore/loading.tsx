"use client";

import { PremiumSkeleton, VideoCardSkeleton } from "@/components/ui/premium-skeleton";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-black pt-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <PremiumSkeleton className="h-16 w-64 mb-4" variant="text" />
          <PremiumSkeleton className="h-5 w-96" variant="text" />
        </div>

        {/* Model cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
              <PremiumSkeleton className="aspect-video w-full" />
              <div className="p-4 space-y-3">
                <PremiumSkeleton className="h-6 w-3/4" variant="text" />
                <PremiumSkeleton className="h-4 w-full" variant="text" />
                <div className="flex gap-2">
                  <PremiumSkeleton className="h-6 w-16 rounded-full" />
                  <PremiumSkeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent generations header */}
        <div className="mb-8">
          <PremiumSkeleton className="h-8 w-48 mb-4" variant="text" />
        </div>

        {/* History grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
