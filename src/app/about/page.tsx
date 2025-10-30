"use client";

import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { AboutUsSection } from "@/components/homepage/AboutUsSection";

// Define the content for the 3 slides
const aboutUsSlides: BannerSlide[] = [
  {
    videoSrc: "/videos/about-1.mp4", // Replace with your video
    title: <>Engineering the<br />Future of Creativity</>,
    subtitle: "We bring together experts from diverse fields to engineer robust, scalable systems that make advanced AI accessible and intuitive for everyone.",
    buttonText: "Explore Models",
    buttonLink: "/explore"
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-black space-y-24 md:space-y-24">
      <DynamicBanner slides={aboutUsSlides} />
      <AboutUsSection />
      <div className="h-12"/>
    </div>
  );
}