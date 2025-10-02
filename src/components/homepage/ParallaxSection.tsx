"use client";

import { ReactNode } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  i: number; // The index of this section
  progress: MotionValue<number>; // The scroll progress of the main container
  totalSections: number;
}

export const ParallaxSection = ({ children, i, progress, totalSections }: ParallaxSectionProps) => {
  const sectionProgressStart = i / totalSections;
  const sectionProgressEnd = (i + 1) / totalSections;

  // This transform for the 'scrolling' motion is correct and remains unchanged.
  const y = useTransform(
    progress,
    [sectionProgressStart, sectionProgressEnd],
    ["0%", "-50%"]
  );

  // --- THE FIX: Constrain the scale animation to a short, consistent interval ---
  // Each section will now scale from 100% to 90% over a fixed 10% of the total scroll
  // distance, right after it is covered. This prevents the compounding gap.
  const scale = useTransform(
    progress,
    [sectionProgressEnd - 0.05, sectionProgressEnd], // Animate scale just as the section finishes its 'y' travel
    [1, 0.9]
  );
  
  // The opacity fade-out remains the same, ensuring no visual overflow at the bottom.
  const opacity = useTransform(
    progress,
    [sectionProgressEnd - 0.02, sectionProgressEnd], // Fade out very quickly as it gets covered
    [1, 0]
  );

  return (
    <div className="h-screen sticky top-0">
      <motion.div 
        className="relative w-full h-full will-change-transform will-change-opacity"
        style={{ y, scale, opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
};