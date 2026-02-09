/**
 * Predefined marketplace categories.
 * Used in listing creation (create page) and sidebar filters.
 * Keep this list compact — consolidate similar concepts into one category.
 */
export const MARKETPLACE_CATEGORIES = [
  'Cinematic',
  'Nature',
  'Abstract',
  'Corporate',
  'Social Media',
  'Animation',
  'Lifestyle',
  'Technology',
  'Music & Audio',
  'Sports',
  'Food & Travel',
  'Fashion',
  'Education',
  'Horror & Thriller',
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export const MARKETPLACE_USE_CASES = [
  'YouTube Intro',
  'TikTok / Reels',
  'Ad Campaign',
  'Web Background',
  'Presentation',
  'Podcast Visual',
  'Product Demo',
  'Event Promo',
] as const;

export type MarketplaceUseCase = (typeof MARKETPLACE_USE_CASES)[number];
