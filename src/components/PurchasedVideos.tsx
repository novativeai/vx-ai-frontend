"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Loader2, Play, Download } from "lucide-react";

interface PurchasedVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  price: number;
  sellerName: string;
  purchasedAt: {
    toDate: () => Date;
  };
}

// Memoized video card with dynamic aspect ratio
const PurchasedVideoCard = memo(function PurchasedVideoCard({
  video,
}: {
  video: PurchasedVideo;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
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

  // Backup: extract from actual video element
  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current && !aspectRatio) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (videoWidth && videoHeight) {
        setAspectRatio(videoWidth / videoHeight);
      }
    }
  }, [aspectRatio]);

  // Proactively extract aspect ratio using offscreen video (like MarketplaceGrid)
  useEffect(() => {
    if (aspectRatio || !video.videoUrl) return;

    const offscreenVideo = document.createElement("video");
    offscreenVideo.src = video.videoUrl;
    offscreenVideo.muted = true;
    offscreenVideo.preload = "metadata";

    const handleLoadedMetadata = () => {
      if (offscreenVideo.videoWidth && offscreenVideo.videoHeight) {
        setAspectRatio(offscreenVideo.videoWidth / offscreenVideo.videoHeight);
      }
      offscreenVideo.remove();
    };

    offscreenVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    offscreenVideo.load();

    return () => {
      offscreenVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      offscreenVideo.remove();
    };
  }, [video.videoUrl, aspectRatio]);

  // Check if video is already loaded on mount (handles cached videos)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) {
      handleVideoMetadata();
    }
  }, [handleVideoMetadata]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoUrl) {
      const link = document.createElement("a");
      link.href = video.videoUrl;
      link.download = `${video.title || "video"}.mp4`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      className="group text-left w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0 border-neutral-800 hover:border-neutral-700">
        {/* Square card container with video maintaining its natural aspect ratio inside */}
        <div className="bg-neutral-900 relative overflow-hidden aspect-square">
          {video.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={video.videoUrl}
                className="absolute inset-0 w-full h-full object-contain"
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={handleVideoMetadata}
              />
              {/* Play indicator on hover */}
              <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-[#D4FF4F]/90 rounded-full p-3 backdrop-blur-sm">
                  <Play size={24} className="fill-black text-black" />
                </div>
              </div>
            </>
          ) : video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-600" />
            </div>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Download button - top right */}
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 z-30 bg-[#D4FF4F] hover:bg-[#c2ef4a] text-black rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Product Info - overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white line-clamp-1">{video.title}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-medium text-[#D4FF4F]">€{video.price.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-400">by {video.sellerName}</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2">
            Purchased {video.purchasedAt?.toDate().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </Card>
    </button>
  );
});

export function PurchasedVideos() {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState<PurchasedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "purchased_videos"),
      orderBy("purchasedAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setPurchased(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as PurchasedVideo))
      );
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-semibold text-lg">Purchased Videos</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F]" />
        </div>
      </div>
    );
  }

  if (purchased.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-semibold text-lg">Purchased Videos</h2>
        <Card className="bg-[#1C1C1C] border-neutral-800 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
          <p className="text-neutral-400 mb-2">No purchased videos yet</p>
          <p className="text-sm text-neutral-500">
            Browse the marketplace to purchase videos
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Purchased Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchased.map((video) => (
          <PurchasedVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
