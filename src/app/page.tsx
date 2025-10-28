
// page.tsx
"use client";

import { useRef } from 'react';
import { useScroll } from 'framer-motion';

// Import all your section components
import { HeroSection } from "@/components/homepage/HeroSection";
import { ModelHighlightSection } from "@/components/homepage/ModelHighlightSection";
import { ControlSection } from "@/components/homepage/ControlSection";
import { AboutUsSection } from "@/components/homepage/AboutUsSection";
import { ModelsSection } from "@/components/homepage/ModelsSection";
import { EmpoweringSection } from "@/components/homepage/EmpoweringSection";

// Import the new ParallaxSection wrapper
import { ParallaxSection } from "@/components/homepage/ParallaxSection";

// Put your section components into an array for easy mapping
const sections = [
  HeroSection,
  ModelHighlightSection,
  ControlSection,
  AboutUsSection,
  ModelsSection,
  EmpoweringSection
];

export default function HomePage() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <div 
      className="relative bg-black overflow-y-scroll h-screen"
      style={{ 
        scrollSnapType: 'y proximity',
      }}
    >
      <main 
        ref={container} 
        className="relative" 
        style={{ 
          height: `${sections.length * 100}vh`,
        }}
      >
        {sections.map((SectionComponent, i) => (
          <ParallaxSection 
            key={i} 
            i={i} 
            progress={scrollYProgress} 
            totalSections={sections.length}
          >
            <SectionComponent />
          </ParallaxSection>
        ))}
      </main>
    </div>
  );
}