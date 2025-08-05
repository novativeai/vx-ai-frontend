// src/app/generator/page.tsx
"use client";

import { useState, Suspense, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { modelConfigs } from '@/lib/modelConfigs';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipsSection } from "@/components/TipsSection";
import { Separator } from "@/components/ui/separator";
import { Wand2, Frown, Video } from 'lucide-react';

// Define a type for the parameters state for better type safety
type ParamValues = string | number | null;

function GeneratorComponent() {
  const { user, credits, setCredits } = useAuth();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('model') || 'veo-3-fast';
  const currentModelConfig = modelConfigs[modelId];

  // THE FIX: State is now strongly typed.
  const [params, setParams] = useState<{[key: string]: ParamValues}>({});
  const [videoUrl, setVideoUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!currentModelConfig) return;
    // THE FIX: Type is inferred correctly now, no 'any' needed.
    const defaultParams: {[key: string]: ParamValues} = {};
    currentModelConfig.params.forEach(param => { defaultParams[param.name] = param.defaultValue; });
    setParams(defaultParams);
    setImagePreview(null); setVideoUrl(''); setError(''); setGenerating(false);
  }, [currentModelConfig]);

  // THE FIX: 'value' parameter is now strongly typed.
  const handleParamChange = (name: string, value: string | number) => { setParams(prev => ({ ...prev, [name]: value })); };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        handleParamChange('image', dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!user || credits <= 0) {
      setError(user ? "You don't have enough credits." : "Please sign in to generate videos.");
      return;
    }
    setGenerating(true); setError(''); setVideoUrl('');

    try {
     // const response = await fetch('https://aivideogenerator-production.up.railway.app/generate-video', {
      const response = await fetch('http://0.0.0.0:8000/generate-video', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, model_id: modelId, params }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).detail || 'Failed to generate video');
      }
      const data = await response.json();

      if (data.video_url && Array.isArray(data.video_url) && data.video_url.length > 0) {
        setVideoUrl(data.video_url[0]);
      } else {
        throw new Error("The model did not return a valid video output.");
      }

      setCredits(credits - 1);
    } catch (err) { // THE FIX: Removed ': any' and safely access the message.
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  if (!currentModelConfig) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500">Error: Model Configuration Not Found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <section className="text-center max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
          <Video className="h-8 w-8"/> Generating with {currentModelConfig.displayName}
        </h1>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader><CardTitle>Input Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {currentModelConfig.params.map(param => (
                <div key={param.name} className="grid w-full items-center gap-2">
                  <Label htmlFor={param.name} className="font-semibold">{param.label}</Label>
                  {param.type === 'textarea' && <Textarea id={param.name} value={params[param.name] as string || ''} onChange={(e) => handleParamChange(param.name, e.target.value)} rows={5} disabled={generating} />}
                  {param.type === 'slider' && <div className="flex items-center gap-4 pt-1"><Slider id={param.name} value={[params[param.name] as number || 0]} onValueChange={([value]) => handleParamChange(param.name, value)} min={param.min} max={param.max} step={param.step} disabled={generating} /><span className="font-mono text-sm w-12 text-center rounded-md border p-2">{params[param.name] as number}</span></div>}
                  {param.type === 'image' && <div className='grid gap-3'><Input id={param.name} type="file" onChange={handleImageChange} accept="image/*" disabled={generating} />{imagePreview && <AspectRatio ratio={16 / 9} className="bg-muted rounded-md border"><img src={imagePreview} alt="Image preview" className="object-contain w-full h-full rounded-md" /></AspectRatio>}</div>}
                  {param.type === 'dropdown' && <Select value={params[param.name] as string || ''} onValueChange={(value) => handleParamChange(param.name, value)} disabled={generating}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{param.options?.map(option => <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>)}</SelectContent></Select>}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button onClick={handleGenerateVideo} disabled={generating} size="lg" className="w-full"><Wand2 className="mr-2 h-5 w-5" /> Generate Video ({credits} Credits)</Button>
              {error && <p className="text-red-500 text-sm flex items-center"><Frown className="mr-2 h-4 w-4" />{error}</p>}
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Result
                <Badge variant={generating ? "secondary" : "default"}>
                  {generating ? "Generating..." : (videoUrl ? "Complete" : "Example")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16/9} className="bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {generating ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4">Rendering your masterpiece...</p>
                  </div>
                ) : videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-md" />
                ) : (
                  <video
                    src="/warrior.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="my-16" />
      <TipsSection tips={currentModelConfig.tips} />
    </div>
  );
}

export default function GeneratorPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-muted-foreground">Loading Model...</p></div>}>
            <GeneratorComponent />
        </Suspense>
    )
}