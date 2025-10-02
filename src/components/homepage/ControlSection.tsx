import { Button } from "@/components/ui/button";
import { HoverVideoPlayer } from "@/components/HoverVideoPlayer";

const controlItems = [
  { title: "Camera", videoSrc: "/videos/control-1.mp4" },
  { title: "Pose", videoSrc: "/videos/control-2.mp4" },
  { title: "Details", videoSrc: "/videos/control-3.mp4" },
];

export function ControlSection() {
  return (
    <section className="bg-black text-white py-20 md:py-32 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-400">GENERATIVE AI</p>
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mt-2">CONTROL</h2>
            <p className="max-w-md text-neutral-300 mt-4">We are focused on full control on output, from motion to pose to camera placement, everything is in your hand.</p>
          </div>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors hidden md:inline-flex font-semibold">
            START NOW
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {controlItems.map((item) => (
            <div key={item.title}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
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