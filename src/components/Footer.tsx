// FILE: ./src/components/Footer.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface MediumArticle {
  title: string;
  link: string;
}

function useMediumArticles() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  useEffect(() => {
    fetch('/api/medium-feed')
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          setArticles(data.articles.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);
  return articles;
}

export default function Footer() {
  const { user } = useAuth();
  const articles = useMediumArticles();

  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="container mx-auto py-24 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

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
            <h3 className="font-semibold text-foreground">Blog</h3>
            <ul className="space-y-2">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <li key={article.link}>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary line-clamp-1"
                    >
                      {article.title}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <a
                    href="https://medium.com/@reelzila"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    Read on Medium <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              )}
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
              aria-label="Read our blog on Medium"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-muted-foreground hover:text-primary" aria-hidden="true">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}