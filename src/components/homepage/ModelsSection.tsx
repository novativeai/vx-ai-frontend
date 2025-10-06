"use client";

import { modelConfigs } from "@/lib/modelConfigs"; // Import the single source of truth
import { ModelCard } from "@/components/ModelCard";   // Import the refactored card component
import { ModelConfig } from "@/types/types";
// --- THE FIX: Define the ModelItem type ---

// Get the first 3 models to display on the homepage
const modelsToShow = Object.values(modelConfigs).slice(0, 3);

export function ModelsSection() {
  return (
    <section className="bg-black text-white ">
      <div className="container mx-auto">
        <p className="text-sm uppercase tracking-widest text-neutral-400">GENERATIVE AI</p>
        <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mt-2">MODELS</h2>
        <p className="max-w-2xl text-neutral-300 mt-4">We are focused on foundational research and systems engineering to build multimodal general intelligence.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* --- THE FIX: Using the refactored ModelCard component --- */}
          {/* This loop is now much cleaner and ensures consistency with the Explore page */}
          {modelsToShow.map((model) => (
            <ModelCard key={model.id} model={model as ModelConfig} />
          ))}
        </div>
      </div>
    </section>
  );
}