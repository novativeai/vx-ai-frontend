// FILE: ./src/components/homepage/HomeFooterSection.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function HomeFooterSection() {
  const { user } = useAuth();

  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="container mx-auto py-24 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">

          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">reelzila</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming your text into stunning, high-definition videos with the power of AI.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-primary">Explore</Link></li>
              <li><Link href="/#model-gallery" className="text-sm text-muted-foreground hover:text-primary">Inspiration</Link></li>
              {!user && (
                <li><Link href="/signin" className="text-sm text-muted-foreground hover:text-primary">Sign In</Link></li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              <li><Link href="/refund" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h3 className="font-semibold text-foreground">Stay Updated</h3>
             <p className="text-sm text-muted-foreground mt-2 mb-4">Get the latest news on features and releases.</p>
             <form
               className="flex w-full max-w-sm items-center space-x-2"
               onSubmit={(e) => {
                 e.preventDefault();
                 // TODO: Handle newsletter submission
               }}
               aria-label="Newsletter signup"
             >
                <Label htmlFor="newsletter-email-home" className="sr-only">
                  Email address for newsletter
                </Label>
                <Input
                  id="newsletter-email-home"
                  type="email"
                  placeholder="Enter your email"
                  aria-required="true"
                  name="email"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-neutral-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} reelzila. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <span title="Coming soon" className="cursor-not-allowed">
              <Twitter className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
              <span className="sr-only">Twitter (Coming soon)</span>
            </span>
            <Link
              href="https://instagram.com/reelzila"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram (opens in new tab)"
            >
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true" />
            </Link>
            <span title="Coming soon" className="cursor-not-allowed">
              <Linkedin className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
              <span className="sr-only">LinkedIn (Coming soon)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
