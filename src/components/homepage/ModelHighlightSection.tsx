"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { PremiumSkeleton } from "@/components/ui/premium-skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function ModelHighlightSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if video is already ready on mount (handles cached videos)
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  // Fallback timeout to prevent skeleton from getting stuck (max 4s)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <section className="bg-black text-white overflow-hidden h-full">
      <div className="container mx-auto h-full relative flex flex-col justify-center px-0 md:block">

        <motion.div
          className="relative z-10 md:absolute md:top-0 md:left-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-7xl md:text-9xl font-extrabold tracking-tighter">New</h2>
          <p className="mt-4 md:mt-8 max-w-sm text-xl md:text-2xl z-10 leading-tight">
            <span className="text-white font-bold">Native audio synthesis meets cinematic generation</span> in our most immersive video model yet.
          </p>
        </motion.div>

        <motion.div
          className="hidden md:block absolute top-28 right-0 max-w-xs text-neutral-400 text-sm z-10 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>VEO 3.1 generates synchronized dialogue, ambient soundscapes, and realistic Foley effects automatically. No post-production audio needed—everything is created in one generation.</p>
        </motion.div>

        <Link
          href="/generator?model=veo-3.1"
          className="w-full mt-8 md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[60vw] max-w-[700px] aspect-[5/4] overflow-hidden relative block cursor-pointer group"
        >
          {/* Loading skeleton */}
          <AnimatePresence>
            {!isVideoLoaded && (
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

          <video
            ref={videoRef}
            src="https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/skeleton.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoad}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* VEO3.1 text overlay - inside video container for mix-blend-difference to work */}
          {/* Centered on "E" by offsetting right to compensate for "3.1" width */}
          {/* No opacity animation - mix-blend-difference doesn't work with opacity transitions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h3
              className="text-8xl md:text-9xl tracking-tighter text-white mix-blend-difference flex items-baseline translate-x-[0.75em]"
              initial={{ scale: 0.8, y: 20 }}
              whileInView={{ scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <span className="font-extrabold">VEO</span>
              <span className="font-light ml-1">3.1</span>
            </motion.h3>
          </div>
        </Link>

        <motion.div
          className="mt-8 md:absolute md:bottom-0 md:left-0 max-w-sm z-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm">
            <span className="text-white font-bold">
              The model faithfully renders your creative prompts,
            </span>{' '}
             producing immersive videos with stunning visuals and synchronized audio.
          </p>

          <Link href="/generator?model=veo-3.1" className="block mt-4">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter whitespace-nowrap overflow-visible hover:text-neutral-300 transition-colors">
              Available Now
            </h2>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
