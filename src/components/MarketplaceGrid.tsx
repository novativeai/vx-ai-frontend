"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MarketplaceProduct } from "@/types/types";
import { Play, Loader2 } from "lucide-react";

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  onProductClick: (product: MarketplaceProduct) => void;
  initialDisplayCount?: number;
}

// Check if a URL points to a video file rather than an image
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Check if a URL is a Firebase Storage image thumbnail (not a video)
const isStaticThumbnail = (url?: string): boolean => {
  if (!url) return false;
  // Firebase Storage download URLs with tokens are static images
  if (url.includes("firebasestorage.googleapis.com") && url.includes("token="))
    return true;
  if (url.includes("storage.googleapis.com") && !isVideoUrl(url)) return true;
  // Any non-video URL is a valid static thumbnail
  return !isVideoUrl(url);
};

// Memoized product card for better performance
const ProductCard = memo(function ProductCard({
  product,
  onProductClick,
}: {
  product: MarketplaceProduct;
  onProductClick: (product: MarketplaceProduct) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [fallbackPoster, setFallbackPoster] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine if we have a real static thumbnail (image, not video URL)
  const hasStaticThumb = isStaticThumbnail(product.thumbnailUrl);
  const posterUrl = hasStaticThumb ? product.thumbnailUrl : fallbackPoster;

  // Only generate a fallback poster if no static thumbnail exists
  // This runs once per card for legacy listings that lack a real thumbnail
  useEffect(() => {
    if (hasStaticThumb || fallbackPoster || posterLoading) return;

    setPosterLoading(true);

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    // Only load metadata — much lighter than full video download
    video.preload = "metadata";
    video.src = product.videoUrl;

    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("error", handleError);
      video.remove();
    };

    const handleSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          if (dataUrl.length > 3000) {
            setFallbackPoster(dataUrl);
          }
        }
      } catch {
        // CORS failure — expected for fal.ai URLs
      }
      setPosterLoading(false);
      cleanup();
    };

    const handleMetadata = () => {
      video.currentTime = Math.min(0.5, video.duration * 0.1);
    };

    const handleError = () => {
      setPosterLoading(false);
      cleanup();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);
    video.load();

    // Timeout: abort after 5s to avoid lingering downloads
    const timeout = setTimeout(() => {
      setPosterLoading(false);
      cleanup();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, [product.videoUrl, hasStaticThumb, fallbackPoster, posterLoading]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowVideo(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <button
      onClick={() => onProductClick(product)}
      className="group text-left w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0">
        {/* Fixed square aspect ratio, video fills completely */}
        <div className="bg-neutral-800 relative overflow-hidden aspect-square">
          {/* Loading indicator while poster loads (only for legacy items) */}
          {!posterUrl && !showVideo && posterLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-600" />
            </div>
          )}

          {/* Thumbnail/Poster shown by default */}
          {posterUrl && !isHovered && (
            <Image
              src={posterUrl}
              alt={product.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
              unoptimized={posterUrl.startsWith("data:")}
            />
          )}

          {/* Video loads on hover — preload="none" so it doesn't download until hovered */}
          {showVideo && (
            <video
              ref={videoRef}
              src={product.videoUrl}
              muted
              loop
              playsInline
              preload="auto"
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Fallback background when no poster at all */}
          {!posterUrl && !showVideo && !posterLoading && (
            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
              <Play size={32} className="text-neutral-600" />
            </div>
          )}

          {/* Play Icon on Hover with smooth animation */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-[#D4FF4F] rounded-full p-3 transform transition-transform duration-300 scale-90 group-hover:scale-100">
              <Play size={24} className="fill-black text-black" />
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-medium text-[#D4FF4F]">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-neutral-500">
              {product.sold} sold
            </span>
          </div>

          {/* Tags - Premium Style */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block text-[10px] uppercase tracking-wider text-neutral-400 px-2.5 py-1 rounded border border-neutral-700/60 bg-neutral-900/80"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="inline-block text-[10px] text-neutral-600 uppercase tracking-wider self-center">
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Card>
    </button>
  );
});

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  products,
  isLoading,
  onProductClick,
  initialDisplayCount = 12,
}) => {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  // Reset display count when products change (e.g., filter applied)
  useEffect(() => {
    setDisplayCount(initialDisplayCount);
  }, [products.length, initialDisplayCount]);

  const displayedProducts = products.slice(0, displayCount);
  const hasMoreProducts = displayCount < products.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + initialDisplayCount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-800 rounded-2xl animate-pulse aspect-square"
          >
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-600" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-neutral-400 text-lg">No videos found</p>
          <p className="text-neutral-600 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Standard CSS Grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 border border-neutral-700 rounded-full bg-transparent hover:bg-neutral-900 hover:border-neutral-600 transition-all duration-300"
          >
            <span className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
              Load More
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
