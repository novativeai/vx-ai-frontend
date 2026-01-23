# Masonry Layout System

A Pinterest-style CSS columns-based masonry layout for displaying mixed aspect ratio media (videos/images) in a mosaic grid.

## Overview

This layout uses CSS `columns` instead of CSS Grid or JavaScript-based solutions, providing:
- Native browser performance
- No layout shift or JavaScript calculations
- Automatic flow of items top-to-bottom, then left-to-right
- Mixed aspect ratios without cropping

## Quick Start

### Basic HTML Structure

```tsx
<div className="columns-2 gap-3 lg:columns-3" style={{ columnFill: 'balance' }}>
  {items.map((item) => (
    <div
      key={item.id}
      className="mb-3 overflow-hidden rounded-xl"
      style={{
        aspectRatio: getAspectRatio(item.type),
        breakInside: 'avoid',
      }}
    >
      {/* Your content */}
    </div>
  ))}
</div>
```

### Aspect Ratio Helper

```tsx
const getAspectRatio = (type: 'portrait' | 'landscape' | 'square'): string => {
  switch (type) {
    case 'portrait':  return '9 / 16';  // Tall (e.g., 1080x1920)
    case 'landscape': return '16 / 9';  // Wide (e.g., 1920x1080)
    case 'square':    return '1 / 1';   // Square (e.g., 1440x1440)
    default:          return '16 / 9';
  }
};
```

## Tailwind CSS Classes

| Class | Purpose |
|-------|---------|
| `columns-2` | 2 columns on mobile/tablet |
| `lg:columns-3` | 3 columns on desktop (1024px+) |
| `gap-3` | 12px gap between columns |
| `mb-3` | 12px margin between items vertically |
| `break-inside-avoid` | Prevents card from splitting across columns |

## Full Implementation

### 1. Container Component

```tsx
'use client';

import { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function MasonryGrid({
  children,
  columns = { sm: 2, lg: 3 },
  gap = 3,
}: MasonryGridProps) {
  // Build column classes dynamically
  const columnClasses = [
    columns.sm && `columns-${columns.sm}`,
    columns.md && `md:columns-${columns.md}`,
    columns.lg && `lg:columns-${columns.lg}`,
    columns.xl && `xl:columns-${columns.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`${columnClasses} gap-${gap}`}
      style={{ columnFill: 'balance' }}
    >
      {children}
    </div>
  );
}
```

### 2. Card Component

```tsx
'use client';

import { useRef } from 'react';

type AspectRatio = 'portrait' | 'landscape' | 'square';

interface MasonryCardProps {
  aspectRatio: AspectRatio;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const ASPECT_RATIOS: Record<AspectRatio, string> = {
  portrait: '9 / 16',
  landscape: '16 / 9',
  square: '1 / 1',
};

export function MasonryCard({
  aspectRatio,
  children,
  className = '',
  onClick,
}: MasonryCardProps) {
  return (
    <div
      className={`group relative mb-3 overflow-hidden rounded-xl bg-neutral-900 ${className}`}
      style={{
        aspectRatio: ASPECT_RATIOS[aspectRatio],
        breakInside: 'avoid',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

### 3. Video Card with Hover Play

```tsx
'use client';

import { useRef } from 'react';

interface VideoMasonryCardProps {
  src: string;
  poster: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export function VideoMasonryCard({
  src,
  poster,
  aspectRatio,
  title,
  subtitle,
  onClick,
}: VideoMasonryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'portrait':  return '9 / 16';
      case 'landscape': return '16 / 9';
      case 'square':    return '1 / 1';
      default:          return '16 / 9';
    }
  };

  return (
    <div
      className="group relative mb-3 cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
      style={{
        aspectRatio: getAspectRatio(),
        breakInside: 'avoid',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content on Hover */}
      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {title && (
              <h3 className="text-sm font-medium text-white md:text-base">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-white/50">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Border on Hover */}
      <div className="absolute inset-0 rounded-xl border border-white/0 transition-colors duration-300 group-hover:border-white/20" />
    </div>
  );
}
```

## Usage Example

```tsx
import { MasonryGrid, VideoMasonryCard } from '@/components/masonry';

const videos = [
  { id: '1', src: '/video1.mp4', poster: '/poster1.jpg', aspect: 'portrait', title: 'Video 1' },
  { id: '2', src: '/video2.mp4', poster: '/poster2.jpg', aspect: 'landscape', title: 'Video 2' },
  { id: '3', src: '/video3.mp4', poster: '/poster3.jpg', aspect: 'square', title: 'Video 3' },
  // ... more videos
];

export function Gallery() {
  return (
    <MasonryGrid columns={{ sm: 2, lg: 3, xl: 4 }} gap={3}>
      {videos.map((video) => (
        <VideoMasonryCard
          key={video.id}
          src={video.src}
          poster={video.poster}
          aspectRatio={video.aspect}
          title={video.title}
          onClick={() => console.log('Clicked:', video.id)}
        />
      ))}
    </MasonryGrid>
  );
}
```

## With Framer Motion (Animations)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<div className="columns-2 gap-3 lg:columns-3" style={{ columnFill: 'balance' }}>
  <AnimatePresence mode="popLayout">
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.02, 0.3) }}
        className="mb-3"
        style={{
          aspectRatio: getAspectRatio(item.aspect),
          breakInside: 'avoid',
        }}
      >
        {/* Content */}
      </motion.div>
    ))}
  </AnimatePresence>
</div>
```

## Shuffling Items (Optional)

For visual variety, shuffle items with a seeded random function:

```tsx
// Seeded random for consistent shuffling
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Usage with useMemo for performance
const shuffledItems = useMemo(() => {
  return shuffleWithSeed(items, 42); // Fixed seed for consistency
}, [items]);
```

## Key CSS Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `columns` | `2`, `3`, `4` | Number of columns |
| `column-fill` | `balance` | Distribute items evenly |
| `break-inside` | `avoid` | Prevent card splitting |
| `aspect-ratio` | `9/16`, `16/9`, `1/1` | Maintain media ratio |
| `object-fit` | `cover` | Fill container without distortion |

## Browser Support

- CSS Columns: All modern browsers
- `aspect-ratio`: Chrome 88+, Firefox 89+, Safari 15+
- `break-inside`: All modern browsers

## Tips

1. **Always use `break-inside: avoid`** - Prevents cards from being split across columns
2. **Use `mb-3` (or similar)** - Vertical gap between cards in the same column
3. **`columnFill: 'balance'`** - Distributes items more evenly across columns
4. **`object-cover`** - Ensures media fills the card without letterboxing
5. **Stagger animations** - Use `delay: index * 0.02` for a nice waterfall effect
