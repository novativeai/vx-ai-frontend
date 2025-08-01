"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

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
    <section className="max-w-4xl mx-auto">
      {tips.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">{section.title}</h2>
          <div className="space-y-6">
            {section.content.map((item, itemIndex) => (
              <Card key={itemIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{item.subtitle}</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}