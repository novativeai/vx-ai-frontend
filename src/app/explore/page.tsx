"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { modelConfigs } from "@/lib/modelConfigs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "@/components/ui/carousel";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Autoplay from "embla-carousel-autoplay";
import { HistoryCard } from "@/components/HistoryCard";
import { ModelCard } from "@/components/ModelCard";

// --- THE FIX: Import the shared Generation type ---
import { Generation } from "@/types/types";

// --- THE FIX: Define the Model type for consistency ---
interface Model {
  id: string;
  displayName: string;
  description: string;
  tags: string[];
  bannerImage: string;
  cardVideo: string;
  outputType: 'video' | 'image';
  params: any[];
  tips?: any[];
}

// --- THE FIX: Remove the old, conflicting HistoryItem type ---
// interface HistoryItem { ... } // REMOVED

// --- Components ---

function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps]      = useState<number[]>([]);
  const models = Object.values(modelConfigs);
  const autoplayPlugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", () => { setSelectedIndex(api.selectedScrollSnap()); });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        plugins={[autoplayPlugin.current]}
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.reset()}
      >
        <CarouselContent>
          {models.map((model) => (
            <CarouselItem key={model.id}>
              <div className="relative flex items-end h-[500px] text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${(model as Model).bannerImage})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative p-6 md:p-8 z-10 container">
                  <Badge>{(model as Model).outputType === 'video' ? "Image-to-Video" : "Text-to-Image"}</Badge>
                  <h1 className="text-4xl md:text-6xl font-extrabold mt-4">{model.displayName}</h1>
                  <p className="mt-2 max-w-lg text-lg text-white/80">{model.description}</p>
                  <Link href={`/generator?model=${model.id}`}>
                    <Button className="mt-6" size="lg">Try it now!</Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {scrollSnaps.map((_, index) => (
          <div key={index} className={`h-1 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-white w-8' : 'bg-white/50 w-4'}`} />
        ))}
      </div>
    </div>
  );
}

function ModelGrid() {
  const models = Object.values(modelConfigs);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <ModelCard key={model.id} model={model as Model} />
      ))}
    </div>
  );
}

function HistorySection() {
  const { user } = useAuth();
  // --- THE FIX: Use the imported, correct Generation type for state ---
  const [history, setHistory] = useState<Generation[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "generations"), orderBy("createdAt", "desc"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      // --- THE FIX: Cast the Firestore data to the shared Generation type ---
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Generation)));
    });
    return () => unsub();
  }, [user]);

  if (!user || history.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {history.map(item => (
        <div key={item.id} className="w-64 sm:w-72 md:w-80 flex-shrink-0">
          {/* This prop passing is now type-safe */}
          <HistoryCard item={item} />
        </div>
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const { user } = useAuth();
  
  return (
    <div className="bg-black text-white">
      <HeroCarousel />
      <div className="space-y-16 md:space-y-24">
        <section className="pt-16 md:pt-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left">Models</h2>
            <ModelGrid />
          </div>
        </section>
        {user && (
          <section className="pb-16 md:pb-24">
            <div className="container px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left">History</h2>
              <HistorySection />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}