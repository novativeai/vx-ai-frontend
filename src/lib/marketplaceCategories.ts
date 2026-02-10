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

/**
 * Curated allowlist for the marketplace sidebar filters.
 * Only tags present in this set will appear in the sidebar.
 * Keeps the filter panel manageable (~40 items) by removing
 * repetitive / overly-niche tags from the 100+ in the database.
 * Matching is case-insensitive.
 */
export const MARKETPLACE_ALLOWED_TAGS: ReadonlySet<string> = new Set(
  [
    // ── Styles & Mood ──
    'Abstract',
    'Cinematic',
    'Colorful',
    'Dark',
    'Dramatic',
    'Dreamy',
    'Elegant',
    'Futuristic',
    'Minimalist',
    'Neon',
    'Retro',
    'Surreal',
    // ── Subjects & Themes ──
    'Aerial',
    'Animals',
    'Architecture',
    'Fire',
    'Landscape',
    'Nature',
    'Night',
    'People',
    'Space',
    'Sunset',
    'Underwater',
    'Urban',
    'Water',
    'Weather',
    // ── Industries & Verticals ──
    'Corporate',
    'Education',
    'Fashion',
    'Food & Travel',
    'Horror & Thriller',
    'Lifestyle',
    'Music & Audio',
    'Sci-Fi',
    'Social Media',
    'Sports',
    'Technology',
    // ── Techniques ──
    '3D Render',
    'Animation',
    'Motion Graphics',
    'Particle Effects',
    'Slow Motion',
    'Time-lapse',
  ].map(t => t.toLowerCase()),
);
