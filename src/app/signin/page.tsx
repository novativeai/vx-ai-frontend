"use client";

import { useState, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/Googleicon';
import { isProfileComplete } from '@/lib/profileUtils';
import { toast } from '@/hooks/use-toast';

// Helper to get user doc with retry for token propagation delay
async function getUserDocWithRetry(userId: string, maxRetries = 3, delayMs = 500) {
  const userDocRef = doc(db, "users", userId);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const userDoc = await getDoc(userDocRef);
      return userDoc;
    } catch (error: unknown) {
      const isPermissionError = error instanceof Error &&
        (error.message.includes('permission') || error.message.includes('Missing'));

      if (isPermissionError && attempt < maxRetries - 1) {
        // Wait for token to propagate and retry
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }

  // Final attempt without catching
  return await getDoc(userDocRef);
}

// Email validation helper
function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
}

// Password validation helper
function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  return undefined;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setFieldErrors({}); // Clear any existing field errors
    const provider = new GoogleAuthProvider();

    let authSucceeded = false;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      authSucceeded = true;

      // Handle Firestore operations separately - don't fail signin if these fail
      try {
        const userDoc = await getUserDocWithRetry(user.uid);

        if (!userDoc.exists()) {
          // New user - create profile with profileComplete: false
          const newUserDocRef = doc(db, "users", user.uid);
          await setDoc(newUserDocRef, {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            credits: 10,
            activePlan: "Starter",
            isAdmin: false,
            emailVerified: true,
            profileComplete: false,
            createdAt: new Date(),
          });
          router.push('/onboarding');
        } else {
          // Existing user - check if profile is complete
          const userData = userDoc.data();
          if (isProfileComplete(userData)) {
            router.push('/');
          } else {
            router.push('/onboarding');
          }
        }
      } catch {
        // Firestore failed but auth succeeded - AuthContext will handle state
        router.push('/');
      }
    } catch (err) {
      // Only show error if auth itself failed
      if (!authSucceeded) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/popup-closed-by-user') {
          // User closed the popup - don't show error
        } else if (errorCode === 'auth/cancelled-popup-request') {
          // Another popup was opened - don't show error
        } else {
          toast.error('Sign in failed', (err as Error).message);
        }
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFieldErrors({ email: emailError, password: passwordError });
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      // Step 1: Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Handle Firestore operations separately - don't fail signin if these fail
      // The AuthContext will handle the user state via onAuthStateChanged
      try {
        const userDoc = await getUserDocWithRetry(user.uid);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (isProfileComplete(userData)) {
            router.push('/');
          } else {
            router.push('/onboarding');
          }
        } else {
          // User exists in Auth but not in Firestore - create document
          const newUserDocRef = doc(db, "users", user.uid);
          await setDoc(newUserDocRef, {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            credits: 10,
            activePlan: "Starter",
            isAdmin: false,
            emailVerified: user.emailVerified,
            profileComplete: false,
            createdAt: new Date(),
          });
          router.push('/onboarding');
        }
      } catch {
        // Firestore operation failed but auth succeeded - just redirect
        // AuthContext will handle the user state
        router.push('/');
      }
    } catch (err) {
      // Only show error for actual authentication failures
      const errorCode = (err as { code?: string }).code;
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        toast.error('Sign in failed', 'Invalid email or password. Please try again.');
      } else if (errorCode === 'auth/too-many-requests') {
        toast.error('Too many attempts', 'Please try again later.');
      } else {
        toast.error('Sign in failed', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const clearFieldError = (field: 'email' | 'password') => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              aria-busy={isGoogleLoading}
              data-google-signin
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
              )}
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
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
            <form onSubmit={handleEmailSignIn} noValidate className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  className={fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline hover:no-underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    className={fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isGoogleLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right side with video background */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center p-10 text-center relative overflow-hidden bg-black">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          aria-label="Background demonstration of AI-generated video examples"
        >
          <source src="https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/full-reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center text-white mb-4">
            <h1 className="ml-4 text-8xl font-bold">reelzila</h1>
          </div>
          <p className="text-xl text-white/90 mt-2 max-w-md">
            A platform for filmmakers, advertisers & creative teams.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-2 gap-6 text-left max-w-md">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-white font-semibold">AI-Powered</h3>
              <p className="text-sm text-white/70">Create stunning videos with advanced AI models</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-semibold">Lightning Fast</h3>
              <p className="text-sm text-white/70">Generate videos in seconds, not hours</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-white font-semibold">Creative Freedom</h3>
              <p className="text-sm text-white/70">Multiple models for every style</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-white font-semibold">Pro Quality</h3>
              <p className="text-sm text-white/70">Professional-grade results every time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}