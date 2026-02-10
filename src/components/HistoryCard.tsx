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
  thumbnailUrl?: string;
}

// Check if a URL is a static image (Firebase Storage), not a video
const isStaticThumbnail = (url?: string): boolean => {
  if (!url) return false;
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  if (videoExts.some(ext => url.toLowerCase().includes(ext))) return false;
  if (url.includes('storage.googleapis.com')) return true;
  if (url.includes('firebasestorage.googleapis.com')) return true;
  return false;
};

interface HistoryCardProps {
  item: Generation;
  onClick?: (item: Generation) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = memo(function HistoryCard({ item, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackPoster, setFallbackPoster] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = item.outputType === 'video';
  const hasStaticThumb = isVideo && isStaticThumbnail(item.thumbnailUrl);
  const posterUrl = hasStaticThumb ? item.thumbnailUrl : fallbackPoster;

  // Generate a fallback poster via canvas capture when no static thumbnail exists
  // Matches MarketplaceGrid ProductCard pattern exactly
  useEffect(() => {
    if (!isVideo || hasStaticThumb || fallbackPoster || posterLoading) return;

    setPosterLoading(true);

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = item.outputUrl;

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
  }, [item.outputUrl, isVideo, hasStaticThumb, fallbackPoster, posterLoading]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (isVideo) {
      setShowVideo(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    }
  }, [isVideo]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

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
          {isVideo ? (
            (!imageLoaded || !posterUrl) && !videoPlaying && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-800" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
              </div>
            )
          ) : (
            !imageLoaded && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-800" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
              </div>
            )
          )}

          {isVideo ? (
            <>
              {/* Poster layer — <Image> with static thumbnail or canvas-captured fallback */}
              {posterUrl && (
                <Image
                  src={posterUrl}
                  alt={item.prompt || "Video thumbnail"}
                  fill
                  className={`object-contain transition-opacity duration-300 ${
                    videoPlaying ? "opacity-0" : imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                  unoptimized={posterUrl.startsWith("data:")}
                  onLoad={handleImageLoad}
                />
              )}

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
