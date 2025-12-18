"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { modelConfigs } from "@/lib/modelConfigs";
import { Badge } from "@/components/ui/badge";
import { HoverVideoPlayer } from "@/components/HoverVideoPlayer";

export const ExploreModelGrid = () => {
  const models = Object.values(modelConfigs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map((model) => (
        <Link key={model.id} href={`/generator?model=${model.id}`} className="group">
          <div className="bg-[#1C1C1C] rounded-2xl p-4 transition-all group-hover:ring-2 group-hover:ring-white/50 h-full flex flex-col">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              {model.cardImage ? (
                <Image
                  src={model.cardImage}
                  alt={model.displayName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : model.cardVideo ? (
                <HoverVideoPlayer src={model.cardVideo} />
              ) : null}
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <Badge variant="outline" className="border-neutral-500 text-neutral-300 capitalize">{model.outputType}</Badge>
                <h3 className="text-xl font-bold mt-4 text-white">{model.displayName}</h3>
                <p className="text-neutral-400 mt-2 text-sm line-clamp-2">{model.description}</p>
              </div>
              <div className="flex gap-2 mt-4">
                {model.tags.map(tag => <Badge key={tag} className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600">{tag}</Badge>)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};