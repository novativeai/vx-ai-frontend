"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, MapPin, Phone, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/lib/logger';

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

interface OnboardingFormData {
  phone: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
}

interface FieldErrors {
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  country?: string;
}

// Phone number formatting helper
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '');

  // If starts with +, keep it as international format
  if (cleaned.startsWith('+')) {
    return cleaned.slice(0, 16); // Max 15 digits + plus sign
  }

  // Otherwise, format as US number (xxx) xxx-xxxx
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// Validation helpers
function validatePhone(phone: string): string | undefined {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return 'Phone number is required';
  if (cleaned.length < 10) return 'Please enter a valid phone number';
  return undefined;
}

function validateAddress(address: string): string | undefined {
  if (!address.trim()) return 'Street address is required';
  if (address.trim().length < 5) return 'Please enter a complete street address';
  return undefined;
}

function validateCity(city: string): string | undefined {
  if (!city.trim()) return 'City is required';
  if (city.trim().length < 2) return 'Please enter a valid city name';
  return undefined;
}

function validatePostCode(postCode: string): string | undefined {
  if (!postCode.trim()) return 'Post/ZIP code is required';
  if (postCode.trim().length < 3) return 'Please enter a valid post/ZIP code';
  return undefined;
}

function validateCountry(country: string): string | undefined {
  if (!country) return 'Please select your country';
  return undefined;
}

