"use client";

import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Cookie Policy
        </h1>
        <p className="text-neutral-400 mb-12">Last updated: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when
              you visit a website. They are widely used to make websites work more efficiently and
              provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">Reelzila uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Essential Cookies:</strong> Required for the website to function properly, including authentication and session management</li>
              <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong className="text-white">Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Essential Cookies</h2>
            <p className="mb-4">
              These cookies are necessary for the website to function and cannot be switched off.
              They include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authentication tokens to keep you logged in</li>
              <li>Session identifiers for security</li>
              <li>User preferences for accessibility</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Analytics Cookies</h2>
            <p>
              We use analytics services to help us understand how our website is being used.
              These cookies collect information in an anonymous form, including the number of
              visitors to the site, where visitors have come from, and the pages they visited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Google Analytics:</strong> For website analytics</li>
              <li><strong className="text-white">Firebase:</strong> For authentication and database services</li>
              <li><strong className="text-white">Payment Providers:</strong> For secure payment processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from being set</li>
              <li>Set preferences for certain websites</li>
            </ul>
            <p className="mt-4">
              Please note that blocking essential cookies may affect your ability to use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                privacy@reelzila.studio
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-[#D4FF4F] hover:underline">
                Contact Page
              </Link>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800">
          <Link href="/" className="text-[#D4FF4F] hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
