"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MarketplaceProduct } from "@/types/types";
import { Play } from "lucide-react";

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  onProductClick: (product: MarketplaceProduct) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  products,
  isLoading,
  onProductClick,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const videoRefsMap = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleMouseEnter = (productId: string) => {
    setHoveredId(productId);
    const video = videoRefsMap.current[productId];
    if (video) {
      video.play().catch(() => {
        // Autoplay prevented by browser, ignore
      });
    }
  };

  const handleMouseLeave = (productId: string) => {
    setHoveredId(null);
    const video = videoRefsMap.current[productId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-2xl bg-neutral-900">
            <AspectRatio ratio={1 / 1}>
              <div className="w-full h-full bg-neutral-800 animate-pulse" />
            </AspectRatio>
          </Card>
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
        <button
          key={product.id}
          onClick={() => onProductClick(product)}
          className="group text-left"
        >
          <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all hover:shadow-2xl hover:shadow-[#D4FF4F]/20">
            <AspectRatio ratio={1 / 1} className="bg-neutral-800 relative">
              {/* Video */}
              <video
                ref={el => {
                  if (el) videoRefsMap.current[product.id] = el;
                }}
                src={product.videoUrl}
                muted
                loop
                className="w-full h-full object-cover"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={() => handleMouseLeave(product.id)}
              />

              {/* Play Icon on Hover */}
              {hoveredId === product.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-[#D4FF4F] rounded-full p-3">
                    <Play size={24} className="fill-black text-black" />
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
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
      ))}
    </div>
  );
};
