"use client";

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SnapSectionProps {
  children: ReactNode;
}

export const SnapSection = ({ children }: SnapSectionProps) => {
  const sectionRef = useRef(null);

  // useScroll now targets this specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Animate as the section scrolls through the viewport
    // 'start end' = when the top of the section hits the bottom of the viewport
    // 'end start' = when the bottom of the section hits the top of the viewport
    offset: ['start end', 'end start'] 
  });

  // Create a parallax effect for the content inside the section.
  // As you scroll down (progress from 0 to 1), the content moves up.
  const y = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);

  return (
    // This is the snap target. It must be a direct child of the snap container.
    <section 
      ref={sectionRef} 
      className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
    >
      {/* The motion.div contains the actual section content.
          The 'y' style applies the parallax scroll effect. */}
      <motion.div 
        className="relative w-full h-full"
        style={{ y }}
      >
        {children}
      </motion.div>
    </section>
  );
};