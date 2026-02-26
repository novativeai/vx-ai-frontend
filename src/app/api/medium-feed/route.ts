import { NextResponse } from 'next/server';

const MEDIUM_FEED_URL = 'https://medium.com/feed/@reelzila';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedFeed {
  articles: ParsedArticle[];
  timestamp: number;
}

interface ParsedArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  categories: string[];
}

let feedCache: CachedFeed | null = null;

function extractText(item: string, tag: string): string {
  // Handle CDATA sections and regular text
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const plainRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');

  const cdataMatch = item.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const plainMatch = item.match(plainRegex);
  if (plainMatch) return plainMatch[1].trim();

  return '';
}

function extractCategories(item: string): string[] {
  const categories: string[] = [];
  const regex = /<category[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi;
  let match;
  while ((match = regex.exec(item)) !== null) {
    categories.push(match[1].trim());
  }
  return categories;
}

function parseRss(xml: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const item = itemMatch[1];
    const description = extractText(item, 'description') || extractText(item, 'content:encoded');

    // Extract first image from description HTML
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    const thumbnail = imgMatch ? imgMatch[1] : '';

    articles.push({
      title: extractText(item, 'title'),
      pubDate: extractText(item, 'pubDate'),
      link: extractText(item, 'link'),
      guid: extractText(item, 'guid'),
      author: extractText(item, 'dc:creator') || extractText(item, 'creator'),
      thumbnail,
      description,
      categories: extractCategories(item),
    });
  }

  return articles;
}

export async function GET() {
  // Return cached data if still fresh
  if (feedCache && (Date.now() - feedCache.timestamp) < CACHE_TTL) {
    return NextResponse.json(
      { articles: feedCache.articles },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  }

  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml' },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Medium RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const articles = parseRss(xml);

    // Update cache
    feedCache = { articles, timestamp: Date.now() };

    return NextResponse.json(
      { articles },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Failed to fetch Medium feed:', error);

    // Return stale cache if available
    if (feedCache) {
      return NextResponse.json({ articles: feedCache.articles });
    }

    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 502 }
    );
  }
}
