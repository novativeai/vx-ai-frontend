"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  DollarSign,
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Generation } from "@/types/types";

// Dynamic import to avoid SSR issues with react-player
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4FF4F] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface VideoViewerModalProps {
  item: Generation;
  onClose: () => void;
}

export function VideoViewerModal({ item, onClose }: VideoViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [played, setPlayed] = useState(0); // 0-1 fraction for progress bar
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);

  // ── Prevent body scroll ───────────────────────────────────────────
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const doc = document as Document & {
          webkitFullscreenElement?: Element;
          webkitExitFullscreen?: () => void;
        };
        const fullscreenEl = document.fullscreenElement || doc.webkitFullscreenElement;
        if (fullscreenEl) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          }
        } else {
          onClose();
        }
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === "m" || e.key === "M") {
        setIsMuted((p) => !p);
      }
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
      // Arrow keys for seeking
      if (e.key === "ArrowLeft" && playerRef.current) {
        playerRef.current.currentTime = Math.max(
          0,
          playerRef.current.currentTime - 5
        );
      }
      if (e.key === "ArrowRight" && playerRef.current) {
        playerRef.current.currentTime = Math.min(
          playerRef.current.duration || 0,
          playerRef.current.currentTime + 5
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // ── Fullscreen tracking (Safari + standard) ───────────────────────
  useEffect(() => {
    const handler = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      const fullscreenEl = document.fullscreenElement || doc.webkitFullscreenElement;
      setIsFullscreen(!!fullscreenEl);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  // ── Auto-hide controls after 3s ───────────────────────────────────
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  // ── Fullscreen toggle (Safari + standard) ─────────────────────────
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      const doc = document as Document & {
        webkitFullscreenElement?: Element;
        webkitExitFullscreen?: () => void;
      };
      const container = containerRef.current as HTMLDivElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      const fullscreenEl = document.fullscreenElement || doc.webkitFullscreenElement;

      if (!fullscreenEl) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  // ── Seek via progress bar ─────────────────────────────────────────
  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  const handleSeekChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setPlayed(value);
    },
    []
  );

  const handleSeekMouseUp = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      setSeeking(false);
      const value = parseFloat((e.target as HTMLInputElement).value);
      if (playerRef.current && duration > 0) {
        playerRef.current.currentTime = value * duration;
      }
      resetControlsTimeout();
    },
    [duration, resetControlsTimeout]
  );

  // Click on progress track to seek
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      setPlayed(pos);
      if (playerRef.current && duration > 0) {
        playerRef.current.currentTime = pos * duration;
      }
      resetControlsTimeout();
    },
    [duration, resetControlsTimeout]
  );

  // ── Download ──────────────────────────────────────────────────────
  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!item.outputUrl) return;
      const link = document.createElement("a");
      link.href = item.outputUrl;
      link.download = `${item.prompt?.slice(0, 30) || "generation"}.${
        item.outputType === "video" ? "mp4" : "png"
      }`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [item.outputUrl, item.prompt, item.outputType]
  );

  // ── Overlay click (close modal) ───────────────────────────────────
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // ── Time formatter ────────────────────────────────────────────────
  const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ── Time update handler ───────────────────────────────────────────
  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player || seeking) return;

    const currentDuration = player.duration || 0;
    const currentPlayTime = player.currentTime || 0;

    if (currentDuration > 0) {
      setPlayed(currentPlayTime / currentDuration);
      setCurrentTime(currentPlayTime);
    }
  }, [seeking]);

  const isVideo = item.outputType === "video";
  const dateStr = item.createdAt?.toDate().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Video viewer"
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-w-0 flex-1 pr-4">
          <h2 className="text-white text-sm sm:text-base font-medium line-clamp-1">
            {item.prompt}
          </h2>
          <p className="text-neutral-400 text-xs mt-0.5">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/marketplace/create?generationId=${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-[#D4FF4F] hover:bg-[#c2ef4a] text-black text-xs sm:text-sm font-semibold rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition-colors"
          >
            <DollarSign size={14} />
            <span className="hidden sm:inline">Sell on Marketplace</span>
            <span className="sm:hidden">Sell</span>
          </Link>

          <button
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Download"
          >
            <Download size={18} />
          </button>

          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Close viewer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── Main content area ───────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        onMouseMove={resetControlsTimeout}
      >
        {isVideo ? (
          <>
            {/* Video wrapper */}
            <div
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (
                  target.tagName === "VIDEO" ||
                  target.closest("[data-video-wrapper]")
                ) {
                  e.stopPropagation();
                  setIsPlaying((p) => !p);
                  resetControlsTimeout();
                }
              }}
            >
              <div
                data-video-wrapper
                className="relative max-w-full max-h-[calc(100vh-140px)] aspect-video"
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              >
                <ReactPlayer
                  ref={playerRef}
                  src={item.outputUrl}
                  playing={isPlaying}
                  muted={isMuted}
                  loop
                  playsInline
                  controls={false}
                  width="100%"
                  height="100%"
                  style={{
                    maxHeight: "calc(100vh - 140px)",
                    objectFit: "contain",
                  }}
                  onReady={() => {
                    if (playerRef.current) {
                      setDuration(playerRef.current.duration || 0);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onDurationChange={() => {
                    if (playerRef.current) {
                      setDuration(playerRef.current.duration || 0);
                    }
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    // For looping, this shouldn't fire, but reset if it does
                    setPlayed(0);
                    setCurrentTime(0);
                  }}
                />
              </div>
            </div>

            {/* Center play indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-5 backdrop-blur-sm">
                  <Play size={40} className="fill-white text-white ml-1" />
                </div>
              </div>
            )}

            {/* ── Bottom controls bar ────────────────────────────── */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 sm:px-6 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress bar */}
              <div
                className="w-full h-1.5 bg-neutral-700 rounded-full cursor-pointer mb-3 group relative"
                onClick={handleProgressClick}
              >
                {/* Filled portion */}
                <div
                  className="h-full bg-[#D4FF4F] rounded-full relative pointer-events-none"
                  style={{ width: `${played * 100}%` }}
                >
                  {/* Thumb */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#D4FF4F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                </div>

                {/* Invisible range input for precise seeking */}
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  onTouchEnd={(e) =>
                    handleSeekMouseUp(
                      e as unknown as React.MouseEvent<HTMLInputElement>
                    )
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seek"
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying((p) => !p);
                    }}
                    className="text-white hover:text-[#D4FF4F] transition-colors p-1"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted((p) => !p);
                    }}
                    className="text-white hover:text-[#D4FF4F] transition-colors p-1"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  <span className="text-neutral-400 text-xs tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="text-white hover:text-[#D4FF4F] transition-colors p-1"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── Image viewer ──────────────────────────────────────── */
          <div
            className="relative max-w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.outputUrl}
              alt={item.prompt || "Generated image"}
              width={1024}
              height={1024}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}
