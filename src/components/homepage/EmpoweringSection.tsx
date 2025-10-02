import { Button } from "@/components/ui/button";

export function EmpoweringSection() {
  return (
    <section className="bg-black text-white py-20 md:py-32 px-4">
      <div className="container mx-auto">
        <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-12">Empowering</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl">

            <div className="bg-white text-black p-8 rounded-xl max-w-md">
              <h3 className="text-4xl font-bold">Are you a student?</h3>
              <p className="mt-4 text-neutral-700">We believe in making advanced AI tools accessible. That&apos;s why we provide dedicated support through free credits, exclusive access, and tailored resources to help students experiment and bring their ideas to life.</p>
              <Button className="mt-6 bg-black text-white hover:bg-neutral-800 font-semibold">
                Subscribe
              </Button>
            </div>
          <div className="h-full w-full">
            <img src="/images/empowering-1.png" alt="Student using AI tools" className="rounded-r-2xl w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </section>
  );
}