export default function OnboardingPage() {
  const { user, userProfile, profileComplete, loading } = useAuth();
  const router = useRouter();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<OnboardingFormData>({
    phone: '',
    address: '',
    city: '',
    postCode: '',
    country: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Redirect if profile is already complete
  useEffect(() => {
    if (!loading && user && profileComplete) {
      router.push('/');
    }
  }, [profileComplete, loading, user, router]);

  // Pre-fill form with existing data if any
  useEffect(() => {
    if (userProfile) {
      setFormData({
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        postCode: userProfile.postCode || '',
        country: userProfile.country || '',
      });
    }
  }, [userProfile]);

  // Auto-focus on step change
  useEffect(() => {
    if (currentStep === 1) {
      phoneInputRef.current?.focus();
    } else if (currentStep === 2) {
      addressInputRef.current?.focus();
    }
  }, [currentStep]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateField = useCallback((field: keyof OnboardingFormData, value: string) => {
    const formattedValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    setGeneralError('');

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [fieldErrors]);

  const handleBlur = useCallback((field: keyof OnboardingFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate on blur
    let error: string | undefined;
    switch (field) {
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'address':
        error = validateAddress(formData.address);
        break;
      case 'city':
        error = validateCity(formData.city);
        break;
      case 'postCode':
        error = validatePostCode(formData.postCode);
        break;
      case 'country':
        error = validateCountry(formData.country);
        break;
    }

    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [formData]);

  const validateStep = (step: number): boolean => {
    const errors: FieldErrors = {};

    if (step === 1) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) errors.phone = phoneError;
    }

    if (step === 2) {
      const addressError = validateAddress(formData.address);
      const cityError = validateCity(formData.city);
      const postCodeError = validatePostCode(formData.postCode);
      const countryError = validateCountry(formData.country);

      if (addressError) errors.address = addressError;
      if (cityError) errors.city = cityError;
      if (postCodeError) errors.postCode = postCodeError;
      if (countryError) errors.country = countryError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setGeneralError('');
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!validateStep(2)) return;

    setIsSubmitting(true);
    setGeneralError('');

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postCode: formData.postCode.trim(),
        country: formData.country,
        profileComplete: true,
        updatedAt: new Date(),
      });

      // Move to success step
      setCurrentStep(3);

      // Redirect after delay with cleanup
      timeoutRef.current = setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (err) {
      logger.error('Error updating profile', err);
      setGeneralError('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4FF4F]" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" aria-hidden="true" />

      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#D4FF4F]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#D4FF4F]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">reelzila</h1>
        </div>

        {/* Progress indicator */}
        <nav aria-label="Onboarding progress" className="mb-8">
          <ol className="flex items-center gap-2">
            {[
              { step: 1, label: 'Contact Info' },
              { step: 2, label: 'Address' },
              { step: 3, label: 'Complete' }
            ].map(({ step, label }) => (
              <li key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-[#D4FF4F] text-black'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                  aria-current={currentStep === step ? 'step' : undefined}
                  aria-label={`Step ${step}: ${label}${currentStep > step ? ' (completed)' : currentStep === step ? ' (current)' : ''}`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step ? 'bg-[#D4FF4F]' : 'bg-neutral-800'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Card container */}
        <div className="w-full max-w-lg">
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Contact Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D4FF4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-[#D4FF4F]" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome, {userProfile?.firstName || 'there'}!</h2>
                    <p className="text-neutral-400">
                      Let&apos;s complete your profile to get started with reelzila.
                    </p>
                  </div>

                  {/* Show user info from Google */}
                  <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg" aria-label="Your account information">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-neutral-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm text-neutral-400">Signed in as</p>
                        <p className="font-medium">{userProfile?.email}</p>
                      </div>
                    </div>
                    {userProfile?.firstName && (
                      <p className="text-sm text-neutral-500 ml-8">
                        {userProfile.firstName} {userProfile.lastName}
                      </p>
                    )}
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} noValidate>
                    <fieldset>
                      <legend className="sr-only">Contact Information</legend>
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-sm font-medium mb-2 block"
                          >
                            Phone Number <span className="text-red-400" aria-label="required">*</span>
                          </Label>
                          <Input
                            ref={phoneInputRef}
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="+1 (234) 567-8900"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            onKeyDown={(e) => handleKeyDown(e, handleNext)}
                            aria-required="true"
                            aria-invalid={!!fieldErrors.phone}
                            aria-describedby={fieldErrors.phone ? 'phone-error' : 'phone-help'}
                            className={`bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 ${
                              fieldErrors.phone
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'focus:border-[#D4FF4F] focus:ring-[#D4FF4F]'
                            }`}
                          />
                          {fieldErrors.phone ? (
                            <p id="phone-error" className="text-red-400 text-sm mt-2 flex items-center gap-1" role="alert">
                              <AlertCircle className="w-4 h-4" aria-hidden="true" />
                              {fieldErrors.phone}
                            </p>
                          ) : (
                            <p id="phone-help" className="text-neutral-500 text-sm mt-2">
                              We&apos;ll only use this for account security and important updates.
                            </p>
                          )}
                        </div>
                      </div>
                    </fieldset>

                    {generalError && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          {generalError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full mt-6 bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90 font-semibold h-12 text-base"
                    >
                      Continue
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Address Info */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D4FF4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-[#D4FF4F]" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Billing Address</h2>
                    <p className="text-neutral-400">
                      Required for invoices and payment processing.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                    <fieldset>
                      <legend className="sr-only">Address Information</legend>
                      <div className="space-y-4">
                        {/* Country - First for better UX */}
                        <div>
                          <Label htmlFor="country" className="text-sm font-medium mb-2 block">
                            Country <span className="text-red-400" aria-label="required">*</span>
                          </Label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={(e) => updateField('country', e.target.value)}
                            onBlur={() => handleBlur('country')}
                            aria-required="true"
                            aria-invalid={!!fieldErrors.country}
                            aria-describedby={fieldErrors.country ? 'country-error' : undefined}
                            className={`w-full h-12 px-3 rounded-md bg-neutral-800/50 border text-white ${
                              fieldErrors.country
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-neutral-700 focus:border-[#D4FF4F] focus:ring-[#D4FF4F]'
                            } focus:outline-none focus:ring-2 focus:ring-offset-0`}
                          >
                            <option value="" disabled>Select your country</option>
                            {COUNTRIES.map(country => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                          {fieldErrors.country && (
                            <p id="country-error" className="text-red-400 text-sm mt-2 flex items-center gap-1" role="alert">
                              <AlertCircle className="w-4 h-4" aria-hidden="true" />
                              {fieldErrors.country}
                            </p>
                          )}
                        </div>

                        {/* Street Address */}
                        <div>
                          <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                            Street Address <span className="text-red-400" aria-label="required">*</span>
                          </Label>
                          <Input
                            ref={addressInputRef}
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="street-address"
                            placeholder="123 Main Street, Apt 4B"
                            value={formData.address}
                            onChange={(e) => updateField('address', e.target.value)}
                            onBlur={() => handleBlur('address')}
                            aria-required="true"
                            aria-invalid={!!fieldErrors.address}
                            aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                            className={`bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 ${
                              fieldErrors.address
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'focus:border-[#D4FF4F] focus:ring-[#D4FF4F]'
                            }`}
                          />
                          {fieldErrors.address && (
                            <p id="address-error" className="text-red-400 text-sm mt-2 flex items-center gap-1" role="alert">
                              <AlertCircle className="w-4 h-4" aria-hidden="true" />
                              {fieldErrors.address}
                            </p>
                          )}
                        </div>

                        {/* City and Post Code */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                              City <span className="text-red-400" aria-label="required">*</span>
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              type="text"
                              autoComplete="address-level2"
                              placeholder="New York"
                              value={formData.city}
                              onChange={(e) => updateField('city', e.target.value)}
                              onBlur={() => handleBlur('city')}
                              aria-required="true"
                              aria-invalid={!!fieldErrors.city}
                              aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                              className={`bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 ${
                                fieldErrors.city
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'focus:border-[#D4FF4F] focus:ring-[#D4FF4F]'
                              }`}
                            />
                            {fieldErrors.city && (
                              <p id="city-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                                {fieldErrors.city}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="postCode" className="text-sm font-medium mb-2 block">
                              ZIP/Post Code <span className="text-red-400" aria-label="required">*</span>
                            </Label>
                            <Input
                              id="postCode"
                              name="postCode"
                              type="text"
                              autoComplete="postal-code"
                              placeholder="10001"
                              value={formData.postCode}
                              onChange={(e) => updateField('postCode', e.target.value)}
                              onBlur={() => handleBlur('postCode')}
                              aria-required="true"
                              aria-invalid={!!fieldErrors.postCode}
                              aria-describedby={fieldErrors.postCode ? 'postcode-error' : undefined}
                              className={`bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 h-12 ${
                                fieldErrors.postCode
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : 'focus:border-[#D4FF4F] focus:ring-[#D4FF4F]'
                              }`}
                            />
                            {fieldErrors.postCode && (
                              <p id="postcode-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                                {fieldErrors.postCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {generalError && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          {generalError}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 border-neutral-700 text-white hover:bg-neutral-800 h-12 text-base"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90 font-semibold h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                            Saving...
                          </>
                        ) : (
                          'Complete Setup'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-20 h-20 bg-[#D4FF4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <Sparkles className="w-10 h-10 text-[#D4FF4F]" aria-hidden="true" />
                    </motion.div>
                  </div>

                  <h2 className="text-3xl font-bold mb-3">You&apos;re All Set!</h2>
                  <p className="text-neutral-400 mb-6">
                    Your profile is complete. Start creating amazing videos with AI.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4FF4F]/10 rounded-full text-[#D4FF4F] text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#D4FF4F] animate-pulse" aria-hidden="true" />
                    Redirecting to dashboard...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer text */}
          {currentStep < 3 && (
            <p className="text-center text-sm text-neutral-500 mt-6">
              Your information is secure and encrypted. We comply with GDPR and data protection regulations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
