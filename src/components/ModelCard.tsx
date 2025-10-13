// FILE: ./src/components/ModelCard.tsx
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HoverVideoPlayer } from "@/components/HoverVideoPlayer";

interface Model {
  id: string;
  displayName: string;
  description: string;
  tags: string[];
  cardVideo: string;
  outputType: 'video' | 'image';
}

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Link href={`/generator?model=${model.id}`} className="group">
      <Card className="bg-[#1C1C1C] border-neutral-800 rounded-2xl p-4 transition-all md:h-full group-hover:ring-2 group-hover:ring-white/50 overflow-hidden min-w-80">
        {/* 
          THE FIX: Added `min-w-80` (320px).
          - This prevents the card from shrinking below a readable width on mobile.
          - When the parent's `w-4/5` becomes smaller than 320px, this rule takes precedence,
            forcing the horizontal scroll to activate instead of squishing the card content.
        */}
        <div className="aspect-video rounded-lg overflow-hidden">
          <HoverVideoPlayer src={model.cardVideo} />
        </div>
        <div className="p-4">
          <Badge variant="outline" className="border-neutral-500 text-neutral-300 capitalize">{model.outputType}</Badge>
          <h3 className="text-xl font-bold mt-4 text-white">{model.displayName}</h3>
          <p className="text-neutral-400 mt-2 text-sm line-clamp-2">{model.description}</p>
          <div className="flex gap-2 mt-4">
            {model.tags.map(tag => <Badge key={tag} className="bg-neutral-700 text-neutral-200 hover:bg-neutral-600">{tag}</Badge>)}
          </div>
        </div>
      </Card>
    </Link>
  );
};