"use client";
// Import all your section components
import { HeroSection } from "@/components/homepage/HeroSection";
import { ModelHighlightSection } from "@/components/homepage/ModelHighlightSection";
import { ControlSection } from "@/components/homepage/ControlSection";
import { AboutUsSection } from "@/components/homepage/AboutUsSection";
import { ModelsSection } from "@/components/homepage/ModelsSection";
import { EmpoweringSection } from "@/components/homepage/EmpoweringSection";
import Footer from "@/components/Footer"; // Import the Footer component


export default function HomePage() {

  return (
    // The main wrapper is the scroll snap container.
    <main className="bg-black h-screen overflow-y-auto snap-y snap-mandatory snap-always">
      
        {/* Section 1: HeroSection */}
        <section className="snap-start">
          <HeroSection/>
        </section>

        {/* Section 2: ModelHighlightSection */}
        <section className="snap-start">
          <ModelHighlightSection/>
        </section>
        
        {/* Section 3: ControlSection */}
        <section className="snap-start">
          <ControlSection/>
        </section>

        {/* Section 4: AboutUsSection */}
        <section className="snap-start h-screen flex items-center justify-center">
          <AboutUsSection />
        </section>

        {/* Section 5: ModelsSection */}
        <section className="snap-start h-screen flex items-center justify-center">
          <ModelsSection />
        </section>

        {/* Section 6: EmpoweringSection and Footer share this final snap screen. */}
        {/* This is a full-height flex column. */}
        <section className="snap-start h-screen flex flex-col">
            {/* This inner div grows to push the footer to the bottom,
                while also centering the EmpoweringSection within the available space. */}
            <div className="flex-grow flex items-center justify-center">
                <EmpoweringSection />
            </div>
            {/* The Footer is now part of the last snap point. */}
            <Footer />
        </section>

    </main>
  );
}