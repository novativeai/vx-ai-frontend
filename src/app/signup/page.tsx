"use client";

import { useState, useRef, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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

// Country list for the dropdown
const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland',
  'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland',
  'Portugal', 'Poland', 'Czech Republic', 'Japan', 'South Korea',
  'Singapore', 'Hong Kong', 'New Zealand', 'Brazil', 'Mexico',
  'Argentina', 'Chile', 'Colombia', 'India', 'United Arab Emirates',
  'Saudi Arabia', 'Israel', 'South Africa', 'Other'
].sort();

// Phone number formatting helper
function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned.slice(0, 16);
  }
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  postCode: string;
  phone: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  city?: string;
  postCode?: string;
  phone?: string;
}

// Validation helpers
function validateFirstName(value: string): string | undefined {
  if (!value.trim()) return 'First name is required';
  if (value.trim().length < 2) return 'First name must be at least 2 characters';
  return undefined;
}

function validateLastName(value: string): string | undefined {
  if (!value.trim()) return 'Last name is required';
  if (value.trim().length < 2) return 'Last name must be at least 2 characters';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Please enter a valid email address';
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 128) return 'Password too long (max 128 characters)';

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return 'Password must contain uppercase, lowercase, and numbers';
  }

  const commonPasswords = ['password', '12345678', 'qwerty', 'admin123', 'password123'];
  if (commonPasswords.includes(value.toLowerCase())) {
    return 'This password is too common. Please choose a stronger one';
  }

  return undefined;
}

function validatePhone(value: string): string | undefined {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (!cleaned) return 'Phone number is required';
  if (cleaned.length < 10) return 'Please enter a valid phone number';
  return undefined;
}

function validateAddress(value: string): string | undefined {
  if (!value.trim()) return 'Street address is required';
  if (value.trim().length < 5) return 'Please enter a complete street address';
  return undefined;
}

function validateCity(value: string): string | undefined {
  if (!value.trim()) return 'City is required';
  if (value.trim().length < 2) return 'Please enter a valid city name';
  return undefined;
}

function validatePostCode(value: string): string | undefined {
  if (!value.trim()) return 'Post/ZIP code is required';
  if (value.trim().length < 3) return 'Please enter a valid post/ZIP code';
  return undefined;
}

