/**
 * Comprehensive unit tests for the calculateCredits function.
 * Tests all models, parameter variations, and edge cases.
 */
import { calculateCredits, modelConfigs } from '@/lib/modelConfigs';

describe('calculateCredits', () => {
  describe('All models with default parameters', () => {
    it('should return 10 credits for Kling 2.5 with 5-second duration', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: '5' });
      expect(result).toBe(10);
    });

    it('should return 10 credits for Kling 2.5 with no duration specified', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, {});
      expect(result).toBe(10); // Base credits
    });

    it('should return 100 credits for VEO 3.1 with 8-second duration', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, { duration: '8' });
      expect(result).toBe(100);
    });

    it('should return 100 credits for VEO 3.1 with no duration specified', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, {});
      expect(result).toBe(100); // Base credits
    });

    it('should return 10 credits for Seedance 1 Pro with 480p resolution', () => {
      const config = modelConfigs['seedance-1-pro'];
      const result = calculateCredits(config, { resolution: '480p' });
      expect(result).toBe(10);
    });

    it('should return 10 credits for Seedance 1 Pro with no resolution specified', () => {
      const config = modelConfigs['seedance-1-pro'];
      const result = calculateCredits(config, {});
      expect(result).toBe(10); // Base credits
    });

    it('should return 3 credits for WAN 2.2 with 480p resolution', () => {
      const config = modelConfigs['wan-2.2'];
      const result = calculateCredits(config, { resolution: '480p' });
      expect(result).toBe(3);
    });

    it('should return 3 credits for WAN 2.2 with no resolution specified', () => {
      const config = modelConfigs['wan-2.2'];
      const result = calculateCredits(config, {});
      expect(result).toBe(3); // Base credits
    });

    it('should return 2 credits for FLUX 1.1 Pro Ultra (fixed price)', () => {
      const config = modelConfigs['flux-1.1-pro-ultra'];
      const result = calculateCredits(config, {});
      expect(result).toBe(2);
    });

    it('should return 2 credits for FLUX 1.1 Pro Ultra with irrelevant params', () => {
      const config = modelConfigs['flux-1.1-pro-ultra'];
      const result = calculateCredits(config, {
        aspect_ratio: '16:9',
        output_format: 'jpg',
        raw: 'false',
      });
      expect(result).toBe(2); // Fixed price regardless of params
    });
  });

  describe('Kling 2.5 duration variations', () => {
    it('should return 10 credits for 5-second duration', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: '5' });
      expect(result).toBe(10);
    });

    it('should return 20 credits for 10-second duration', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: '10' });
      expect(result).toBe(20);
    });
  });

  describe('VEO 3.1 duration variations', () => {
    it('should return 50 credits for 4-second duration', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, { duration: '4' });
      expect(result).toBe(50);
    });

    it('should return 75 credits for 6-second duration', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, { duration: '6' });
      expect(result).toBe(75);
    });

    it('should return 100 credits for 8-second duration', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, { duration: '8' });
      expect(result).toBe(100);
    });
  });

  describe('Seedance 1 Pro resolution variations', () => {
    it('should return 10 credits for 480p resolution', () => {
      const config = modelConfigs['seedance-1-pro'];
      const result = calculateCredits(config, { resolution: '480p' });
      expect(result).toBe(10);
    });

    it('should return 15 credits for 720p resolution', () => {
      const config = modelConfigs['seedance-1-pro'];
      const result = calculateCredits(config, { resolution: '720p' });
      expect(result).toBe(15);
    });

    it('should return 20 credits for 1080p resolution', () => {
      const config = modelConfigs['seedance-1-pro'];
      const result = calculateCredits(config, { resolution: '1080p' });
      expect(result).toBe(20);
    });
  });

  describe('WAN 2.2 resolution variations', () => {
    it('should return 3 credits for 480p resolution', () => {
      const config = modelConfigs['wan-2.2'];
      const result = calculateCredits(config, { resolution: '480p' });
      expect(result).toBe(3);
    });

    it('should return 5 credits for 720p resolution', () => {
      const config = modelConfigs['wan-2.2'];
      const result = calculateCredits(config, { resolution: '720p' });
      expect(result).toBe(5);
    });
  });

  describe('Edge cases with null/undefined params', () => {
    it('should use base credits when param value is null', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: null });
      expect(result).toBe(10); // Base credits
    });

    it('should use base credits when param value is undefined', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: undefined as unknown as string });
      expect(result).toBe(10); // Base credits
    });

    it('should handle empty params object', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, {});
      expect(result).toBe(10); // Base credits
    });
  });

  describe('Edge cases with unknown values', () => {
    it('should use base credits for unknown duration value', () => {
      const config = modelConfigs['kling-2.5'];
      // Kling 2.5 only supports "5" and "10" for duration
      const result = calculateCredits(config, { duration: '15' });
      expect(result).toBe(10); // Falls back to base credits
    });

    it('should use base credits for unknown resolution value', () => {
      const config = modelConfigs['seedance-1-pro'];
      // Seedance only supports 480p, 720p, 1080p
      const result = calculateCredits(config, { resolution: '4K' });
      expect(result).toBe(10); // Falls back to base credits
    });

    it('should handle numeric param values (converted to string)', () => {
      const config = modelConfigs['veo-3.1'];
      const result = calculateCredits(config, { duration: 8 as unknown as string });
      // Should work via string conversion in modifier comparison
      expect(result).toBe(100);
    });
  });

  describe('Extra irrelevant parameters', () => {
    it('should ignore extra parameters not in modifiers', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, {
        duration: '5',
        prompt: 'A beautiful sunset',
        negative_prompt: 'blur',
        aspect_ratio: '16:9',
        random_param: 'value',
      });
      expect(result).toBe(10);
    });
  });

  describe('Result validation', () => {
    it('should always return an integer', () => {
      const config = modelConfigs['kling-2.5'];
      const result = calculateCredits(config, { duration: '5' });
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should always return a non-negative value', () => {
      Object.keys(modelConfigs).forEach((modelId) => {
        const config = modelConfigs[modelId];
        const result = calculateCredits(config, {});
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Model config structure validation', () => {
    it('should have creditPricing.base for all models', () => {
      Object.keys(modelConfigs).forEach((modelId) => {
        const config = modelConfigs[modelId];
        expect(config.creditPricing).toBeDefined();
        expect(config.creditPricing.base).toBeDefined();
        expect(typeof config.creditPricing.base).toBe('number');
        expect(config.creditPricing.base).toBeGreaterThan(0);
      });
    });

    it('should have valid modifier structure when modifiers exist', () => {
      Object.keys(modelConfigs).forEach((modelId) => {
        const config = modelConfigs[modelId];
        if (config.creditPricing.modifiers) {
          config.creditPricing.modifiers.forEach((modifier) => {
            expect(modifier.param).toBeDefined();
            expect(typeof modifier.param).toBe('string');
            expect(modifier.values).toBeDefined();
            expect(typeof modifier.values).toBe('object');
            expect(modifier.type).toBeDefined();
            expect(['set', 'add', 'multiply']).toContain(modifier.type);
          });
        }
      });
    });
  });

  describe('Pricing consistency with backend', () => {
    it('should match Kling 2.5 pricing config', () => {
      const config = modelConfigs['kling-2.5'];
      expect(config.creditPricing.base).toBe(10);
      expect(config.creditPricing.modifiers).toHaveLength(1);
      expect(config.creditPricing.modifiers![0].param).toBe('duration');
      expect(config.creditPricing.modifiers![0].values).toEqual({ '5': 10, '10': 20 });
    });

    it('should match VEO 3.1 pricing config', () => {
      const config = modelConfigs['veo-3.1'];
      expect(config.creditPricing.base).toBe(100);
      expect(config.creditPricing.modifiers).toHaveLength(1);
      expect(config.creditPricing.modifiers![0].param).toBe('duration');
      expect(config.creditPricing.modifiers![0].values).toEqual({ '4': 50, '6': 75, '8': 100 });
    });

    it('should match Seedance 1 Pro pricing config', () => {
      const config = modelConfigs['seedance-1-pro'];
      expect(config.creditPricing.base).toBe(10);
      expect(config.creditPricing.modifiers).toHaveLength(1);
      expect(config.creditPricing.modifiers![0].param).toBe('resolution');
      expect(config.creditPricing.modifiers![0].values).toEqual({ '480p': 10, '720p': 15, '1080p': 20 });
    });

    it('should match WAN 2.2 pricing config', () => {
      const config = modelConfigs['wan-2.2'];
      expect(config.creditPricing.base).toBe(3);
      expect(config.creditPricing.modifiers).toHaveLength(1);
      expect(config.creditPricing.modifiers![0].param).toBe('resolution');
      expect(config.creditPricing.modifiers![0].values).toEqual({ '480p': 3, '720p': 5 });
    });

    it('should match FLUX 1.1 Pro Ultra pricing config (no modifiers)', () => {
      const config = modelConfigs['flux-1.1-pro-ultra'];
      expect(config.creditPricing.base).toBe(2);
      expect(config.creditPricing.modifiers).toBeUndefined();
    });
  });
});
