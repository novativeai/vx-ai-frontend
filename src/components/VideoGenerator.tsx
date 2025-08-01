"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Wand2, Frown, BotMessageSquare, GalleryVertical, Quote } from 'lucide-react';

// --- Data for the Inspiration Gallery ---
const inspirationData = [
  {
    prompt: "A majestic lion shaking n slow motion, detailed fur, realistic lighting.",
    videoUrl: "https://videos.pexels.com/video-files/13061900/13061900-hd_1920_1080_24fps.mp4"
  },
  {
    prompt: "Aerial drone shot flying over a dense, foggy forest canopy at sunrise.",
    videoUrl: "https://videos.pexels.com/video-files/29095944/12571463_2560_1440_60fps.mp4"
  },
  {
    prompt: "Close‑up of a programmer's hands typing code on a mechanical keyboard, green text on black screen.",
    videoUrl: "https://videos.pexels.com/video-files/30431411/13041310_1920_1080_25fps.mp4"
  },
  {
    prompt: "Waves crashing on a black sand beach in Iceland, cinematic and dramatic.",
    videoUrl: "https://videos.pexels.com/video-files/27591404/12178142_2560_1440_25fps.mp4"
  },
  {
    prompt: "Pouring water into a glass of strawberries on a fancy dinner table.",
    videoUrl: "https://videos.pexels.com/video-files/6535266/6535266-uhd_1440_2732_30fps.mp4"
  },
    {
    prompt: "A bustling futuristic city with robots dancing on a rooftop.",
    videoUrl: "https://videos.pexels.com/video-files/29724125/12779475_2560_1440_24fps.mp4"
  },
];


export function VideoGenerator() {
  const { user, credits, setCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateVideo = async () => {
    // ... (Your existing handleGenerateVideo logic remains unchanged)
    if (!user || credits <= 0) {
      setError(user ? "You don't have enough credits." : "Please sign in to generate videos.");
      return;
    }
    setGenerating(true);
    setError('');
    setVideoUrl('');
    try {
      const response = await fetch('http://localhost:8000/generate-video', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, user_id: user.uid }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate video');
      }
      const data = await response.json();
      setVideoUrl(data.video_url[0]);
      setCredits(credits - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      {/* --- Section 1: The Generator --- */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Bring Your Ideas to Life
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Describe any scene imaginable, and our AI will create it for you. Start with a detailed prompt to get the best results.
        </p>
      </section>

      <Card className="max-w-3xl mx-auto mt-8 p-6">
        <CardContent className="p-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="prompt" className="flex items-center text-lg font-semibold">
                <BotMessageSquare className="mr-2 h-5 w-5" />
                Your Video Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="e.g., A cinematic shot of a futuristic city at night, with flying cars and neon signs."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={generating}
                className="text-base"
              />
            </div>
            <Button onClick={handleGenerateVideo} disabled={generating || !prompt} size="lg">
              <Wand2 className="mr-2 h-5 w-5" />
              {generating ? 'Generating...' : `Generate Video (${credits} Credits)`}
            </Button>
            {error && <p className="text-red-500 text-sm flex items-center mt-2"><Frown className="mr-2 h-4 w-4" />{error}</p>}
          </div>

          {/* --- Live Result Display --- */}
          <div className="mt-6">
              {generating && (
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </AspectRatio>
              )}
              {videoUrl && (
                <AspectRatio ratio={16 / 9}>
                    <video src={videoUrl} controls autoPlay loop className="w-full rounded-md border" />
                </AspectRatio>
              )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-16" />

      {/* --- Section 2: Inspiration Gallery --- */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center">
                <GalleryVertical className="mr-3 h-8 w-8" />
                Inspiration Gallery
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
                See what's possible and get ideas for your next creation.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationData.map((item, index) => (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-0">
                        <AspectRatio ratio={16/9}>
                            <video src={item.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                        </AspectRatio>
                    </CardContent>
                    <div className="p-4 bg-background/80 backdrop-blur-sm">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                           <Quote className="w-5 h-5 flex-shrink-0" /> 
                           <span>{item.prompt}</span>
                        </p>
                    </div>
                </Card>
            ))}
        </div>
      </section>
    </div>
  );
}