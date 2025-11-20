"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  const getInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 flex items-center justify-center">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>
            <span>reelzila</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-neutral-300 transition-colors">{link.label}</Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              {user ? (
                 <Link href="/account" className="block">
                   {/* THE FIX: Conditional rendering for the user's profile picture */}
                   {user.photoURL ? (
                     <Image
                       src={user.photoURL}
                       alt="User profile picture"
                       width={32}
                       height={32}
                       className="h-8 w-8 rounded-full"
                     />
                   ) : (
                     <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                       {getInitial()}
                     </div>
                   )}
                 </Link>
              ) : (
                <Link href="/signin">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-black flex flex-col items-center justify-center text-center">
          <nav className="flex flex-col items-center space-y-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-3xl font-semibold hover:text-neutral-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-12">
            {user ? (
               <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                  <Button size="lg" variant="brand-solid">View Account</Button>
               </Link>
            ) : (
              <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                <Button size="lg" variant="brand-solid">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}