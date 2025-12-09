"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { PremiumSkeleton } from "@/components/ui/premium-skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function ModelHighlightSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <section className="bg-black text-white overflow-hidden h-full">
      <div className="container mx-auto h-full relative isolate flex flex-col justify-center px-0 md:block">

        <motion.div
          className="relative z-10 md:absolute md:top-0 md:left-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-7xl md:text-9xl font-extrabold tracking-tighter">New</h2>
          <p className="mt-4 md:mt-8 max-w-sm text-xl md:text-2xl z-10 leading-tight">
            <span className="text-white font-bold">Unprecedented control over cinematic storytelling</span> with our most capable video model yet.
          </p>
        </motion.div>

        <motion.div
          className="hidden md:block absolute top-28 right-0 max-w-xs text-neutral-400 text-sm z-10 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>VEO 3 has a sophisticated, nuanced understanding of natural language and cinematic terms like timelapse or aerial shot, allowing for breathtakingly accurate and dynamic video outputs.</p>
        </motion.div>

        <div className="w-full mt-8 md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[60vw] max-w-[700px] aspect-[5/4] overflow-hidden">
          {/* Loading skeleton */}
          <AnimatePresence>
            {!isVideoLoaded && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PremiumSkeleton className="w-full h-full" />
              </motion.div>
            )}
          </AnimatePresence>

          <video
            src="/videos/skeleton.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoad}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[60vw] max-w-[900px] aspect-[5/4] z-20 flex items-center justify-center">
          <motion.h3
            className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white mix-blend-difference"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            VEO3
          </motion.h3>
        </div>

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
             producing coherent, believable videos with stunning detail.
          </p>

          <Link href="/generator?model=veo-3-fast" className="block mt-4">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter whitespace-nowrap overflow-visible hover:text-neutral-300 transition-colors">
              Available Now
            </h2>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
