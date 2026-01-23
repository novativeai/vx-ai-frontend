import type { NextConfig } from "next";

// Security headers configuration
const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Enable XSS protection in older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Strict HSTS for HTTPS
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // Control browser features/APIs
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Content Security Policy
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts - allow self, inline for Next.js, and eval for development
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
      // Styles - allow self and inline for styled-components/tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images from various sources
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://lh3.googleusercontent.com https://replicate.delivery https://*.replicate.delivery https://fal.media https://*.fal.media https://cdn-images-1.medium.com https://miro.medium.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Connect to backend, Firebase, fal.ai, and rss2json for blog
      "connect-src 'self' https://aivideogenerator-production.up.railway.app https://*.firebaseio.com https://*.googleapis.com https://api.replicate.com wss://*.firebaseio.com https://fal.media https://*.fal.media https://api.rss2json.com",
      // Frames for Firebase auth
      "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
      // Media from Firebase storage and fal.ai
      "media-src 'self' blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://replicate.delivery https://*.replicate.delivery https://fal.media https://*.fal.media",
      // Form submissions
      "form-action 'self'",
      // Base URI
      "base-uri 'self'",
      // Object sources
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
      {
        protocol: 'https',
        hostname: '*.fal.media',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "framer-motion",
    ],
  },

  reactStrictMode: true,
  poweredByHeader: false,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
