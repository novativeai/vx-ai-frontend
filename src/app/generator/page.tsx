"use client";

import { useState, Suspense, useEffect, ChangeEvent, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { modelConfigs, calculateCredits } from '@/lib/modelConfigs';

// Shadcn UI Component Imports
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

// Lucide React Icon Imports
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Number of parameters to show before "Advanced Settings"
const PRIMARY_PARAMS_COUNT = 3;

// Define the possible types for parameters state
type ParamValues = string | number | null;
// Define the possible types for the output media
type OutputType = 'video' | 'image' | null;

/**
 * Helper function to determine if the output is a video or image based on the URL extension.
 * @param url The URL of the generated media.
 * @returns 'video', 'image', or null if the type is unknown.
 */
const getOutputTypeFromUrl = (url: string): OutputType => {
  if (!url) return null;
  // Use URL constructor for robust parsing, even with query parameters
  const pathname = new URL(url).pathname;
  const extension = pathname.split('.').pop()?.toLowerCase();
  
  if (extension === 'mp4') return 'video';
  if (['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(extension || '')) return 'image';
  
  // Fallback if no known extension is found
  return null;
};

function GeneratorComponent() {
  const { user, credits } = useAuth();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('model') || 'veo-3.1';

  // Memoize model config
  const currentModelConfig = useMemo(
    () => modelConfigs[modelId],
    [modelId]
  );

  // State Management
  const [params, setParams] = useState<{[key: string]: ParamValues}>({});
  const [outputUrl, setOutputUrl] = useState('');
  const [detectedOutputType, setDetectedOutputType] = useState<OutputType>(null);
  const [generating, setGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Video preview state
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(16/9);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exampleVideoRef = useRef<HTMLVideoElement>(null);

  // New state for toggling between Best Practice and Use Cases
  const [contentView, setContentView] = useState<'tips' | 'useCases'>('tips');

  // State for showing advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate credits dynamically based on selected parameters
  const calculatedCredits = useMemo(() => {
    if (!currentModelConfig) return 0;
    return calculateCredits(currentModelConfig, params);
  }, [currentModelConfig, params]);

  // Effect to reset state when the model is changed via URL
  useEffect(() => {
    if (!currentModelConfig) return;
    const defaultParams: {[key: string]: ParamValues} = {};
    currentModelConfig.params.forEach(param => { defaultParams[param.name] = param.defaultValue; });
    setParams(defaultParams);

    // Reset all outputs and previews
    setImagePreview(null);
    setOutputUrl('');
    setGenerating(false);
    setDetectedOutputType(null);
    setGenerationError(null);

    // Reset video state
    setVideoAspectRatio(16/9);
    setIsMuted(true);
    setHasAudio(false);

    // Reset content view to tips when model changes
    setContentView('tips');
  }, [currentModelConfig]);

  // Handler for video metadata loaded - detect aspect ratio and audio
  const handleVideoMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement>, isExample: boolean = false) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      setVideoAspectRatio(video.videoWidth / video.videoHeight);
    }

    // Check if video has audio tracks
    // For generated videos, assume they might have audio
    // For example videos, check the audio tracks or assume based on model
    if (!isExample) {
      // Generated video - check for audio tracks if available
      const hasAudioTrack = (video as HTMLVideoElement & { mozHasAudio?: boolean; webkitAudioDecodedByteCount?: number; audioTracks?: { length: number } }).mozHasAudio ||
        Boolean((video as HTMLVideoElement & { webkitAudioDecodedByteCount?: number }).webkitAudioDecodedByteCount) ||
        Boolean((video as HTMLVideoElement & { audioTracks?: { length: number } }).audioTracks?.length);
      setHasAudio(hasAudioTrack || true); // Default to showing audio control for generated videos
    } else {
      // Example video - check model config for audio capability
      setHasAudio(currentModelConfig?.tags?.includes('audio') || false);
    }
  }, [currentModelConfig]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
    if (exampleVideoRef.current) {
      exampleVideoRef.current.muted = !exampleVideoRef.current.muted;
    }
  }, []);

  // Memoize event handlers
  const handleParamChange = useCallback((name: string, value: string | number) => {
    setParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
  }, [handleParamChange]);

  const handleGenerate = useCallback(async () => {
    if (!user) {
      toast.error('Sign in required', 'Please sign in to generate videos');
      return;
    }

    if (credits < calculatedCredits) {
      toast.error('Insufficient credits', `This generation requires ${calculatedCredits} credits. You have ${credits} credits.`);
      return;
    }
    setGenerating(true);
    setOutputUrl('');
    setDetectedOutputType(null);
    setGenerationError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-video`
        : 'http://localhost:8000/generate-video';

      console.log('[Generation] Starting request to:', apiUrl, { model_id: modelId, params: { ...params, image: params.image ? '[base64 data]' : undefined } });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, model_id: modelId, params }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
        console.error('[Generation] API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          model_id: modelId,
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('[Generation] Success:', { output_urls: data.output_urls });

      if (data.output_urls && Array.isArray(data.output_urls) && data.output_urls.length > 0) {
        const newUrl = data.output_urls[0];
        setOutputUrl(newUrl);
        // Detect and set the output type from the resulting URL
        setDetectedOutputType(getOutputTypeFromUrl(newUrl));
      } else {
        throw new Error("The model did not return a valid output.");
      }
      // NOTE: Credit deduction is handled by the backend using atomic Firestore transactions.
      // The real-time Firestore listener in AuthContext will automatically update the
      // credits state when the database changes, ensuring the frontend always shows
      // the accurate balance from the database.
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('[Generation] Failed:', {
        error: err,
        message: errorMessage,
        model_id: modelId,
        timestamp: new Date().toISOString(),
      });
      setGenerationError(errorMessage);
      toast.error('Generation failed', errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [user, credits, modelId, params, currentModelConfig, calculatedCredits]);

  if (!currentModelConfig) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500">Error: Model Configuration Not Found</h2>
      </div>
    );
  }

  // Determine which content to display based on contentView
  const displayContent = contentView === 'tips' ? currentModelConfig.tips : currentModelConfig.useCases;
  const hasContent = displayContent && displayContent.length > 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:py-24">
      <section className="text-center w-full mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
          What do you want to create today?
        </h1>
        <h3 className="text-gray-500 tracking-tight flex items-center justify-center gap-3">
          What do you want to create today?
        </h3>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card className="sticky top-20 bg-black-500 border-black">
            <CardHeader><CardTitle className="text-2xl font-bold">Input Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Parameters - always visible */}
              {currentModelConfig.params.slice(0, PRIMARY_PARAMS_COUNT).map(param => (
                <div key={param.name} className="grid w-full items-center gap-2">
                  <Label htmlFor={param.name} className="font-semibold">{param.label}</Label>
                  {param.type === 'textarea' && <Textarea id={param.name} value={params[param.name] as string || ''} onChange={(e) => handleParamChange(param.name, e.target.value)} rows={5} disabled={generating} />}
                  {param.type === 'slider' && <div className="flex items-center gap-4 pt-1"><Slider id={param.name} value={[params[param.name] as number || 0]} onValueChange={([value]) => handleParamChange(param.name, value)} min={param.min} max={param.max} step={param.step} disabled={generating} /><span className="font-mono text-sm w-12 text-center rounded-md border p-2">{params[param.name] as number}</span></div>}
                  {param.type === 'image' && <div className='grid gap-3'><Input id={param.name} type="file" onChange={handleImageChange} accept="image/*" disabled={generating} />{imagePreview && <AspectRatio ratio={16 / 9} className="bg-muted rounded-md border"><Image src={imagePreview} alt="Image preview" fill className="object-contain rounded-md" /></AspectRatio>}</div>}
                  {param.type === 'dropdown' && <Select value={params[param.name] as string || ''} onValueChange={(value) => handleParamChange(param.name, value)} disabled={generating}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{param.options?.map(option => <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>)}</SelectContent></Select>}
                </div>
              ))}

              {/* Advanced Settings Toggle - only show if there are more parameters */}
              {currentModelConfig.params.length > PRIMARY_PARAMS_COUNT && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
                    <span className="font-medium">Advanced Settings</span>
                    <span className="text-xs">({currentModelConfig.params.length - PRIMARY_PARAMS_COUNT} more)</span>
                  </button>

                  {/* Advanced Parameters - conditionally visible */}
                  {showAdvanced && (
                    <div className="space-y-6 pt-2 border-t border-border">
                      {currentModelConfig.params.slice(PRIMARY_PARAMS_COUNT).map(param => (
                        <div key={param.name} className="grid w-full items-center gap-2">
                          <Label htmlFor={param.name} className="font-semibold">{param.label}</Label>
                          {param.type === 'textarea' && <Textarea id={param.name} value={params[param.name] as string || ''} onChange={(e) => handleParamChange(param.name, e.target.value)} rows={5} disabled={generating} />}
                          {param.type === 'slider' && <div className="flex items-center gap-4 pt-1"><Slider id={param.name} value={[params[param.name] as number || 0]} onValueChange={([value]) => handleParamChange(param.name, value)} min={param.min} max={param.max} step={param.step} disabled={generating} /><span className="font-mono text-sm w-12 text-center rounded-md border p-2">{params[param.name] as number}</span></div>}
                          {param.type === 'image' && <div className='grid gap-3'><Input id={param.name} type="file" onChange={handleImageChange} accept="image/*" disabled={generating} />{imagePreview && <AspectRatio ratio={16 / 9} className="bg-muted rounded-md border"><Image src={imagePreview} alt="Image preview" fill className="object-contain rounded-md" /></AspectRatio>}</div>}
                          {param.type === 'dropdown' && <Select value={params[param.name] as string || ''} onValueChange={(value) => handleParamChange(param.name, value)} disabled={generating}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{param.options?.map(option => <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>)}</SelectContent></Select>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button onClick={handleGenerate} disabled={generating || credits < calculatedCredits} size="lg" className="w-full">
                 Generate Media ({calculatedCredits} Credits)
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className='bg-black-500'>
            <CardHeader >
              <CardTitle className="flex justify-between items-center">
                Result
                <Badge variant={generating ? "secondary" : generationError ? "destructive" : "default"}>
                  {generating ? "Generating..." : generationError ? "Error" : (outputUrl ? "Complete" : "Example")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Error display */}
              {generationError && !generating && (
                <div className="w-full p-4 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-1">Generation Failed</p>
                  <p className="text-sm text-destructive/80 break-words">{generationError}</p>
                </div>
              )}
              <div
                className="relative w-full h-[500px] lg:h-[600px] bg-black rounded-md flex items-center justify-center overflow-hidden transition-all duration-300"
              >
                {generating ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4">Rendering your masterpiece...</p>
                  </div>
                ) : outputUrl ? (
                  <>
                    {detectedOutputType === 'video' && (
                      <video
                        ref={videoRef}
                        src={outputUrl}
                        controls
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => handleVideoMetadata(e, false)}
                        className="w-full h-full object-contain"
                      />
                    )}
                    {detectedOutputType === 'image' && (
                      <Image src={outputUrl} alt="Generated result" fill className="object-contain rounded-md" />
                    )}
                    {detectedOutputType === null && (
                      <video
                        ref={videoRef}
                        src={outputUrl}
                        controls
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        onLoadedMetadata={(e) => handleVideoMetadata(e, false)}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </>
                ) : currentModelConfig.exampleImage ? (
                  <Image
                    src={currentModelConfig.exampleImage}
                    alt={`${currentModelConfig.displayName} example`}
                    fill
                    className="object-contain"
                  />
                ) : currentModelConfig.exampleVideo ? (
                  <video
                    ref={exampleVideoRef}
                    src={currentModelConfig.exampleVideo}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onLoadedMetadata={(e) => handleVideoMetadata(e, true)}
                    className="w-full h-full object-contain"
                  />
                ) : null}

                {/* Sound toggle button - only show for videos with audio */}
                {!generating && hasAudio && (detectedOutputType === 'video' || !outputUrl) && (
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="my-16" />
      

      {/* Display selected content */}
      {hasContent ? (
        <TipsSection tips={displayContent} />
      ) : (
        <div className="text-center text-muted-foreground p-8">
          <p>No {contentView === 'tips' ? 'best practices' : 'use cases'} available for this model.</p>
        </div>
      )}
            {/* Toggle Buttons for Best Practice and Use Cases */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={contentView === 'tips' ? 'default' : 'outline'}
          onClick={() => setContentView('tips')}
          size="lg"
        >
          Best Practice
        </Button>
        <Button
          variant={contentView === 'useCases' ? 'default' : 'outline'}
          onClick={() => setContentView('useCases')}
          size="lg"
        >
          Use Cases
        </Button>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
    return (
        <Suspense fallback={
          <div className="container mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Model...</p>
          </div>
        }>
            <GeneratorComponent />
        </Suspense>
    )
}