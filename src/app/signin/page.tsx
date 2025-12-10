"use client";

import { useState, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New user - create profile with profileComplete: false
        await setDoc(userDocRef, {
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
        // Redirect to onboarding to complete mandatory fields
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
    } catch (err) {
      toast.error('Sign in failed', (err as Error).message);
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if profile is complete
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (isProfileComplete(userData)) {
          router.push('/');
        } else {
          router.push('/onboarding');
        }
      } else {
        // User exists in Auth but not in Firestore - create document
        await setDoc(userDocRef, {
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
        // Redirect to onboarding to complete profile
        router.push('/onboarding');
      }
    } catch {
      toast.error('Sign in failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      const error = validateEmail(email);
      setFieldErrors(prev => ({ ...prev, email: error }));
    } else {
      const error = validatePassword(password);
      setFieldErrors(prev => ({ ...prev, password: error }));
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
                  onBlur={() => handleBlur('email')}
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
                    onBlur={() => handleBlur('password')}
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