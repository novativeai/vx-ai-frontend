import type { UserProfile } from '@/types/types';

/**
 * Single source of truth for profile completion check
 * Use this everywhere instead of duplicating logic
 */
export function isProfileComplete(profile: Partial<UserProfile> | null): boolean {
  if (!profile) return false;

  // Define mandatory fields in ONE place
  const mandatoryFields: (keyof UserProfile)[] = [
    'firstName',
    'lastName',
    'phone',
    'address',
    'city',
    'postCode',
    'country'
  ];

  // Check explicit flag first
  if (profile.profileComplete === true) {
    return true;
  }

  // Fall back to checking all mandatory fields
  return mandatoryFields.every(field => {
    const value = profile[field];
    return value !== undefined &&
           value !== null &&
           String(value).trim() !== '';
  });
}

/**
 * Get missing mandatory fields
 */
export function getMissingFields(profile: Partial<UserProfile> | null): string[] {
  if (!profile) return ['firstName', 'lastName', 'phone', 'address', 'city', 'postCode', 'country'];

  const mandatoryFields: (keyof UserProfile)[] = [
    'firstName', 'lastName', 'phone', 'address', 'city', 'postCode', 'country'
  ];

  return mandatoryFields.filter(field => {
    const value = profile[field];
    return !value || String(value).trim() === '';
  });
}
