// FILE: ./src/components/homepage/ModelHighlightSection.tsx
import Link from "next/link";

export function ModelHighlightSection() {
  return (
    <section className="bg-black text-white overflow-hidden h-screen">
      <div className="container mx-auto h-full relative isolate flex flex-col justify-center px-0 md:block">
        
        <div className="relative z-10 md:absolute md:top-0 md:left-0">
          <h2 className="text-7xl md:text-9xl font-extrabold tracking-tighter">New</h2>
          <p className="mt-4 md:mt-8 max-w-sm text-xl md:text-2xl z-10 leading-tight">
            <span className="text-white font-bold">Unprecedented control over cinematic storytelling</span> with our most capable video model yet.
          </p>
        </div>

        <div className="hidden md:block absolute top-28 right-0 max-w-xs text-neutral-400 text-sm z-10 space-y-4">
          <p>VEO 3 has a sophisticated, nuanced understanding of natural language and cinematic terms like timelapse or aerial shot, allowing for breathtakingly accurate and dynamic video outputs.</p>
        </div>
        
        <div className="w-full mt-8 md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[60vw] max-w-[700px] aspect-[5/4] overflow-hidden">
          <video
            src="/videos/skeleton.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[60vw] max-w-[900px] aspect-[5/4] z-20 flex items-center justify-center">
            <h3 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white mix-blend-difference">
              VEO3
            </h3>
        </div>

        <div className="mt-8 md:absolute md:bottom-0 md:left-0 max-w-sm z-20">
          <p className="text-sm">
            <span className="text-white font-bold">
              The model faithfully renders your creative prompts,
            </span>{' '}
             producing coherent, believable videos with stunning detail.
          </p>
          
          {/* THE FIX: Replaced Button with a styled Link and h2 */}
          <Link href="/generator?model=veo-3-fast" className="block mt-4">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter whitespace-nowrap overflow-visible hover:text-neutral-300 transition-colors">
              Available Now
            </h2>
          </Link>
        </div>
      </div>
    </section>
  );
}