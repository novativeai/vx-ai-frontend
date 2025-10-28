"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW: Define the content for your hero slides ---
const heroSlides = [
  {
    //videoSrc: "/videos/highlight-1-opx.mp4", // Replace with your first video
    videoSrc: "/videos/full-reel.mp4", // Replace with your first video
    title: <>YOUR PERSPECTIVE<br />LIKE NEVER BEFORE</>,
    subtitle: "A platform for filmakers, advertisers & creative teams",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = heroSlides[currentIndex];
  
  // This function is called when a video finishes playing
  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
  };

  // Estimate your longest video duration for the progress bar animation
  const videoDuration = 10; // in seconds

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-start text-left text-white overflow-hidden">
      {/* --- Video Background Carousel --- */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <AnimatePresence>
          <motion.video
            key={currentSlide.videoSrc}
            src={currentSlide.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
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
              {/* --- Using the new brand-solid variant --- */}
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
            {index === currentIndex && (
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