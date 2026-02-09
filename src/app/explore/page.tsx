"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { modelConfigs } from "@/lib/modelConfigs";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Component Imports ---
import { HistoryCard } from "@/components/HistoryCard";
import { ModelCard } from "@/components/ModelCard";
import { VideoViewerModal } from "@/components/VideoViewerModal";
import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// --- Shared Type Imports ---
import { Generation, ModelConfig } from "@/types/types";

// --- Data Transformation for the Banner ---
// Filter to only video models with cardVideo for the banner
const explorePageSlides: BannerSlide[] = Object.values(modelConfigs)
  .filter(model => model.outputType === 'video' && model.cardVideo)
  .slice(0, 3)
  .map(model => ({
    videoSrc: model.cardVideo as string,
    title: model.displayName,
    subtitle: model.description,
    buttonText: "Try it now!",
    buttonLink: `/generator?model=${model.id}`,
  }));


// --- Components ---

function ModelGrid() {
  const models = Object.values(modelConfigs);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <ModelCard key={model.id} model={model as ModelConfig} />
      ))}
    </div>
  );
}

function HistorySection() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerItem, setViewerItem] = useState<Generation | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, "users", user.uid, "generations"), orderBy("createdAt", "desc"), limit(12));
    const unsub = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Generation)));
      setIsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const gridContainerClasses = "flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible";

  if (isLoading) {
    return (
      <div className={gridContainerClasses}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-80 shrink-0 lg:w-auto">
            <Card className="overflow-hidden rounded-2xl relative p-0 gap-0 border-neutral-800">
              <div className="bg-neutral-900 relative overflow-hidden aspect-square">
                {/* Shimmer */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-800" />
                  <div
                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-neutral-700/40 to-transparent"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                </div>
                {/* Gradient to match real cards */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              </div>
              {/* Text placeholders matching HistoryCard layout */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-3.5 w-full bg-neutral-700/50 rounded" />
                <div className="h-3 w-2/3 bg-neutral-700/30 rounded mt-1.5" />
                <div className="h-2 w-16 bg-neutral-800/40 rounded mt-2" />
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex justify-center lg:justify-start w-full">
        <div className="w-80 shrink-0">
          <Link href="/generator" className="group block h-full">
            <Card className="overflow-hidden rounded-2xl h-full border-neutral-800 bg-[#1C1C1C] hover:border-neutral-700 transition-colors">
              <AspectRatio ratio={1 / 1} className="flex flex-col items-center justify-center text-center text-neutral-500 p-6">
                <p className="font-semibold text-neutral-400">No history yet</p>
                <p className="text-sm">Start generating to see your creations.</p>
              </AspectRatio>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={gridContainerClasses}>
        {history.map(item => (
          <div key={item.id} className="w-80 shrink-0 sm:w-72 md:w-80 lg:w-auto">
            <HistoryCard item={item} onClick={setViewerItem} />
          </div>
        ))}
      </div>

      {viewerItem && (
        <VideoViewerModal
          item={viewerItem}
          onClose={() => setViewerItem(null)}
        />
      )}
    </>
  );
}

export default function ExplorePage() {
  const { user } = useAuth();

  // Handle hash scroll on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="bg-black text-white">
      <DynamicBanner slides={explorePageSlides} />
      
      <div className="container mx-auto px-4">
        <div className="space-y-16 md:space-y-24 py-16 md:py-24">
          <section>
            <div className="mb-12">
              <p className="text-sm uppercase tracking-widest text-neutral-400">AI MODELS</p>
              <h2 className="text-4xl md:text-6xl font-regular tracking-tighter mt-2">MODELS</h2>
              <p className="max-w-2xl text-neutral-300 mt-4">Browse our curated collection of foundational models, each designed to empower your creative vision.</p>
            </div>
            <ModelGrid />
          </section>
          
          {user && (
            <section id="history">
              <div className="mb-12">
                <p className="text-sm uppercase tracking-widest text-neutral-400">YOUR CREATIONS</p>
                <h2 className="text-4xl md:text-6xl font-regular tracking-tighter mt-2">HISTORY</h2>
                <p className="max-w-2xl text-neutral-300 mt-4">A gallery of your most recent generations. Revisit your work and continue your creative journey.</p>
              </div>
              <HistorySection />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}