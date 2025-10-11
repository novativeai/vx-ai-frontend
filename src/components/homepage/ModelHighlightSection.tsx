// FILE: ./src/components/homepage/ModelHighlightSection.tsx

// The HoverVideoPlayer is no longer needed in this component.

export function ModelHighlightSection() {
  return (
    <section className="bg-black text-white overflow-hidden">
      {/* The `isolate` class on this container is critical for the blend effect to work. */}
      <div className="container mx-auto h-[100vh] relative isolate">
        
        {/* --- Top Left Elements --- */}
        <div className="absolute top-0 left-0 z-10">
          <h2 className="text-9xl font-extrabold tracking-tighter">New</h2>
          <p className="mt-8 max-w-sm text-2xl z-10 leading-tight">
            <span className="text-white font-bold">Unprecedented control over cinematic storytelling</span> with our most capable video model yet.
          </p>
        </div>

        {/* --- Top Right Paragraph --- */}
        <div className="absolute top-28 right-0 max-w-xs text-neutral-400 text-sm z-10 space-y-4">
          <p>VEO 3 has a sophisticated, nuanced understanding of natural language and cinematic terms like "timelapse" or "aerial shot," allowing for breathtakingly accurate and dynamic video outputs.</p>
          <p>It generates high-quality, 1080p videos that can go beyond a minute, capturing realistic motion and maintaining visual and narrative consistency across multiple shots and scenes.</p>
        </div>
        
        {/* --- Central Video Player Container --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[900px] aspect-[5/4] overflow-hidden">
          {/* 
            THE FIX: Replaced HoverVideoPlayer with a standard <video> tag.
            - `autoPlay`, `loop`, `muted`, `playsInline` ensure continuous, silent playback across devices.
            - `w-full`, `h-full`, `object-cover` make the video fill the container without distortion or overflow.
          */}
          <video
            src="/videos/skeleton.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- VEO3 Overlapping Text --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[900px] aspect-[5/4] z-20 flex items-center justify-center">
            <h3 className="text-9xl font-extrabold tracking-tighter text-white mix-blend-difference">
              VEO3
            </h3>
        </div>

        <div className="absolute bottom-0 left-0 max-w-sm z-20">
          <p className="text-sm">
            <span className="text-white font-bold">
              The model faithfully renders your creative prompts,
            </span>{' '}
             producing coherent, believable videos with stunning detail. Characters, objects, and backgrounds remain consistent throughout the entire generation.
          </p>
        
          <h2 className="text-8xl font-extrabold tracking-tighter mt-4 whitespace-nowrap overflow-visible">
            Available Now
          </h2>
        </div>
      </div>
    </section>
  );
}