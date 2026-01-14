"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DollarSign, Play } from "lucide-react";
import { memo, useState, useRef, useCallback } from "react";
import { PremiumSkeleton } from "@/components/ui/premium-skeleton";

interface Generation {
  id: string;
  outputUrl: string;
  outputType: 'video' | 'image';
  prompt: string;
  createdAt: {
    toDate: () => Date;
  };
}

interface HistoryCardProps {
  item: Generation;
}

export const HistoryCard: React.FC<HistoryCardProps> = memo(function HistoryCard({ item }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current && item.outputType === 'video') {
      videoRef.current.play().catch(() => {});
    }
  }, [item.outputType]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current && item.outputType === 'video') {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [item.outputType]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-80 flex-shrink-0">
      <Card
        className="overflow-hidden rounded-2xl relative group transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/10 hover:scale-[1.02]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AspectRatio ratio={1 / 1} className="bg-neutral-800">
          {/* Loading skeleton */}
          {isLoading && (
            <PremiumSkeleton className="absolute inset-0 z-10" />
          )}

          {item.outputType === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={item.outputUrl}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={handleLoadComplete}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              />
              {/* Play indicator on hover */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-[#D4FF4F]/90 rounded-full p-3 backdrop-blur-sm">
                  <Play size={24} className="fill-black text-black" />
                </div>
              </div>
            </>
          ) : (
            <Image
              src={item.outputUrl}
              alt={item.prompt || "Generated image"}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleLoadComplete}
              sizes="320px"
              loading="lazy"
            />
          )}
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-4 text-white flex-1 pr-16">
          <p className="font-medium line-clamp-2">{item.prompt}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {item.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Monetize Button - Right Bottom Corner */}
        <Link href={`/marketplace/create?generationId=${item.id}`}>
          <button className="absolute bottom-4 right-4 bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black rounded-full p-2.5 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl transform group-hover:scale-110">
            <DollarSign size={18} className="font-bold" />
          </button>
        </Link>
      </Card>
    </div>
  );
});
