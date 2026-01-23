"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { DollarSign, Play } from "lucide-react";
import { memo, useState, useRef, useCallback, useEffect } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
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

  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (videoWidth && videoHeight) {
        setAspectRatio(videoWidth / videoHeight);
      }
    }
  }, []);

  // Check if video is already loaded on mount (handles cached videos)
  useEffect(() => {
    if (item.outputType === 'video' && videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        handleVideoMetadata();
      }
    }
  }, [item.outputType, handleVideoMetadata]);

  return (
    <div className="w-80 flex-shrink-0">
      <Card
        className="overflow-hidden rounded-2xl relative group transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/10 hover:scale-[1.02]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Container adapts to video aspect ratio - no fixed ratio, video fills completely */}
        <div
          className="bg-neutral-900 relative overflow-hidden"
          style={{ aspectRatio: aspectRatio ? `${aspectRatio}` : '16/9' }}
        >
          {item.outputType === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={item.outputUrl}
                muted
                loop
                playsInline
                preload="auto"
                onLoadedMetadata={handleVideoMetadata}
                className="w-full h-full object-cover"
              />
              {/* Play indicator on hover */}
              <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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
              className="object-cover"
              sizes="320px"
              loading="lazy"
            />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-20" />

        {/* Title text */}
        <div className="absolute bottom-0 left-0 p-4 text-white flex-1 pr-16 z-30">
          <p className="font-medium line-clamp-2">{item.prompt}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {item.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Monetize Button */}
        <Link href={`/marketplace/create?generationId=${item.id}`} className="z-30">
          <button className="absolute bottom-4 right-4 z-30 bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black rounded-full p-2.5 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl transform group-hover:scale-110">
            <DollarSign size={18} className="font-bold" />
          </button>
        </Link>
      </Card>
    </div>
  );
});
