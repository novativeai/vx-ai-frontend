"use client";

import { PremiumSkeleton, StatsCardSkeleton, TableRowSkeleton } from "@/components/ui/premium-skeleton";

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-black pt-32">
      <div className="container mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="flex items-center gap-6 mb-16">
          <PremiumSkeleton className="w-24 h-24" variant="avatar" />
          <div className="space-y-3">
            <PremiumSkeleton className="h-16 w-64" variant="text" />
            <PremiumSkeleton className="h-4 w-48" variant="text" />
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="flex gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <PremiumSkeleton key={i} className="h-10 w-24" variant="button" />
          ))}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <div>
            <PremiumSkeleton className="h-64 w-full rounded-xl" variant="card" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="mt-12 space-y-1">
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
