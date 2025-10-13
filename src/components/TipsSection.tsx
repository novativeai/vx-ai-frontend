"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Using the same interfaces from modelConfig.ts for type safety
interface TipContent {
  subtitle: string;
  text: string;
  list?: string[];
}

interface TipSection {
  title: string;
  content: TipContent[];
}

interface TipsSectionProps {
  tips?: TipSection[];
}

export function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) {
    return null; // Don't render anything if there are no tips
  }

  return (
    <section className="w-full mx-auto">
      {tips.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">{section.title}</h2>
          
          {/* THE FIX: A single card now wraps all the tip items for this section. */}
          <Card>
            <CardContent className="p-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {/* Replicating the previous CardHeader style */}
                  <h3 className="text-xl font-semibold leading-none tracking-tight">
                    {item.subtitle}
                  </h3>
                  
                  {/* Replicating the previous CardContent style */}
                  <div className="mt-4">
                    <p className="text-muted-foreground">{item.text}</p>
                    {item.list && (
                      <ul className="mt-4 space-y-2">
                        {item.list.map((listItem, listIndex) => (
                          <li key={listIndex} className="flex items-start">
                            <Check className="h-5 w-5 mr-2 mt-1 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{listItem}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Add a separator between items, but not after the last one */}
                  {itemIndex < section.content.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </section>
  );
}