function validateCountry(value: string): string | undefined {
  if (!value) return 'Please select your country';
  return undefined;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    postCode: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first name input on mount
  useEffect(() => {
    firstNameInputRef.current?.focus();
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    const formattedValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData, e?: React.FocusEvent) => {
    // Don't validate when clicking navigation links (Sign in link)
    const relatedTarget = e?.relatedTarget as HTMLElement | null;
    if (relatedTarget?.tagName === 'A') return;

    let error: string | undefined;
    switch (field) {
      case 'firstName': error = validateFirstName(formData.firstName); break;
      case 'lastName': error = validateLastName(formData.lastName); break;
      case 'email': error = validateEmail(formData.email); break;
      case 'password': error = validatePassword(formData.password); break;
      case 'phone': error = validatePhone(formData.phone); break;
      case 'address': error = validateAddress(formData.address); break;
      case 'city': error = validateCity(formData.city); break;
      case 'postCode': error = validatePostCode(formData.postCode); break;
      case 'country': error = validateCountry(formData.country); break;
    }
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    const firstNameError = validateFirstName(formData.firstName);
    const lastNameError = validateLastName(formData.lastName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const phoneError = validatePhone(formData.phone);
    const addressError = validateAddress(formData.address);
    const cityError = validateCity(formData.city);
    const postCodeError = validatePostCode(formData.postCode);
    const countryError = validateCountry(formData.country);

    if (firstNameError) errors.firstName = firstNameError;
    if (lastNameError) errors.lastName = lastNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (phoneError) errors.phone = phoneError;
    if (addressError) errors.address = addressError;
    if (cityError) errors.city = cityError;
    if (postCodeError) errors.postCode = postCodeError;
    if (countryError) errors.country = countryError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    let authSucceeded = false;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      authSucceeded = true;

      // Handle Firestore operations separately - don't fail signup if these fail
      try {
        const userDoc = await getUserDocWithRetry(user.uid);

        if (!userDoc.exists()) {
          // For Google sign-in, create user with profileComplete: false
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
        router.push('/onboarding');
      }
    } catch (err) {
      // Only show error if auth itself failed
      if (!authSucceeded) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
          // User closed popup or another popup opened - don't show error
        } else {
          toast.error('Sign up failed', (err as Error).message);
        }
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    let authSucceeded = false;

    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      authSucceeded = true;

      // Step 2: Handle email verification and Firestore separately
      try {
        await sendEmailVerification(user);
      } catch {
        // Email verification failed but continue - user can request again
      }

      try {
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          address: formData.address,
          city: formData.city,
          postCode: formData.postCode,
          phone: formData.phone,
          credits: 10,
          activePlan: "Starter",
          isAdmin: false,
          emailVerified: false,
          profileComplete: true,
          createdAt: new Date(),
        });
      } catch {
        // Firestore failed but auth succeeded - AuthContext will retry
      }

      setVerificationSent(true);
    } catch (err) {
      // Only show error for auth failures
      if (!authSucceeded) {
        const errorCode = (err as { code?: string }).code;
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('Sign up failed', 'An account with this email already exists.');
        } else if (errorCode === 'auth/weak-password') {
          toast.error('Sign up failed', 'Password is too weak. Please use a stronger password.');
        } else {
          toast.error('Sign up failed', (err as Error).message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="mx-auto max-w-md text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification email to <strong>{formData.email}</strong>.
            Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="space-y-4">
            <Button onClick={() => router.push('/signin')} className="w-full">
              Continue to Sign In
            </Button>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex items-center justify-center py-12 bg-background overflow-y-auto">
        <div className="mx-auto grid w-[400px] gap-6 px-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to get started
            </p>
          </div>

          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              aria-busy={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
              )}
              {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
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

            <form onSubmit={handleEmailSignUp} noValidate className="grid gap-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    ref={firstNameInputRef}
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    onBlur={(e) => handleBlur('firstName', e)}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                    className={fieldErrors.firstName ? 'border-red-500' : ''}
                  />
                  {fieldErrors.firstName && (
                    <p id="firstName-error" className="text-red-500 text-xs flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    onBlur={(e) => handleBlur('lastName', e)}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                    className={fieldErrors.lastName ? 'border-red-500' : ''}
                  />
                  {fieldErrors.lastName && (
                    <p id="lastName-error" className="text-red-500 text-xs flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  className={fieldErrors.email ? 'border-red-500' : ''}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    onBlur={(e) => handleBlur('password', e)}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'password-error' : 'password-help'}
                    className={`pr-10 ${fieldErrors.password ? 'border-red-500' : ''}`}
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
                {fieldErrors.password ? (
                  <p id="password-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p id="password-help" className="text-xs text-muted-foreground">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 (234) 567-8900"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  onBlur={(e) => handleBlur('phone', e)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  className={fieldErrors.phone ? 'border-red-500' : ''}
                />
                {fieldErrors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Country - moved up for better UX */}
              <div className="grid gap-2">
                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  onBlur={(e) => handleBlur('country', e)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.country}
                  aria-describedby={fieldErrors.country ? 'country-error' : undefined}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    fieldErrors.country ? 'border-red-500' : 'border-input'
                  }`}
                >
                  <option value="" disabled>Select your country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {fieldErrors.country && (
                  <p id="country-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.country}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Main Street, Apt 4B"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  onBlur={(e) => handleBlur('address', e)}
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.address}
                  aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                  className={fieldErrors.address ? 'border-red-500' : ''}
                />
                {fieldErrors.address && (
                  <p id="address-error" className="text-red-500 text-sm flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* City and Post Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    onBlur={(e) => handleBlur('city', e)}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.city}
                    aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                    className={fieldErrors.city ? 'border-red-500' : ''}
                  />
                  {fieldErrors.city && (
                    <p id="city-error" className="text-red-500 text-xs flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postCode">ZIP/Post Code <span className="text-red-500">*</span></Label>
                  <Input
                    id="postCode"
                    name="postCode"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="10001"
                    value={formData.postCode}
                    onChange={(e) => updateField('postCode', e.target.value)}
                    onBlur={(e) => handleBlur('postCode', e)}
                    disabled={isLoading}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.postCode}
                    aria-describedby={fieldErrors.postCode ? 'postCode-error' : undefined}
                    className={fieldErrors.postCode ? 'border-red-500' : ''}
                  />
                  {fieldErrors.postCode && (
                    <p id="postCode-error" className="text-red-500 text-xs flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {fieldErrors.postCode}
                    </p>
                  )}
                </div>
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:no-underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </Link>
          </div>

          <div className="text-center text-sm">
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
