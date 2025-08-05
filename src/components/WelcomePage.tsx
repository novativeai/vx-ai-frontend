import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Zap, Film, Sparkles, ArrowRight } from 'lucide-react';
import { ModelGallery } from './ModelGallery';

export function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Create Breathtaking Video with AI
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                VX AI leverages the power of state-of-the-art AI models to transform your text prompts into stunning, high-definition videos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                   <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                   <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Instant Video Creation</h3>
                <p className="mt-2 text-muted-foreground">
                  No more complex software. Just type your idea and watch it come to life in seconds.
                </p>
              </div>
               <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                   <Film className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Unmatched Quality</h3>
                <p className="mt-2 text-muted-foreground">
                  Powered by the best models like Google&apos;s VEO-3 for cinematic quality, realism, and visual coherence.
                </p>
              </div>
               <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                   <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Simple Credit System</h3>
                <p className="mt-2 text-muted-foreground">
                  Start with 10 free credits. Generate videos as you go with a clear, straightforward system.
                </p>
              </div>
            </div>
          </div>
        </section>

          <ModelGallery/>


        {/* How It Works Section */}
        <section className="w-full py-16 md:pb-24 lg:pb-32 mb-32 bg-muted">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">From Prompt to Production in 3 Easy Steps</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">Our intuitive platform makes video creation accessible to everyone.</p>
                </div>
                <div className="mx-auto w-full max-w-5xl mt-8">
                   <div className="grid md:grid-cols-3 gap-8">
                       <Card>
                           <CardHeader>
                               <CardTitle className="flex items-center gap-2"><div className="rounded-full border border-primary w-8 h-8 flex items-center justify-center">1</div> Describe</CardTitle>
                           </CardHeader>
                           <CardContent>Write a detailed text prompt describing the video you envision.</CardContent>
                       </Card>
                       <Card>
                           <CardHeader>
                               <CardTitle className="flex items-center gap-2"><div className="rounded-full border border-primary w-8 h-8 flex items-center justify-center">2</div> Generate</CardTitle>
                           </CardHeader>
                           <CardContent>Our AI analyzes your prompt and renders your video in moments.</CardContent>
                       </Card>
                       <Card>
                           <CardHeader>
                               <CardTitle className="flex items-center gap-2"><div className="rounded-full border border-primary w-8 h-8 flex items-center justify-center">3</div> Download</CardTitle>
                           </CardHeader>
                           <CardContent>Review your creation, save it to your gallery, and use it anywhere.</CardContent>
                       </Card>
                   </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}