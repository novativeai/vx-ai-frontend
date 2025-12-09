"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PremiumSkeleton } from "./premium-skeleton";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  playOnHover?: boolean;
  playOnView?: boolean;
  threshold?: number;
  onEnded?: () => void;
  priority?: boolean;
}

export function OptimizedVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  preload = "metadata",
  playOnHover = false,
  playOnView = false,
  threshold = 0.5,
  onEnded,
  priority = false,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading and play on view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold, rootMargin: "50px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  // Handle play on view
  useEffect(() => {
    if (!videoRef.current || !playOnView) return;

    if (isInView) {
      videoRef.current.play().catch(() => {
        // Autoplay prevented, ignore
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView, playOnView]);

  // Handle play on hover
  const handleMouseEnter = useCallback(() => {
    if (playOnHover && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [playOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (playOnHover && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [playOnHover]);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Only load video when in view (unless priority)
  const shouldLoadVideo = priority || isInView;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-neutral-900", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <PremiumSkeleton className="absolute inset-0 z-10" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
          <div className="text-center text-neutral-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load video</p>
          </div>
        </div>
      )}

      {/* Video element */}
      {shouldLoadVideo && !hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay && (priority || isInView)}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={priority ? "auto" : preload}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onEnded={onEnded}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Placeholder when not in view */}
      {!shouldLoadVideo && poster && (
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

// Optimized background video for hero sections
export function OptimizedBackgroundVideo({
  src,
  poster,
  className,
  overlay = true,
  overlayClassName,
}: {
  src: string;
  poster?: string;
  className?: string;
  overlay?: boolean;
  overlayClassName?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("absolute inset-0", className)}>
      {/* Poster as initial background */}
      {poster && !isLoaded && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video */}
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className={cn("absolute inset-0 bg-black/50", overlayClassName)}
        />
      )}
    </div>
  );
}
