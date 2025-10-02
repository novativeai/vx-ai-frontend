"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { modelConfigs } from "@/lib/modelConfigs";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Import the restored and other necessary components ---
import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { HistoryCard } from "@/components/HistoryCard";
import { ModelCard } from "@/components/ModelCard";

// --- THE FIX: Define a single, comprehensive Model type ---
interface Model {
  id: string;
  displayName: string;
  description: string;
  tags: string[];
  bannerImage: string;
  cardVideo: string;
  outputType: 'video' | 'image';
  params: any[]; // Keep params as 'any' for simplicity, as it's not directly used here
  tips?: any[];
}

// --- Page-Specific Data and Components ---
// --- THE FIX: Define a type for the History items ---
interface HistoryItem {
  id: string;
  outputUrl?: string;
  outputType?: 'video' | 'image';
  prompt?: string;
  status?: 'completed' | 'pending' | 'failed';
  [key: string]: any;
}

// --- THE FIX: Define a type for the Model items ---
interface ModelItem {
  id: string;
  displayName: string;
  description: string;
  tags: string[];
  cardVideo: string;
  outputType: 'video' | 'image';
  [key: string]: any;
}
// Prepare data for the dynamic banner using our model configs
const modelSlides: BannerSlide[] = Object.values(modelConfigs).map(model => ({
  videoSrc: model.bannerImage,
  title: <>{model.displayName}</>,
  subtitle: model.description,
  buttonText: "Try it now!",
  buttonLink: `/generator?model=${model.id}`,
  outputType: model.outputType
}));

function ModelGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(modelConfigs).map((model) => (
        <ModelCard key={model.id} model={model as any} />
      ))}
    </div>
  );
}

function HistorySection() {
  const { user } = useAuth();
    // --- THE FIX: Use the specific type for state ---
  // --- THE FIX: Use the specific HistoryItem type ---
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "generations"), orderBy("createdAt", "desc"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  if (!user || history.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {history.map(item => (
        <div key={item.id} className="w-64 sm:w-72 md:w-80 flex-shrink-0">
          <HistoryCard item={item} />
        </div>
      ))}
    </div>
  );
}

// --- THE FINAL PAGE STRUCTURE ---
export default function ExplorePage() {
  const { user } = useAuth();
  
  return (
    <div className="bg-black text-white">
      {/* The DynamicBanner is now correctly used as a reusable component */}
      <DynamicBanner slides={modelSlides} />

      <div className="space-y-16 md:space-y-24">
        {/* Models Section with guaranteed padding */}
        <section className="pt-16 md:pt-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left">Models</h2>
            <ModelGrid />
          </div>
        </section>

        {/* History Section with guaranteed padding */}
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