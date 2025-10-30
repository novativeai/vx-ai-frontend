"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure for each slide's content
export interface BannerSlide {
  videoSrc: string;
  title: React.ReactNode; // Allow for complex titles with <br />
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  posterSrc?: string; // Optional poster image
}

interface DynamicBannerProps {
  slides: BannerSlide[];
}

export const DynamicBanner: React.FC<DynamicBannerProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const currentSlide = slides[currentIndex];
  const isSingleSlide = slides.length === 1;

  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleVideoLoadedData = () => {
    setIsVideoLoaded(true);
  };

  // Reset loading state when slide changes
  const handleSlideChange = (newIndex: number) => {
    setIsVideoLoaded(false);
    setCurrentIndex(newIndex);
  };

  return (
    <section className="relative h-[70vh] w-full flex items-center justify-start text-left text-white overflow-hidden">
      {/* Loading Skeleton */}
      {!isVideoLoaded && (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Skeleton className="w-full h-full bg-[#1C1C1C]" />
        </div>
      )}

      <AnimatePresence>
        <motion.video
          key={currentSlide.videoSrc}
          src={currentSlide.videoSrc}
          poster={currentSlide.posterSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop={isSingleSlide}
          onEnded={!isSingleSlide ? handleVideoEnd : undefined}
          onLoadedData={handleVideoLoadedData}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="container mx-auto relative z-20 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "circOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
              {currentSlide.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-neutral-300">
              {currentSlide.subtitle}
            </p>
            <Button size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200 font-semibold">
              {currentSlide.buttonText}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Dynamic Page Indicator Bars */}
      {!isSingleSlide && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 z-20 flex">
          {slides.map((_, index) => (
            <div key={index} className="flex-1 h-full bg-white/20">
              {index === currentIndex && (
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: 'linear' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};