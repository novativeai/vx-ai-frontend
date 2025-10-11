// FILE: ./src/components/homepage/AboutUsSection.tsx
import { Button } from "@/components/ui/button";

// THE FIX: The array now contains JSX elements (React Fragments) instead of simple strings.
// This allows for rich text formatting like the use of <strong> tags for emphasis.
const missionParagraphs = [
    <>Our work is built on a bedrock of <strong>scientific discovery</strong>. We invest heavily in <strong>fundamental research</strong> to create tools that are not just powerful, but truly revolutionary.</>,
    <>We aim to dismantle creative barriers by providing <strong>intuitive tools</strong>. Our platform is designed to <strong>amplify artistic vision</strong>, enabling storytellers everywhere to produce high-quality visual content effortlessly.</>,
    <>Our expert engineers build <strong>robust, scalable systems</strong> that translate complex AI breakthroughs into a <strong>seamless user experience</strong>, making advanced content creation accessible and reliable for every user.</>,
    <>We are charting the course for the future of digital storytelling. By pioneering the <strong>next generation of creative AI</strong>, we are building a world where any <strong>imagined vision can be realized</strong>.</>
];

export function AboutUsSection() {
  return (
    <section className="bg-black text-white px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-32">
        {/* Left Column: Title and Button */}
        <div>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-tight">
            Our mission is to build the perfect generation platform, to elevate creative minds to the next level.
          </h2>
          <Button size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold">
            Join us
          </Button>
        </div>
        {/* Right Column Wrapper: Aligns its content to the end (right) */}
        <div className="flex justify-end">
          {/* Content Block: The paragraphs are now rendered with bolded text */}
          <div className="grid grid-cols-1 max-w-80 gap-8 text-neutral-400">
            {missionParagraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}