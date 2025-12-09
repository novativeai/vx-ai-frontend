// FILE: ./src/components/homepage/ModelsSection.tsx
"use client";

import { modelConfigs } from "@/lib/modelConfigs";
import { ModelCard } from "@/components/ModelCard";
import { ModelConfig } from "@/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const modelsToShow = Object.values(modelConfigs).slice(0, 3);

export function ModelsSection() {
  return (
    <section className="bg-black text-white h-full flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
          <div>        <p className="text-sm uppercase tracking-widest text-neutral-400">GENERATIVE AI</p>
        <h2 className="text-4xl md:text-6xl font-regular tracking-tighter mt-2">MODELS</h2>
        <p className="max-w-2xl text-neutral-300 mt-4">We are focused on foundational research and systems engineering to build multimodal general intelligence.</p>
        </div>
                  <Link href="/explore" className="mt-6 md:mt-0">
            <Button variant="brand-solid">
              SEE MORE
            </Button>
          </Link>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-8 mt-12 overflow-x-auto md:overflow-visible pb-4">
          {modelsToShow.map((model) => (
            // THE FIX: Using the same responsive width as the working ControlSection
            <div key={model.id} className="w-4/5 md:w-auto flex-shrink-0">
              <ModelCard model={model as ModelConfig} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}