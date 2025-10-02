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
    offset: ['start start', 'end end'] // Track scroll from the very top to the very bottom
  });

  return (
    // The main container establishes the scrollable area.
    // Its height needs to be greater than the sum of its sticky children
    // to allow for the scroll effect to complete.
    <main ref={container} className="relative bg-black" style={{ height: `${sections.length * 100}vh` }}>
      {sections.map((SectionComponent, i) => (
        <ParallaxSection 
          key={i} 
          i={i} 
          progress={scrollYProgress} 
          totalSections={sections.length}
        >
          {/* The actual section component is passed as children */}
          <SectionComponent />
        </ParallaxSection>
      ))}
    </main>
  );
}