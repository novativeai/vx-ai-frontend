"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Calendar, Clock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediumArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  categories: string[];
}

interface MediumFeed {
  status: string;
  feed: {
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: MediumArticle[];
}

// Extract first image from HTML content (Medium embeds images in description)
function extractImageFromHtml(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

// Strip HTML tags and truncate text
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function truncateText(text: string, maxLength: number): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + "...";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(description: string): number {
  const wordCount = stripHtml(description).split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute
}

export default function BlogPage() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@reelzila`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data: MediumFeed = await response.json();

      if (data.status !== "ok") {
        throw new Error("Invalid feed response");
      }

      setArticles(data.items);
    } catch (err) {
      console.error("Error fetching Medium articles:", err);
      setError("Unable to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 mb-8">
            <BookOpen className="w-10 h-10 text-[#D4FF4F]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            Blog
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Tips, tutorials, and the latest updates about AI video generation from the Reelzila team.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4FF4F] mb-4" />
            <p className="text-neutral-400">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-md">
              <p className="text-neutral-400 mb-4">{error}</p>
              <Button
                onClick={fetchArticles}
                className="bg-[#D4FF4F] text-black hover:bg-[#c4ef3f]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center max-w-md">
              <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No articles yet</h2>
              <p className="text-neutral-400 mb-6">
                We&apos;re working on our first articles. Check back soon!
              </p>
              <Button
                asChild
                className="bg-[#D4FF4F] text-black hover:bg-[#c4ef3f]"
              >
                <a
                  href="https://medium.com/@reelzila"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit our Medium
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <a
                key={article.guid}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <article className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-[#D4FF4F]/10 hover:scale-[1.02] h-full flex flex-col">
                  {/* Thumbnail */}
                  {(() => {
                    const imageUrl = article.thumbnail || extractImageFromHtml(article.description);
                    return (
                      <div className="relative aspect-video bg-neutral-800 overflow-hidden">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-neutral-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    );
                  })()}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Categories/Tags */}
                    {article.categories && article.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="text-[10px] uppercase tracking-wider text-[#D4FF4F] px-2 py-1 rounded bg-[#D4FF4F]/10 border border-[#D4FF4F]/20"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#D4FF4F] transition-colors">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-neutral-400 mb-4 line-clamp-3 flex-grow">
                      {truncateText(article.description, 150)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(article.pubDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{estimateReadTime(article.description)} min read</span>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && !error && articles.length > 0 && (
          <div className="text-center mt-16 pt-8 border-t border-neutral-800">
            <a
              href="https://medium.com/@reelzila"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#D4FF4F] transition-colors"
            >
              View all articles on Medium
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
