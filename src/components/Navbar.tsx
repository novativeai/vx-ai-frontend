"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { Film, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { user, credits, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between pl-4 md:pl-62">
        
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="font-bold">VX AI</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Badge variant="outline" className="hidden sm:inline-flex">Credits: {credits}</Badge>
                  <Link href="/pricing">
                    <Button size="sm">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Credits
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => auth.signOut()}>
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin">
                    <Button variant="ghost">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}