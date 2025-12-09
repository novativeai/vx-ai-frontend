// page.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeroSection } from "@/components/homepage/HeroSection";
import { SnapSection } from "@/components/homepage/SnapSection";
import { SectionSkeleton } from "@/components/ui/premium-skeleton";

// Lazy load below-the-fold sections for faster initial page load
const ModelHighlightSection = dynamic(
  () => import("@/components/homepage/ModelHighlightSection").then(mod => ({ default: mod.ModelHighlightSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
);

const ControlSection = dynamic(
  () => import("@/components/homepage/ControlSection").then(mod => ({ default: mod.ControlSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
);

const AboutUsSection = dynamic(
  () => import("@/components/homepage/AboutUsSection").then(mod => ({ default: mod.AboutUsSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
);

const ModelsSection = dynamic(
  () => import("@/components/homepage/ModelsSection").then(mod => ({ default: mod.ModelsSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
);

const EmpoweringSection = dynamic(
  () => import("@/components/homepage/EmpoweringSection").then(mod => ({ default: mod.EmpoweringSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
);

export default function HomePage() {
  return (
    <main className="relative bg-black h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* Hero section loads immediately - critical for LCP */}
      <SnapSection>
        <HeroSection />
      </SnapSection>

      {/* Below-the-fold sections are lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <SnapSection>
          <ModelHighlightSection />
        </SnapSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SnapSection>
          <ControlSection />
        </SnapSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SnapSection>
          <AboutUsSection />
        </SnapSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SnapSection>
          <ModelsSection />
        </SnapSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SnapSection>
          <EmpoweringSection />
        </SnapSection>
      </Suspense>
    </main>
  );
}
