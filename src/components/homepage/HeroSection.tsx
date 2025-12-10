"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumSkeleton } from "@/components/ui/premium-skeleton";

// Define the content for your hero slides
const heroSlides = [
  {
    videoSrc: "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/full-reel.mp4",
    // Optional: Add a poster image for faster perceived loading
    // posterSrc: "/images/hero-poster.jpg",
    title: <>YOUR PERSPECTIVE<br />LIKE NEVER BEFORE</>,
    subtitle: "A platform for filmmakers, advertisers & creative teams",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSlide = heroSlides[currentIndex];

  // Preload next video
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const nextIndex = (currentIndex + 1) % heroSlides.length;
    const nextVideo = heroSlides[nextIndex].videoSrc;

    // Preload next video
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = nextVideo;
    link.as = 'video';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [currentIndex]);

  // Handle video load events
  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // This function is called when a video finishes playing
  const handleVideoEnd = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    setIsVideoReady(false);
  }, []);

  // Estimate your longest video duration for the progress bar animation
  const videoDuration = 10; // in seconds

  return (
    <section className="relative h-full w-full flex items-center justify-start text-left text-white overflow-hidden">
      {/* --- Video Background with Loading State --- */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* Loading skeleton while video loads */}
        <AnimatePresence>
          {!isVideoReady && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PremiumSkeleton className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.video
            key={currentSlide.videoSrc}
            ref={videoRef}
            src={currentSlide.videoSrc}
            // poster={currentSlide.posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={handleCanPlay}
            onEnded={handleVideoEnd}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoReady ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* --- Left-Aligned Text Content --- */}
      <div className="container mx-auto relative z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "circOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-7xl md:text-7xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
              {currentSlide.title}
            </h1>
            <p className="mt-0 text-lg md:text-xl text-neutral-300">
              {currentSlide.subtitle}
            </p>
            <Link href="/explore">
              <Button size="lg" variant="brand-solid" className="mt-8">
                START NOW
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Dynamic Page Indicator Bars --- */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 z-20 flex">
        {heroSlides.map((_, index) => (
          <div key={index} className="flex-1 h-full bg-white/20">
            {index === currentIndex && isVideoReady && (
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: videoDuration, ease: 'linear' }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
