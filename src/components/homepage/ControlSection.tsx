// FILE: ./src/components/homepage/ControlSection.tsx
import { Button } from "@/components/ui/button";
import { HoverVideoPlayer } from "@/components/HoverVideoPlayer";
import Link from "next/link";

const controlItems = [
  { title: "Camera", videoSrc: "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/control-1-optx.mp4" },
  { title: "Pose", videoSrc: "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/control-2-optx.mp4" },
  { title: "Transition", videoSrc: "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/control-3-optx.mp4" },
];
//
export function ControlSection() {
  return (
    <section className="bg-black text-white h-full flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-400">GENERATIVE AI</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mt-2">CONTROL</h2>
            <p className="max-w-md text-neutral-300 mt-4">We provide full control over the output, from motion and pose to camera placement—everything is in your hands.</p>
          </div>
          <Link href="/explore" className="mt-6 md:mt-0">
            <Button variant="brand-solid">
              START NOW
            </Button>
          </Link>
        </div>
        
        {/* --- THE FIX: Responsive Container --- */}
        {/* On mobile: flexbox with horizontal scrolling */}
        {/* On desktop: 3-column grid */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-4">
          {controlItems.map((item) => (
            // THE FIX: Card width and flex behavior for mobile scrolling
            <div key={item.title} className="w-4/5 md:w-auto flex-shrink-0">
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <HoverVideoPlayer src={item.videoSrc}  />
              </div>
              <p className="text-neutral-400 mt-4 font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}