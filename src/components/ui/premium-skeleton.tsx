"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "video" | "button";
  animate?: boolean;
}

// Premium skeleton with shimmer effect
export function PremiumSkeleton({
  className,
  variant = "default",
  animate = true,
}: PremiumSkeletonProps) {
  const baseClasses = "relative overflow-hidden bg-neutral-800/50 rounded-md";

  const variantClasses = {
    default: "",
    card: "rounded-2xl",
    text: "h-4 rounded",
    avatar: "rounded-full",
    video: "rounded-2xl aspect-video",
    button: "h-10 rounded-lg",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {animate && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}

// Video card skeleton
export function VideoCardSkeleton() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="aspect-square relative">
          <PremiumSkeleton className="absolute inset-0" variant="card" />
          {/* Play button placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PremiumSkeleton className="w-12 h-12" variant="avatar" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <PremiumSkeleton className="h-5 w-3/4" variant="text" />
          <div className="flex items-center gap-2">
            <PremiumSkeleton className="h-6 w-16" variant="text" />
            <PremiumSkeleton className="h-4 w-12" variant="text" />
          </div>
          <div className="flex gap-2">
            <PremiumSkeleton className="h-6 w-16 rounded-full" />
            <PremiumSkeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// History card skeleton
export function HistoryCardSkeleton() {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="aspect-square relative">
          <PremiumSkeleton className="absolute inset-0" variant="card" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <PremiumSkeleton className="h-4 w-full" variant="text" />
          <PremiumSkeleton className="h-4 w-2/3" variant="text" />
          <PremiumSkeleton className="h-3 w-24" variant="text" />
        </div>
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <PremiumSkeleton className="h-4 w-24" variant="text" />
        <PremiumSkeleton className="h-5 w-5" variant="avatar" />
      </div>
      <PremiumSkeleton className="h-8 w-32 mb-2" variant="text" />
      <PremiumSkeleton className="h-3 w-20" variant="text" />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <PremiumSkeleton className="h-10 w-10" variant="avatar" />
        <div className="space-y-2">
          <PremiumSkeleton className="h-4 w-32" variant="text" />
          <PremiumSkeleton className="h-3 w-24" variant="text" />
        </div>
      </div>
      <PremiumSkeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

// Full page loader
export function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-neutral-800 border-t-[#D4FF4F] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-neutral-800 border-b-[#D4FF4F]/50 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="relative h-full w-full bg-neutral-900">
      <PremiumSkeleton className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="container mx-auto relative z-10 px-4 h-full flex items-center">
        <div className="max-w-4xl space-y-6">
          <PremiumSkeleton className="h-20 w-3/4" variant="text" />
          <PremiumSkeleton className="h-20 w-1/2" variant="text" />
          <PremiumSkeleton className="h-6 w-96" variant="text" />
          <PremiumSkeleton className="h-12 w-40" variant="button" />
        </div>
      </div>
    </div>
  );
}

// Section skeleton for homepage
export function SectionSkeleton() {
  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      <div className="container mx-auto h-full flex flex-col justify-center px-4">
        <PremiumSkeleton className="h-24 w-48 mb-8" variant="text" />
        <PremiumSkeleton className="h-6 w-96 mb-4" variant="text" />
        <PremiumSkeleton className="h-6 w-64" variant="text" />
        <div className="mt-12 w-full max-w-2xl aspect-video">
          <PremiumSkeleton className="w-full h-full" variant="video" />
        </div>
      </div>
    </div>
  );
}

// Create product page skeleton
export function CreateProductSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        {/* Back button skeleton */}
        <PremiumSkeleton className="h-6 w-32 mb-8" variant="text" />

        <div className="max-w-4xl mx-auto">
          {/* Title skeleton */}
          <PremiumSkeleton className="h-12 w-64 mb-2" variant="text" />
          <PremiumSkeleton className="h-5 w-96 mb-12" variant="text" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video preview skeleton */}
            <div>
              <PremiumSkeleton className="h-4 w-16 mb-4" variant="text" />
              <PremiumSkeleton className="aspect-square w-full rounded-2xl mb-6" variant="card" />
              <PremiumSkeleton className="h-24 w-full rounded-lg" variant="card" />
            </div>

            {/* Form skeleton */}
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <PremiumSkeleton className="h-4 w-24 mb-2" variant="text" />
                  <PremiumSkeleton className="h-10 w-full rounded-lg" variant="button" />
                </div>
              ))}
              <PremiumSkeleton className="h-12 w-full rounded-lg" variant="button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generator page skeleton
export function GeneratorSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <PremiumSkeleton className="h-10 w-48 mb-4" variant="text" />
          <PremiumSkeleton className="h-5 w-96 mb-8" variant="text" />

          {/* Model selector */}
          <div className="flex gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <PremiumSkeleton key={i} className="h-24 w-32 rounded-xl" variant="card" />
            ))}
          </div>

          {/* Input area */}
          <PremiumSkeleton className="h-32 w-full rounded-xl mb-6" variant="card" />

          {/* Generate button */}
          <PremiumSkeleton className="h-14 w-full rounded-xl" variant="button" />
        </div>
      </div>
    </div>
  );
}

// Form skeleton for auth pages
export function AuthFormSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <PremiumSkeleton className="h-10 w-48 mx-auto mb-4" variant="text" />
          <PremiumSkeleton className="h-5 w-64 mx-auto" variant="text" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <PremiumSkeleton className="h-4 w-20 mb-2" variant="text" />
              <PremiumSkeleton className="h-12 w-full rounded-lg" variant="button" />
            </div>
          ))}
          <PremiumSkeleton className="h-12 w-full rounded-lg mt-6" variant="button" />
        </div>
      </div>
    </div>
  );
}
