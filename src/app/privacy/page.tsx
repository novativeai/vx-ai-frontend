"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Privacy Policy
        </h1>
        <p className="text-neutral-400 mb-12">Last updated: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Reelzila (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
              protecting your personal data. This privacy policy explains how we collect, use,
              and safeguard your information when you use our AI video generation platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Account Information:</strong> Email address, name, and authentication data</li>
              <li><strong className="text-white">Payment Information:</strong> Billing details processed through our payment provider</li>
              <li><strong className="text-white">Usage Data:</strong> Generation history, preferences, and platform interactions</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our Service</li>
              <li>To process payments and manage your account</li>
              <li>To improve our AI models and user experience</li>
              <li>To communicate with you about updates and support</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
            <p className="mb-4">
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption in transit and at rest</li>
              <li>Secure authentication via Firebase</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing</h2>
            <p className="mb-4">We may share your data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Service Providers:</strong> Payment processors, cloud hosting, analytics</li>
              <li><strong className="text-white">AI Model Providers:</strong> For video generation processing</li>
              <li><strong className="text-white">Legal Authorities:</strong> When required by law</li>
            </ul>
            <p className="mt-4">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide
              services. Generated content is stored until you delete it or close your account.
              Some data may be retained longer for legal or business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies</h2>
            <p>
              We use cookies and similar technologies. For more information, please see our{" "}
              <Link href="/cookies" className="text-[#D4FF4F] hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. International Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Children&apos;s Privacy</h2>
            <p>
              Our Service is not intended for users under 18 years of age. We do not knowingly
              collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of significant changes
              via email or platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p>
              For privacy-related questions, contact us at{" "}
              <a href="mailto:privacy@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                privacy@reelzila.studio
              </a>
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
