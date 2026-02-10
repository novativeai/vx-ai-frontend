"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { DollarSign, Play, Download } from "lucide-react";
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
  onClick?: (item: Generation) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = memo(function HistoryCard({ item, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterVideoRef = useRef<HTMLVideoElement>(null);

  // For videos: use a hidden <video> with preload="metadata" to render a poster frame
  // This is much lighter than loading the full video and works on Chrome
  const handlePosterReady = useCallback(() => {
    setPosterReady(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (item.outputType === 'video') {
      setShowVideo(true);
      // Small delay to let the video element mount before playing
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    }
  }, [item.outputType]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Fires when the video is actually rendering frames — safe to crossfade
  const handleVideoPlaying = useCallback(() => {
    setVideoPlaying(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.outputUrl) {
      const link = document.createElement("a");
      link.href = item.outputUrl;
      link.download = `${item.prompt?.slice(0, 30) || "generation"}.${item.outputType === 'video' ? 'mp4' : 'png'}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [item.outputUrl, item.prompt, item.outputType]);

  const handleCardClick = useCallback(() => {
    onClick?.(item);
  }, [onClick, item]);

  const isVideo = item.outputType === 'video';
  // Shimmer visible until poster frame loads (video) or image loads
  const shimmerVisible = isVideo ? !posterReady : !imageLoaded;

  return (
    <div
      className="group text-left w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0 border-neutral-800 hover:border-[#D4FF4F]/60"
        onClick={handleCardClick}
      >
        <div className="bg-neutral-900 relative overflow-hidden aspect-square">
          {/* Skeleton shimmer — visible until poster/image loads */}
          {shimmerVisible && !videoPlaying && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-neutral-800" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
            </div>
          )}

          {isVideo ? (
            <>
              {/* Poster layer — lightweight video with preload="metadata" for first frame */}
              <video
                ref={posterVideoRef}
                src={item.outputUrl}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  videoPlaying ? "opacity-0" : posterReady ? "opacity-100" : "opacity-0"
                }`}
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={handlePosterReady}
                onLoadedData={handlePosterReady}
              />

              {/* Playback layer — only mounted on hover, crossfades in when actually playing */}
              {showVideo && (
                <video
                  ref={videoRef}
                  src={item.outputUrl}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onPlaying={handleVideoPlaying}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    videoPlaying && isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}

              {/* Play indicator — visible on hover until video is playing */}
              <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${
                isHovered && !videoPlaying ? 'opacity-100' : 'opacity-0'
              }`}>
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
              className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={handleImageLoad}
            />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Download button - top right */}
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/80 hover:bg-[#D4FF4F] text-black rounded-full pl-3 pr-3.5 py-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg text-xs font-semibold"
          >
            <Download size={14} />
            <span>Save</span>
          </button>

          {/* Sell button - top left */}
          <Link
            href={`/marketplace/create?generationId=${item.id}`}
            className="z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#D4FF4F] hover:bg-[#c2ef3d] text-black rounded-full pl-3 pr-3.5 py-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg text-xs font-semibold">
              <DollarSign size={14} />
              <span>Sell</span>
            </button>
          </Link>
        </div>

        {/* Info - overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white line-clamp-2">{item.prompt}</h3>
          <p className="text-[10px] text-neutral-400 mt-2">
            {item.createdAt?.toDate().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </Card>
    </div>
  );
});
