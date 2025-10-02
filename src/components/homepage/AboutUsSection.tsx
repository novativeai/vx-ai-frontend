import { Button } from "@/components/ui/button";

const missionParagraphs = [
    "We are focused on foundational research and systems engineering to build multimodal general intelligence.",
    "Our team brings together experts from various fields to push the boundaries of what's possible in AI-driven content creation.",
    "This dedication allows us to create tools that are not only powerful but also intuitive and accessible to creators of all skill levels.",
    "We are committed to an open approach, collaborating with the community to foster innovation and creativity for everyone."
];

export function AboutUsSection() {
  return (
    <section className="bg-black text-white py-20 md:py-40 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
            Our mission is to build the perfect generation platform, to elevate creative minds to the next level.
          </h2>
          <Button size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold">
            Join us
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-8 text-neutral-400">
          {missionParagraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}