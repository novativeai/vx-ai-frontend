"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DollarSign } from "lucide-react";

interface Generation {
  id: string;
  outputUrl: string;
  outputType: 'video' | 'image';
  prompt: string;
  createdAt: {
    toDate: () => Date;
  };
}

interface HistoryCardProps {
  item: Generation;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
  return (
    <div className="w-80 flex-shrink-0">
      <Card className="overflow-hidden rounded-2xl relative group">
        <AspectRatio ratio={1 / 1} className="bg-neutral-800">
          {item.outputType === 'video' ? (
            <video src={item.outputUrl} muted loop autoPlay className="w-full h-full object-cover" />
          ) : (
            <Image src={item.outputUrl} alt={item.prompt || "Generated image"} fill className="object-cover" />
          )}
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white flex-1">
          <p className="font-medium line-clamp-2">{item.prompt}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {item.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Monetize Button - Right Bottom Corner */}
        <Link href={`/marketplace/create?generationId=${item.id}`}>
          <button className="absolute bottom-4 right-4 bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl">
            <DollarSign size={18} className="font-bold" />
          </button>
        </Link>
      </Card>
    </div>
  );
};