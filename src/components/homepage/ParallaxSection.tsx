// ParallaxSection.tsx
"use client";

import { ReactNode } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  i: number;
  progress: MotionValue<number>;
  totalSections: number;
}

export const ParallaxSection = ({ children, i, progress, totalSections }: ParallaxSectionProps) => {
  const sectionProgressStart = i / totalSections;
  const sectionProgressEnd = (i + 1) / totalSections;

  const y = useTransform(
    progress,
    [sectionProgressStart, sectionProgressEnd],
    ["0%", "-20%"]
  );

  const scale = useTransform(
    progress,
    [sectionProgressEnd - 0.05, sectionProgressEnd], 
    [1, 0.9]
  );
  
  const opacity = useTransform(
    progress,
    [sectionProgressEnd - 0.02, sectionProgressEnd],
    [1, 0]
  );

  return (
    <section 
      className="h-screen sticky top-0" 
      style={{ 
        scrollSnapAlign: 'start',
      }}
    >
      <motion.div 
        className="relative w-full h-full"
        style={{ y, scale, opacity }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {children}
      </motion.div>
    </section>
  );
};