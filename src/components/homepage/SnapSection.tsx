"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SnapSectionProps {
  children: ReactNode;
  className?: string;
  autoHeight?: boolean;
  snapAlign?: 'start' | 'end';
}

export const SnapSection = ({ children, className = '', autoHeight = false, snapAlign = 'start' }: SnapSectionProps) => {
  const snapClass = snapAlign === 'end' ? 'snap-end' : 'snap-start';

  return (
    <section
      className={`${autoHeight ? 'h-auto' : 'h-screen'} w-full ${snapClass} relative overflow-hidden ${className}`}
    >
      <motion.div
        className={`relative w-full ${autoHeight ? '' : 'h-full'}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};