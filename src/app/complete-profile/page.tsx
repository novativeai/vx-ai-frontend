"use client";

import { useState } from 'react';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { COUNTRIES } from '@/lib/countries';

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
  phone: string;
  country: string;
  address: string;
  city: string;
  postCode: string;
}

interface FieldErrors {
  phone?: string;
  country?: string;
  address?: string;
  city?: string;
  postCode?: string;
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

export default function CompleteProfile() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    country: '',
    address: '',
    city: '',
    postCode: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    const formattedValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    const phoneError = validatePhone(formData.phone);
    const addressError = validateAddress(formData.address);
    const cityError = validateCity(formData.city);
    const postCodeError = validatePostCode(formData.postCode);
    const countryError = validateCountry(formData.country);

    if (phoneError) errors.phone = phoneError;
    if (addressError) errors.address = addressError;
    if (cityError) errors.city = cityError;
    if (postCodeError) errors.postCode = postCodeError;
    if (countryError) errors.country = countryError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      const { updateDoc } = await import('firebase/firestore');
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        phone: formData.phone,
        country: formData.country,
        address: formData.address,
        city: formData.city,
        postCode: formData.postCode,
        profileComplete: true,
      });

      toast.success('Profile completed!', 'Your billing details have been saved.');
      router.push('/');
    } catch {
      toast.error('Failed to save', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth is resolving
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  // If no user, they shouldn&apos;t be here
  if (!user) {
    router.push('/signin');
    return null;
  }

  // If profile is already complete, redirect home
  if (userProfile?.profileComplete) {
    router.push('/');
    return null;
  }

  const displayName = userProfile
    ? [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ')
    : user.displayName || '';

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background py-12">
      <div className="mx-auto max-w-md w-full px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
            {(displayName || user.email || 'U')[0].toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            {displayName ? `Welcome, ${displayName}!` : 'Welcome!'} Please provide your billing details to continue.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This information is used for invoices and billing purposes.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              disabled={isSubmitting}
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

          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={(e) => updateField('country', e.target.value)}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            className="w-full mt-6"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:no-underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:no-underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
