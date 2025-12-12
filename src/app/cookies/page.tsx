"use client";

import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Cookie Policy
        </h1>
        <p className="text-neutral-400 mb-12">Effective date: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <p className="mb-4">
              This Cookie Policy explains how ZEPHIRIX LTD, trading as &quot;Reelzilla&quot; (&quot;Reelzilla,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;)
              uses cookies and similar technologies on our website reelzila.studio (the &quot;Site&quot;) and within our AI-powered
              video-generation SaaS platform (the &quot;Service&quot;).
            </p>
            <p>
              This Cookie Policy forms part of our{" "}
              <Link href="/privacy" className="text-[#D4FF4F] hover:underline">Privacy &amp; Cookies Policy</Link>.
              For more details on how we collect and process personal data, please refer to that policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. Similar technologies
              include local storage, pixels, and SDKs. They help websites function, remember preferences, and analyse usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">On the Site and within the Service, we use:</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">Strictly Necessary Cookies</h3>
            <p className="mb-4">
              Required for basic operation (e.g. log-in, session management, security features, load balancing).
              Set on the basis of legitimate interests or contract, and do not require consent under UK/EU cookie rules.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">Preference (Functional) Cookies</h3>
            <p className="mb-4">
              Remember choices (e.g. language, region, UI preferences).
              May rely on legitimate interests or consent, depending on local law.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">Analytics &amp; Performance Cookies</h3>
            <p className="mb-4">
              Help us understand how the Site and Service are used (e.g. pages visited, features used, error rates).
              Used to improve performance and usability. Typically rely on consent (via cookie banner) in the UK/EEA.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">Advertising / Marketing Cookies</h3>
            <p>
              Used to measure campaigns or to show relevant ads on other sites.
              Only used where you have given consent, and can be disabled via the cookie banner and/or browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cookie Consent &amp; Management</h2>
            <p className="mb-4">
              When you first visit the Site from certain jurisdictions (e.g. UK/EEA), you will see a cookie banner that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>explains our use of cookies;</li>
              <li>allows you to accept all, reject non-essential, or customise cookie settings.</li>
            </ul>
            <p className="mb-4">
              You can change your preferences at any time (e.g. via a &quot;Cookie Settings&quot; link in the Site footer)
              or by clearing cookies in your browser.
            </p>
            <p>
              If you disable certain cookies, some features of the Site or Service may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Browser Controls &amp; Do Not Track</h2>
            <p className="mb-4">
              Most browsers let you manage cookies (e.g. block, delete, or limit them). Please refer to your browser&apos;s help section.
            </p>
            <p>
              The Service does not currently respond to Do Not Track (DNT) signals; if that changes, we will update this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Firebase:</strong> For authentication and database services</li>
              <li><strong className="text-white">Payment Processors:</strong> For secure payment processing</li>
              <li><strong className="text-white">Analytics Services:</strong> To help us understand how our website is being used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this Policy from time to time. We will indicate the &quot;Effective date&quot; at the top and,
              where changes are material, we will provide additional notice (e.g. via email or in-app notifications).
              If you continue to use the Site or Service after the revised Policy takes effect, you will be deemed to have accepted it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <p className="font-semibold text-white">ZEPHIRIX LTD (trading as Reelzilla)</p>
              <p>International House, 10 Beaufort Court, Admirals Way</p>
              <p>London, United Kingdom, E14 9XL</p>
              <p className="mt-2">
                Email:{" "}
                <a href="mailto:support@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                  support@reelzila.studio
                </a>
              </p>
            </div>
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
