import {
  sanitizeInput,
  sanitizePrompt,
  validatePrompt,
  validateEmail,
  validatePassword,
  validateName,
  validatePaymentAmount,
  validateUrl,
  validateFileSize,
  combineValidations,
} from '@/lib/validation';

describe('sanitizeInput', () => {
  it('removes script tags', () => {
    const input = '<script>alert("xss")</script>Hello';
    expect(sanitizeInput(input)).toBe('Hello');
  });

  it('escapes HTML entities', () => {
    const input = '<div>test</div>';
    expect(sanitizeInput(input)).toBe('&lt;div&gt;test&lt;/div&gt;');
  });

  it('removes event handlers', () => {
    const input = 'onclick=alert("xss")';
    expect(sanitizeInput(input)).toBe('alert("xss")');
  });

  it('removes javascript: protocol', () => {
    const input = 'javascript:alert(1)';
    expect(sanitizeInput(input)).toBe('alert(1)');
  });

  it('handles non-string input', () => {
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });
});

describe('sanitizePrompt', () => {
  it('removes script tags but preserves other content', () => {
    const input = '<script>alert("xss")</script>A beautiful sunset';
    expect(sanitizePrompt(input)).toBe('A beautiful sunset');
  });

  it('preserves normal text', () => {
    const input = 'A cinematic shot of a mountain range at golden hour';
    expect(sanitizePrompt(input)).toBe('A cinematic shot of a mountain range at golden hour');
  });
});

describe('validatePrompt', () => {
  it('returns valid for proper prompt', () => {
    const result = validatePrompt('A beautiful sunset over the ocean');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns error for empty prompt', () => {
    const result = validatePrompt('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Prompt is required');
  });

  it('returns error for whitespace-only prompt', () => {
    const result = validatePrompt('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Prompt is required');
  });

  it('returns error for too short prompt', () => {
    const result = validatePrompt('ab');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Prompt must be at least 3 characters');
  });

  it('returns error for too long prompt', () => {
    const result = validatePrompt('a'.repeat(5001));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Prompt is too long (max 5000 characters)');
  });
});

describe('validateEmail', () => {
  it('returns valid for proper email', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
  });

  it('returns error for empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it('returns error for invalid email format', () => {
    const result = validateEmail('invalid-email');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('returns error for email without domain', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });
});

describe('validatePassword', () => {
  it('returns valid for proper password', () => {
    const result = validatePassword('Password123');
    expect(result.valid).toBe(true);
  });

  it('returns error for empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password is required');
  });

  it('returns error for too short password', () => {
    const result = validatePassword('Pass1');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must be at least 8 characters');
  });

  it('returns error for password without letter', () => {
    const result = validatePassword('12345678');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must contain at least one letter');
  });

  it('returns error for password without number', () => {
    const result = validatePassword('PasswordOnly');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must contain at least one number');
  });
});

describe('validateName', () => {
  it('returns valid for proper name', () => {
    const result = validateName('John');
    expect(result.valid).toBe(true);
  });

  it('returns error for empty name', () => {
    const result = validateName('', 'First name');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('First name is required');
  });

  it('returns error for too short name', () => {
    const result = validateName('A');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name must be at least 2 characters');
  });

  it('allows hyphens and apostrophes', () => {
    expect(validateName("O'Connor").valid).toBe(true);
    expect(validateName('Mary-Jane').valid).toBe(true);
  });
});

describe('validatePaymentAmount', () => {
  it('returns valid for proper amount', () => {
    const result = validatePaymentAmount(50);
    expect(result.valid).toBe(true);
  });

  it('returns error for zero amount', () => {
    const result = validatePaymentAmount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Minimum payment is €1');
  });

  it('returns error for negative amount', () => {
    const result = validatePaymentAmount(-10);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Minimum payment is €1');
  });

  it('returns error for amount over max', () => {
    const result = validatePaymentAmount(1001);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Maximum payment is €1,000');
  });

  it('returns error for non-integer amount', () => {
    const result = validatePaymentAmount(10.5);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Payment amount must be a whole number');
  });
});

describe('validateUrl', () => {
  it('returns valid for https URL', () => {
    const result = validateUrl('https://example.com');
    expect(result.valid).toBe(true);
  });

  it('returns valid for http URL', () => {
    const result = validateUrl('http://example.com');
    expect(result.valid).toBe(true);
  });

  it('returns error for empty URL', () => {
    const result = validateUrl('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('URL is required');
  });

  it('returns error for invalid URL', () => {
    const result = validateUrl('not-a-url');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid URL');
  });
});

describe('validateFileSize', () => {
  it('returns valid for file under limit', () => {
    const result = validateFileSize(5 * 1024 * 1024, 10); // 5MB file, 10MB limit
    expect(result.valid).toBe(true);
  });

  it('returns error for file over limit', () => {
    const result = validateFileSize(15 * 1024 * 1024, 10); // 15MB file, 10MB limit
    expect(result.valid).toBe(false);
    expect(result.error).toBe('File size exceeds 10MB limit');
  });
});

describe('combineValidations', () => {
  it('returns valid when all pass', () => {
    const results = combineValidations(
      { valid: true },
      { valid: true },
      { valid: true }
    );
    expect(results.valid).toBe(true);
  });

  it('returns first error when one fails', () => {
    const results = combineValidations(
      { valid: true },
      { valid: false, error: 'First error' },
      { valid: false, error: 'Second error' }
    );
    expect(results.valid).toBe(false);
    expect(results.error).toBe('First error');
  });
});
