"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Refund Policy
        </h1>
        <p className="text-neutral-400 mb-12">Last updated: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Credit Purchases</h2>
            <p className="mb-4">
              All credit purchases on Reelzila are final and non-refundable. Once credits are added
              to your account, they cannot be converted back to cash or transferred to another account.
            </p>
            <p>
              Credits do not expire and will remain in your account until used for video generation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Subscription Plans</h2>
            <p className="mb-4">
              For subscription plans (Creator and Pro), you may cancel at any time. Upon cancellation:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your subscription will remain active until the end of the current billing period</li>
              <li>No partial refunds will be issued for unused time within a billing period</li>
              <li>Any remaining credits from your subscription will remain available until used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Service Issues</h2>
            <p className="mb-4">
              If you experience technical issues that prevent you from using the service, please contact
              our support team within 7 days of the issue. We may, at our discretion:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Credit your account for failed generations</li>
              <li>Provide additional credits as compensation</li>
              <li>Issue a partial or full refund in exceptional circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Marketplace Purchases</h2>
            <p className="mb-4">
              Purchases made through our marketplace (videos from other creators) are generally
              non-refundable. However, if the content does not match its description or has
              technical issues, please contact us within 48 hours of purchase for resolution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund or credit, please contact our support team at:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email: support@reelzila.studio</li>
              <li>
                <Link href="/contact" className="text-[#D4FF4F] hover:underline">
                  Contact Form
                </Link>
              </li>
            </ul>
            <p className="mt-4">
              Please include your account email, transaction details, and a description of the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this refund policy at any time. Changes will be
              effective immediately upon posting to this page. Continued use of the service
              after changes constitutes acceptance of the new policy.
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
