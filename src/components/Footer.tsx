// FILE: ./src/components/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
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
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
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
                {/* 3D Secure Badge */}
                <svg className="h-7 w-auto" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="3D Secure">
                  <rect x="0.5" y="0.5" width="47" height="27" rx="3.5" fill="#fff" stroke="#e5e5e5"/>
                  <path d="M14 6C11.5 6 9 7.5 9 7.5V16C9 20 14 23 14 23C14 23 19 20 19 16V7.5C19 7.5 16.5 6 14 6Z" stroke="#1A1F71" strokeWidth="1.5" fill="none"/>
                  <path d="M11.5 14.5L13 16L16.5 12" stroke="#1A1F71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="33" y="12" textAnchor="middle" fill="#1A1F71" fontSize="6" fontWeight="600" fontFamily="system-ui, sans-serif">3D</text>
                  <text x="33" y="19" textAnchor="middle" fill="#666" fontSize="5" fontFamily="system-ui, sans-serif">Secure</text>
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

      </div>
    </footer>
  );
}