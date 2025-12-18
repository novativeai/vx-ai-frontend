"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MarketplaceProduct } from "@/types/types";
import { Play } from "lucide-react";
import { VideoCardSkeleton, PremiumSkeleton } from "@/components/ui/premium-skeleton";

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  onProductClick: (product: MarketplaceProduct) => void;
  initialDisplayCount?: number;
}

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
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generate poster from first frame if no thumbnailUrl provided
  useEffect(() => {
    if (product.thumbnailUrl || generatedPoster) return;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = product.videoUrl;
    video.muted = true;
    video.preload = "metadata";

    const handleLoadedData = () => {
      video.currentTime = 0.1; // Seek to 0.1s to get first frame
    };

    const handleSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setGeneratedPoster(dataUrl);
        }
      } catch {
        // CORS or other error - fallback to no poster
      }
      video.remove();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.remove();
    };
  }, [product.videoUrl, product.thumbnailUrl, generatedPoster]);

  // Fallback timeout to hide skeleton after 5s max (prevents stuck state)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsImageLoaded(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const posterUrl = product.thumbnailUrl || generatedPoster;

  // Mark as loaded when poster becomes available (for generated posters)
  useEffect(() => {
    if (generatedPoster) {
      setIsImageLoaded(true);
    }
  }, [generatedPoster]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowVideo(true);
    // Small delay to allow video element to mount before playing
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
    // Keep video mounted for faster subsequent hovers
  }, []);

  return (
    <button
      onClick={() => onProductClick(product)}
      className="group text-left w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0">
        <AspectRatio ratio={1 / 1} className="bg-neutral-800 relative">
          {/* Loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 z-10 transition-opacity duration-300">
              <PremiumSkeleton className="w-full h-full" variant="card" />
            </div>
          )}

          {/* Thumbnail/Poster shown by default */}
          {posterUrl && !isHovered && (
            <Image
              src={posterUrl}
              alt={product.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}

          {/* Video loads on hover */}
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

          {/* Fallback background when no poster (only show after skeleton timeout) */}
          {!posterUrl && !showVideo && isImageLoaded && (
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
        </AspectRatio>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white line-clamp-1">{product.title}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-medium text-[#D4FF4F]">€{product.price.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-500">{product.sold} sold</span>
          </div>

          {/* Tags - Premium Style */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="inline-block text-[10px] uppercase tracking-wider text-neutral-400 px-2.5 py-1 rounded border border-neutral-700/60 bg-neutral-900/80"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="inline-block text-[10px] text-neutral-600 uppercase tracking-wider self-center">+{product.tags.length - 2}</span>
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
    setDisplayCount(prev => prev + initialDisplayCount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-neutral-400 text-lg">No videos found</p>
          <p className="text-neutral-600 text-sm mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map(product => (
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
