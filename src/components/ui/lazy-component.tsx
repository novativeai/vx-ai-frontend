"use client";

import React, { useRef, useState, useEffect, Suspense, ComponentType } from "react";
import { PremiumSkeleton, SectionSkeleton } from "./premium-skeleton";
import { motion } from "framer-motion";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  animateIn?: boolean;
}

// Lazy load component when it enters viewport
export function LazyComponent({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "100px",
  once = true,
  className,
  animateIn = true,
}: LazyComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasBeenVisible : isVisible;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? (
        animateIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )
      ) : (
        fallback || <PremiumSkeleton className="w-full h-64" />
      )}
    </div>
  );
}

// Lazy load a section with premium animation
export function LazySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LazyComponent
      fallback={<SectionSkeleton />}
      threshold={0.1}
      rootMargin="200px"
      className={className}
    >
      {children}
    </LazyComponent>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyWrappedComponent(props: P) {
    return (
      <LazyComponent fallback={fallback}>
        <Component {...props} />
      </LazyComponent>
    );
  };
}

// Suspense wrapper with premium fallback
export function SuspenseWrapper({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="w-full h-full min-h-[200px] flex items-center justify-center">
            <motion.div
              className="w-8 h-8 border-2 border-neutral-700 border-t-[#D4FF4F] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}

// Progressive image loading
export function ProgressiveImage({
  src,
  lowResSrc,
  alt,
  className,
  ...props
}: {
  src: string;
  lowResSrc?: string;
  alt: string;
  className?: string;
  [key: string]: unknown;
}) {
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!lowResSrc) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src, lowResSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`transition-all duration-500 ${
        isLoaded ? "" : "blur-sm scale-105"
      } ${className}`}
      {...props}
    />
  );
}
