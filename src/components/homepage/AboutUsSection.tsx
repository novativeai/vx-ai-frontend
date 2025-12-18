// FILE: ./src/components/homepage/AboutUsSection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

const missionParagraphs = [
    <>Our work is built on a bedrock of <strong className="text-white font-bold">scientific discovery</strong>. We invest heavily in <strong className="text-white font-bold">fundamental research</strong> to create tools that are not just powerful, but truly revolutionary.</>,
    <>We aim to dismantle creative barriers by providing <strong className="text-white font-bold">intuitive tools</strong>. Our platform is designed to <strong className="text-white font-bold">amplify artistic vision</strong>, enabling storytellers everywhere to produce high-quality visual content effortlessly.</>,
    <>Our expert engineers build <strong className="text-white font-bold">robust, scalable systems</strong> that translate complex AI breakthroughs into a <strong className="text-white font-bold">seamless user experience</strong>, making advanced content creation accessible and reliable for every user.</>,
    <>We are charting the course for the future of digital storytelling. By pioneering the <strong className="text-white font-bold">next generation of creative AI</strong>, we are building a world where any <strong className="text-white font-bold">imagined vision can be realized</strong>.</>
];

export function AboutUsSection() {
  return (
    <section className="bg-black text-white h-full flex flex-col justify-center">
      {/* THE FIX: Responsive gap between columns */}
      <div className="container mx-auto grid md:grid-cols-2 gap-16 md:gap-32">
        {/* Left Column: Title and Button */}
        <div>
          {/* Section Label and Title - matching MODELS and CONTROL style */}
          <p className="text-sm uppercase tracking-widest text-neutral-400">GENERATIVE AI</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mt-2">MISSION</h2>
          <p className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-tight mt-8">
            Our mission is to build the perfect generation platform, to elevate creative minds to the next level.
          </p>
          <Link href="/about">
            <Button size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold">
              Join us
            </Button>
          </Link>
        </div>
        {/* Right Column Wrapper: THE FIX - Justify alignment is now responsive */}
        <div className="flex md:justify-end">
          <div className="grid grid-cols-1 max-w-md md:max-w-xs gap-8 text-neutral-400">
            {missionParagraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}