"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Film, Eye, EyeOff } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/Googleicon';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          credits: 10,
          activePlan: "Starter",
          isAdmin: false
        });
      }
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEmailSignUp = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        credits: 10,
        activePlan: "Starter",
        isAdmin: false
      });
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left side with video background */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center p-10 text-center relative overflow-hidden bg-black">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/full-reel.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center text-white mb-4">
            <h1 className="ml-4 text-8xl font-bold">reelzila</h1>
          </div>
          <p className="text-xl text-white/90 mt-2 max-w-md">
            A platform for filmakers, advertisers & creative teams.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-12 space-y-6 text-left max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Get 10 Free Credits</h3>
                <p className="text-sm text-white/70">Start creating immediately with your welcome bonus</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Multiple AI Models</h3>
                <p className="text-sm text-white/70">Access cutting-edge video generation technology</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Flexible Plans</h3>
                <p className="text-sm text-white/70">Choose the plan that fits your creative needs</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Easy to Use</h3>
                <p className="text-sm text-white/70">No technical skills required - just your imagination</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side with form */}
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to get started
            </p>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" onClick={handleEmailSignUp}>
              Create account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}