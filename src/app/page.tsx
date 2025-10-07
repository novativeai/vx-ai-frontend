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

// Import the ParallaxSection wrapper, which does not need to be changed
import { ParallaxSection } from "@/components/homepage/ParallaxSection";

// --- THE FIX: Create an array ONLY for the sections that will have the parallax effect ---
const parallaxSections = [
  HeroSection,
  ModelHighlightSection,
  ControlSection
];

export default function HomePage() {
  const container = useRef(null);
  
  // The useScroll hook will now only track the progress within the parallax container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    // The main wrapper remains the same
    <main className="bg-black space-y-12 md:space-y-12">
      
      {/* --- Part 1: The Parallax Container --- */}
      {/* This container has a fixed height based on the number of parallax sections. */}
      {/* This is the "runway" for the stacking effect. */}
      <div ref={container} className="relative" style={{ height: `${parallaxSections.length * 100}vh` }}>
        {parallaxSections.map((SectionComponent, i) => (
          <ParallaxSection 
            key={i} 
            i={i} 
            progress={scrollYProgress} 
            // Pass the correct total number of parallax sections
            totalSections={parallaxSections.length}
          >
            <SectionComponent />
          </ParallaxSection>
        ))}
      </div>

      {/* --- Part 2: The Normal Scroll Container --- */}
      {/* These sections are rendered after the parallax container and will scroll normally. */}
      {/* The 'relative z-10' ensures a clean visual transition over the last parallax item. */}
      <div className="relative z-10 bg-black space-y-20 md:space-y-32">
        <AboutUsSection />
        <ModelsSection />
        <EmpoweringSection />
      </div>

    </main>
  );
}