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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if thumbnailUrl is actually an image (not a video URL)
  // Video URLs should be ignored so we can generate a proper poster
  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const validThumbnailUrl = product.thumbnailUrl && !isVideoUrl(product.thumbnailUrl)
    ? product.thumbnailUrl
    : null;

  // Extract aspect ratio and generate poster from video
  useEffect(() => {
    if (aspectRatio) return; // Already have aspect ratio

    const video = document.createElement("video");
    // Don't set crossOrigin for metadata - it can cause CORS issues
    video.src = product.videoUrl;
    video.muted = true;
    video.preload = "metadata";

    const handleLoadedMetadata = () => {
      // Extract aspect ratio from video dimensions
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }

      // Try to generate poster (may fail due to CORS, that's ok)
      if (!generatedPoster && !validThumbnailUrl) {
        video.currentTime = 0.1;
      } else {
        video.remove();
      }
    };

    const handleSeeked = () => {
      try {
        // Try with crossOrigin for canvas (may fail)
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
        // CORS error - poster generation failed, but we still have aspect ratio
      }
      video.remove();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.remove();
    };
  }, [product.videoUrl, generatedPoster, aspectRatio, validThumbnailUrl]);

  // Also get aspect ratio from the actual hover video element as backup
  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current && !aspectRatio) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (videoWidth && videoHeight) {
        setAspectRatio(videoWidth / videoHeight);
      }
    }
  }, [aspectRatio]);

  const posterUrl = validThumbnailUrl || generatedPoster;

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

  // Convert numeric aspect ratio to CSS-friendly format
  const getAspectRatioStyle = (): string => {
    if (!aspectRatio) return '1 / 1'; // Default to square while loading
    // Classify: portrait (<0.9), square (0.9-1.1), landscape (>1.1)
    if (aspectRatio < 0.9) return '9 / 16';      // Portrait
    if (aspectRatio > 1.1) return '16 / 9';      // Landscape
    return '1 / 1';                               // Square
  };

  return (
    <div
      className="mb-4"
      style={{ breakInside: 'avoid' }}
    >
      <button
        onClick={() => onProductClick(product)}
        className="group text-left w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0">
          {/* Container adapts to video aspect ratio */}
          <div
            className="bg-neutral-800 relative overflow-hidden"
            style={{ aspectRatio: getAspectRatioStyle() }}
          >
          {/* Loading indicator while video metadata loads */}
          {!aspectRatio && !posterUrl && (
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
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
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
              onLoadedMetadata={handleVideoMetadata}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Fallback background when no poster */}
          {!posterUrl && !showVideo && aspectRatio && (
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
  </div>
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
    // Masonry loading skeleton with varied aspect ratios
    const skeletonAspects = ['1/1', '9/16', '16/9', '1/1', '16/9', '9/16', '1/1', '16/9'];
    return (
      <div
        className="columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4"
        style={{ columnFill: 'balance' }}
      >
        {skeletonAspects.map((aspect, i) => (
          <div
            key={i}
            className="mb-4 bg-neutral-800 rounded-2xl animate-pulse"
            style={{ aspectRatio: aspect, breakInside: 'avoid' }}
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
          <p className="text-neutral-600 text-sm mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Masonry layout using CSS columns */}
      <div
        className="columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4"
        style={{ columnFill: 'balance' }}
      >
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
