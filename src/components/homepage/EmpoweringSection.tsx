import { Button } from "@/components/ui/button";

export function EmpoweringSection() {
  return (
    <section className="bg-black text-white h-screen flex flex-col justify-center">
      <div className="container mx-auto">
        <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-12">Empowering</h2>
        
        {/* --- THE MAIN CARD CONTAINER --- */}
        {/* It's now a single flex container with a white background and fixed desktop height. */}
        {/* It stacks vertically on mobile (flex-col) and horizontally on desktop (md:flex-row). */}
        <div className="bg-white text-black rounded-2xl md:h-[35vh] flex flex-col md:flex-row overflow-hidden">
          
          {/* --- Text Content Div --- */}
          {/* This div is flexible and takes up the remaining space. */}
          {/* 'justify-center' vertically centers the content. */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md">
              <h3 className="text-4xl font-bold">Are you a student?</h3>
              <p className="mt-4 text-neutral-700">
                We believe in making advanced AI tools accessible. That&apos;s why we provide dedicated support through free credits, exclusive access, and tailored resources to help students experiment and bring their ideas to life.
              </p>
              <Button className="mt-6 bg-black text-white hover:bg-neutral-800 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>

          {/* --- Image Div --- */}
          {/* This div has a fixed width of 65% on desktop. */}
          {/* 'flex-shrink-0' prevents it from shrinking. */}
          <div className="w-full md:w-[65%] h-64 md:h-full flex-shrink-0">
            <img 
              src="/images/empowering-1.png" 
              alt="Student using AI tools" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}