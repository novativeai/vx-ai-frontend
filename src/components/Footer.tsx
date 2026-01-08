// FILE: ./src/components/Footer.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
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
            {/* THE FIX: Updated links to point to real pages/sections */}
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-primary">Explore</Link></li>
              <li><Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary">Marketplace</Link></li>
              {!user && (
                <li><Link href="/signin" className="text-sm text-muted-foreground hover:text-primary">Sign In</Link></li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            {/* THE FIX: Updated links to point to real pages */}
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
                <Label htmlFor="newsletter-email" className="sr-only">
                  Email address for newsletter
                </Label>
                <Input
                  id="newsletter-email"
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
            © {new Date().getFullYear()} reelzila. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {/* Social links - TODO: Create these profiles */}
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

        <Separator className="my-8 bg-neutral-800" />

        {/* Company Information & Payment Methods */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Zephirix LTD</span> · Reg. No. 16828967
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              International House, 10, Beaufort Court, London, E14 9XL, United Kingdom
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground mr-2">We accept</span>
            {/* Visa Logo */}
            <svg className="h-8 w-auto" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
              <rect width="780" height="500" rx="40" fill="#1A1F71"/>
              <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7h-53.4zm220.2-190.9c-10.6-4-27.1-8.3-47.8-8.3-52.7 0-89.8 26.6-90.1 64.7-.3 28.2 26.5 43.9 46.8 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-31.9 19.2-21.4 0-32.7-3-50.3-10.3l-6.9-3.1-7.5 44c12.5 5.5 35.5 10.2 59.4 10.5 56.1 0 92.5-26.3 92.9-67 .2-22.3-14-39.3-44.8-53.3-18.6-9.1-30.1-15.1-30-24.3 0-8.1 9.7-16.8 30.6-16.8 17.4-.3 30.1 3.5 39.9 7.5l4.8 2.3 7.2-42.8zm137.3-4.8h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-79.2 179.5h56l11.2-29.4h68.4l6.5 29.4h49.4l-43.2-195.7zm-65.8 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47.1 12.4 57h-44.5v-.4zm-290.5-126.3l-52.3 133.4-5.6-27.2c-9.7-31.2-39.9-65.1-73.7-82l47.8 171.5h56.4l83.8-195.7h-56.4z" fill="#fff"/>
              <path d="M146.9 153l-.9 5.2c66.9 16.2 112.1 55.3 130.7 102.3l-18.8-90.6c-3.3-12.4-12.8-16.2-24.7-16.9h-86.3z" fill="#F9A533"/>
            </svg>
            {/* Mastercard Logo */}
            <svg className="h-8 w-auto" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
              <rect width="780" height="500" rx="40" fill="#16366F"/>
              <circle cx="312" cy="250" r="150" fill="#EB001B"/>
              <circle cx="468" cy="250" r="150" fill="#F79E1B"/>
              <path d="M390 130.7c-35.8 28.3-58.8 72.3-58.8 121.3s23 93 58.8 121.3c35.8-28.3 58.8-72.3 58.8-121.3s-23-93-58.8-121.3z" fill="#FF5F00"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}