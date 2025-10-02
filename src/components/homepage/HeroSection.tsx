import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video src="/videos/highlight-1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight">
          YOUR PERSPECTIVE <br /> LIKE NEVER BEFORE
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-300">
          A platform for filmakers, advertisers & creative teams
        </p>
        <Link href="/explore">
          <Button size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200 transition-colors font-semibold">
            START NOW
          </Button>
        </Link>
      </div>
    </section>
  );
}