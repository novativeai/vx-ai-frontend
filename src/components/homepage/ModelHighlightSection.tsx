// src/components/homepage/ModelHighlightSection.tsx

// Note: For this specific design, a static image is used as the centerpiece.
// The HoverVideoPlayer is still available for other sections, but an <img> tag
// is used here to perfectly match the provided UI mockup.
// You can swap <img /> for <HoverVideoPlayer /> if you prefer the video interaction.

export function ModelHighlightSection() {
  return (
    <section className="bg-black text-white py-20 md:py-32 overflow-hidden">
      {/* 
        This is the main container that establishes the coordinate system.
        It is relative, so all children can be positioned absolutely within it.
        The height is set to be slightly larger than the viewport to accommodate all elements.
      */}
      <div className="container mx-auto h-[120vh] relative">
        
        {/* --- Top Left Elements --- */}
        <div className="absolute top-0 left-0">
          <h2 className="text-9xl font-extrabold tracking-tighter">New</h2>
          <p className="mt-8 max-w-sm text-2xl leading-tight">
            <span className="text-white font-bold">We are focused on foundational research and systems engineering to build</span> multimodal general intelligence
          </p>
        </div>

        {/* --- Top Right Paragraph --- */}
        <div className="absolute top-28 right-0 max-w-xs text-neutral-400 text-sm">
          <p>We are focused on foundational research and systems engineering to build multimodal general intelligence. We are focused on foundational research and systems engineering to build multimodal general.</p>
          <br />
          <p>We are focused on foundational research and systems engineering to build multimodal general intelligence. We are focused on foundational research and systems engineering to build multimodal.</p>
        </div>
        
        {/* --- Central Image --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] max-w-[500px] aspect-[4/5] z-10">
          <img 
            src="/images/skull.webp" // Replace with your image
            alt="VEO3 Highlight" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- VEO3 Overlapping Text --- */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full z-20 flex items-center">
            <h3 className="text-9xl font-extrabold tracking-tighter text-white mix-blend-difference -ml-56">
              VEO3
            </h3>
        </div>

        {/* --- Bottom Left Elements (Container for correct alignment) --- */}
        <div className="absolute bottom-0 left-0 max-w-sm z-20">
            <p className="text-sm">
                <span className="text-white font-bold">We are focused on foundational research and systems engineering to build</span> multimodal general intelligence. We are focused on foundational research and systems engineering to build multimodal general.
            </p>
            <h2 className="text-9xl font-extrabold tracking-tighter mt-4">Available Now</h2>
        </div>
      </div>
    </section>
  );
}