"use client";

import { PremiumSkeleton } from "@/components/ui/premium-skeleton";

export default function GeneratorLoading() {
  return (
    <div className="min-h-screen bg-black pt-32">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Form skeleton */}
          <div className="space-y-6">
            <PremiumSkeleton className="h-12 w-48" variant="text" />
            <PremiumSkeleton className="h-32 w-full rounded-xl" variant="card" />
            <div className="space-y-4">
              <PremiumSkeleton className="h-10 w-full" variant="button" />
              <PremiumSkeleton className="h-10 w-full" variant="button" />
              <PremiumSkeleton className="h-10 w-full" variant="button" />
            </div>
            <PremiumSkeleton className="h-14 w-full rounded-xl" variant="button" />
          </div>

          {/* Right side - Preview skeleton */}
          <div className="space-y-4">
            <PremiumSkeleton className="aspect-video w-full rounded-2xl" variant="video" />
            <div className="flex gap-3">
              <PremiumSkeleton className="h-10 w-24" variant="button" />
              <PremiumSkeleton className="h-10 w-24" variant="button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
