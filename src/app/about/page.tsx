"use client";

import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { AboutUsSection } from "@/components/homepage/AboutUsSection";

// Define the content for the 3 slides
const aboutUsSlides: BannerSlide[] = [
  {
    videoSrc: "/videos/control-1.mp4", // Replace with your video
    title: <>Operating at the<br />frontier of knowledge</>,
    subtitle: "A platform for filmakers, advertisers & creative teams. We push the boundaries of multimodal general intelligence to empower creators everywhere.",
    buttonText: "Contact Us",
    buttonLink: "/contact"
  },
  {
    videoSrc: "/videos/control-2.mp4", // Replace with your video
    title: <>Innovation through<br />Foundational Research</>,
    subtitle: "Our work is built on a bedrock of scientific discovery. We invest in fundamental research to create tools that are not just powerful, but revolutionary.",
    buttonText: "Learn More",
    buttonLink: "/blog"
  },
  {
    videoSrc: "/videos/control-3.mp4", // Replace with your video
    title: <>Engineering the<br />Future of Creativity</>,
    subtitle: "We bring together experts from diverse fields to engineer robust, scalable systems that make advanced AI accessible and intuitive for everyone.",
    buttonText: "Explore Models",
    buttonLink: "/explore"
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-black">
      <DynamicBanner slides={aboutUsSlides} />
      <AboutUsSection />
    </div>
  );
}