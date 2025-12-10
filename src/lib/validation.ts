/**
 * Input validation and sanitization utilities
 * Provides consistent validation across the application
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Sanitizes text input by removing potentially dangerous characters
 * Prevents XSS attacks and script injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove script tags and their content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Remove dangerous event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:/gi, '')
    // Escape HTML entities for basic protection
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Light sanitization that preserves most characters but removes scripts
 * Use for prompts and descriptions where we want to preserve formatting
 */
export function sanitizePrompt(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove script tags and their content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Remove dangerous event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validates a video generation prompt
 */
export function validatePrompt(prompt: string): ValidationResult {
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { valid: false, error: 'Prompt is required' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Prompt must be at least 3 characters' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Prompt is too long (max 5000 characters)' };
  }

  return { valid: true };
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email address is too long' };
  }

  return { valid: true };
}

/**
 * Validates a password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)' };
  }

  // Check for at least one letter and one number
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * Validates a name field (first name, last name, etc.)
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: `${fieldName} is too long (max 100 characters)` };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[\p{L}\s'-]+$/u.test(trimmed)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }

  return { valid: true };
}

/**
 * Validates a payment amount
 */
export function validatePaymentAmount(amount: number): ValidationResult {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return { valid: false, error: 'Payment amount is required' };
  }

  if (amount < 1) {
    return { valid: false, error: 'Minimum payment is €1' };
  }

  if (amount > 1000) {
    return { valid: false, error: 'Maximum payment is €1,000' };
  }

  if (!Number.isInteger(amount)) {
    return { valid: false, error: 'Payment amount must be a whole number' };
  }

  return { valid: true };
}

/**
 * Validates a URL
 */
export function validateUrl(url: string): ValidationResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Validates file size (in bytes)
 */
export function validateFileSize(
  sizeInBytes: number,
  maxSizeMB: number = 10
): ValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (sizeInBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validates file type against allowed types
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): ValidationResult {
  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validates image file for upload
 */
export function validateImageFile(file: File): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSizeMB = 10;

  const typeResult = validateFileType(file.type, allowedTypes);
  if (!typeResult.valid) {
    return typeResult;
  }

  return validateFileSize(file.size, maxSizeMB);
}

/**
 * Combines multiple validation results
 * Returns the first error found, or success if all pass
 */
export function combineValidations(
  ...results: ValidationResult[]
): ValidationResult {
  for (const result of results) {
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true };
}
