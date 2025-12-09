"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MarketplaceProduct } from "@/types/types";
import { Play } from "lucide-react";
import { VideoCardSkeleton } from "@/components/ui/premium-skeleton";

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  onProductClick: (product: MarketplaceProduct) => void;
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
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
      <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02]">
        <AspectRatio ratio={1 / 1} className="bg-neutral-800 relative">
          {/* Optimized Video with lazy loading */}
          <video
            ref={videoRef}
            src={product.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />

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
          <h3 className="font-semibold text-white line-clamp-1">{product.title}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-[#D4FF4F]">€{product.price.toFixed(2)}</span>
            <span className="text-xs text-neutral-400">{product.sold} sold</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="inline-block text-xs bg-neutral-800/80 text-neutral-200 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="inline-block text-xs text-neutral-400">+{product.tags.length - 2}</span>
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
}) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};
