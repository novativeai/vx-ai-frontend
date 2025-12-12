"use client";

import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 mb-8">
            <BookOpen className="w-10 h-10 text-[#D4FF4F]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            Blog
          </h1>

          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Stay tuned! Our blog is coming soon to Medium where we&apos;ll share tips,
            tutorials, and the latest updates about AI video generation.
          </p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
            <ul className="text-left text-neutral-300 space-y-3 max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF4F] mt-2 flex-shrink-0"></span>
                <span>Tips and tricks for creating stunning AI videos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF4F] mt-2 flex-shrink-0"></span>
                <span>Behind-the-scenes looks at new features</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF4F] mt-2 flex-shrink-0"></span>
                <span>Industry insights and AI video trends</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF4F] mt-2 flex-shrink-0"></span>
                <span>Creator spotlights and success stories</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-[#D4FF4F] text-black hover:bg-[#c4ef3f] px-6 py-3"
            >
              <a
                href="https://medium.com/@reelzila"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Follow on Medium
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-neutral-700 text-white hover:bg-neutral-900 px-6 py-3"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>

          <p className="text-sm text-neutral-500 mt-12">
            Want to be notified when we launch?{" "}
            <Link href="/contact" className="text-[#D4FF4F] hover:underline">
              Get in touch
            </Link>{" "}
            and we&apos;ll keep you updated.
          </p>
        </div>
      </div>
    </div>
  );
}
