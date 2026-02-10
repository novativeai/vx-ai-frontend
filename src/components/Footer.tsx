// FILE: ./src/components/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="container mx-auto py-24 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
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
              <li><Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary">Marketplace</Link></li>
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
                            <li><Link href="/refund" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter section - commented out for now
          <div className="space-y-4">
             <h3 className="font-semibold text-foreground">Stay Updated</h3>
             <p className="text-sm text-muted-foreground mb-3">Get the latest news on features and releases.</p>
             <form
               className="flex w-full items-center space-x-2"
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
                  className="text-sm"
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
          */}

          {/* Company Registration & Payment Methods */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-foreground">Registered Company</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Zephirix LTD</p>
              <p className="text-xs text-muted-foreground">Reg. No. 16828967</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                International House, 10, Beaufort Court, London, E14 9XL, United Kingdom
              </p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">We accept</p>
              <div className="flex items-center gap-2">
                {/* Visa Logo - reduced 15% */}
                <Image
                  src="/icons/visa-logo.webp"
                  alt="Visa"
                  width={37}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
                {/* Mastercard Logo */}
                <Image
                  src="/icons/mc-logo.png"
                  alt="Mastercard"
                  width={44}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
                {/* Separator */}
                <div className="h-5 w-px bg-neutral-700 mx-1" />
                {/* 3D Secure Badge */}
                <svg className="h-7 w-auto" viewBox="0 0 70 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="3D Secure">
                  <path d="M14 4C10 4 6 6.5 6 6.5V17C6 23 14 27 14 27C14 27 22 23 22 17V6.5C22 6.5 18 4 14 4Z" stroke="#22c55e" strokeWidth="1.8" fill="none"/>
                  <path d="M10 15L13 18L18 12" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="46" y="12" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">3D</text>
                  <text x="46" y="22" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontFamily="system-ui, sans-serif">Secure</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-neutral-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} reelzila. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://medium.com/@reelzila"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Medium"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/reelzila.studio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true" />
            </Link>
            <Link
              href="https://www.facebook.com/reelzila.studio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true" />
            </Link>
            <Link
              href="https://www.tiktok.com/@reelzila.studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true">
                <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}