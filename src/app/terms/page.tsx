"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Terms of Service
        </h1>
        <p className="text-neutral-400 mb-12">Last updated: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Reelzila (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              Reelzila is an AI-powered video generation platform that allows users to create
              videos using various AI models. The Service includes video generation, marketplace
              features, and related functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>One person may not maintain multiple accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Credits and Payments</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Credits are required to generate videos</li>
              <li>Credits are non-refundable except as described in our{" "}
                <Link href="/refund" className="text-[#D4FF4F] hover:underline">Refund Policy</Link>
              </li>
              <li>Prices are subject to change with notice</li>
              <li>Unused credits do not expire</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Content Guidelines</h2>
            <p className="mb-4">You agree not to use the Service to create content that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violates any applicable laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains explicit, violent, or harmful material</li>
              <li>Depicts real individuals without consent</li>
              <li>Promotes hate, discrimination, or harassment</li>
              <li>Is deceptive or fraudulent in nature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="mb-4">
              Content generated using the Service:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You retain rights to content you create using our Service</li>
              <li>You grant us a license to display and process your content for Service operation</li>
              <li>Marketplace content is subject to the license terms specified at purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Marketplace</h2>
            <p className="mb-4">When using the marketplace:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sellers must have rights to the content they list</li>
              <li>Buyers receive the usage rights specified in the listing</li>
              <li>We facilitate transactions but are not responsible for content quality</li>
              <li>Commission rates and payment terms are subject to our Seller Agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
            <p>
              We strive to provide reliable service but do not guarantee uninterrupted access.
              The Service may be temporarily unavailable for maintenance, updates, or due to
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Reelzila shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages resulting from
              your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account for violation of these
              terms or for any other reason at our discretion. Upon termination, your right to
              use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                legal@reelzila.studio
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
