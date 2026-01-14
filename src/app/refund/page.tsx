"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-neutral-400 mb-12">Effective date: January 2026</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <p className="mb-4">
              This Refund &amp; Cancellation Policy (&quot;Policy&quot;) explains when and how ZEPHIRIX LTD, trading as &quot;Reelzilla&quot;
              (&quot;Reelzilla,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;), issues refunds for purchases made through reelzila.studio and the
              Reelzilla platform (the &quot;Service&quot;).
            </p>
            <p>
              This Policy forms part of our{" "}
              <Link href="/terms" className="text-[#D4FF4F] hover:underline">Terms &amp; Conditions</Link>.
              Capitalised terms have the meaning given in the Terms &amp; Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. General Principles</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">1.1 Digital, subscription-based service.</strong> Reelzilla provides access to an online AI-powered video-generation Service, including usage-based Credits. Once Credits are used or generation has started, the underlying digital content cannot be &quot;returned&quot; in the same way as physical goods.</li>
              <li><strong className="text-white">1.2 No refunds except as stated.</strong> Except where required by law or expressly provided in this Policy, all fees, subscriptions, and Credits are non-refundable and non-transferable.</li>
              <li><strong className="text-white">1.3 Local consumer rights preserved.</strong> Nothing in this Policy is intended to exclude or limit any statutory rights you may have under applicable law (for example, UK or EU consumer law).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Definitions (for this Policy)</h2>
            <p className="mb-4">For clarity in this Policy:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">&quot;Subscription&quot;</strong> means a recurring Paid Plan (monthly, annual, or other recurring term) giving access to the Service and/or Credits.</li>
              <li><strong className="text-white">&quot;Credits&quot;</strong> means units consumed to generate, edit, or export content via the Service. Credits are not money or a stored-value product.</li>
              <li><strong className="text-white">&quot;One-off Purchase&quot;</strong> means any non-recurring purchase, such as additional Credits or add-ons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Free Plan &amp; Trials</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">3.1 Free Plan.</strong> Our Free Plan (if available) allows you to test core features without payment. No refunds apply because no payment is made.</li>
              <li><strong className="text-white">3.2 Free trial periods.</strong> From time to time, we may offer free or promotional trials for Paid Plans. If you do not wish to be charged, you must cancel before the end of the trial. Charges made after the trial period are subject to this Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Subscriptions (Monthly / Annual)</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.1 Auto-renewal</h3>
            <p className="mb-4">Subscriptions renew automatically at the end of each billing period unless cancelled in your Account settings before renewal.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.2 Cancellations going forward</h3>
            <p className="mb-4">You may cancel your Subscription at any time. Cancellation:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>prevents future automatic renewals; but</li>
              <li>does not automatically entitle you to a refund for the current billing period.</li>
            </ul>
            <p className="mb-4">You will normally retain access to your Paid Plan until the end of the current paid term, after which your Account may be downgraded to the Free Plan or closed.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.3 No pro-rata refunds</h3>
            <p className="mb-4">Unless required by law, we do not provide pro-rata refunds or credits for partial months or years of service, unused time, or unused features if you:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>cancel during a billing period;</li>
              <li>downgrade your plan; or</li>
              <li>stop using the Service before the end of your billing period.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">4.4 Plan upgrades</h3>
            <p className="mb-4">If you upgrade to a higher plan (e.g. from monthly to annual, or to a higher tier):</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>any upgrade charges are normally payable immediately; and</li>
              <li>we do not provide refunds for the unused portion of the previous plan, unless mandated by local law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Credits and One-Off Purchases</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.1 Non-refundable Credits</h3>
            <p className="mb-4">Unless this Policy or applicable law expressly provides otherwise:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>purchased Credits, add-ons, and other One-off Purchases are non-refundable;</li>
              <li>unused Credits expire as described in the Terms &amp; Conditions or product documentation;</li>
              <li>Credits have no cash value, are not legal tender, and cannot be exchanged for cash or refunds.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.2 Promotional or bonus Credits</h3>
            <p className="mb-4">Any free, promotional, or bonus Credits we grant:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>may be subject to additional conditions (e.g. shorter expiry dates); and</li>
              <li>are never refundable or redeemable for cash.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cooling-Off &amp; Withdrawal Rights (EEA/UK Consumers)</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.1 Digital content and 14-day cooling-off</h3>
            <p className="mb-4">
              If you are a consumer residing in the UK or European Economic Area (EEA) and you purchase digital content or a digital service online,
              you may have a 14-day cooling-off period under applicable consumer laws (e.g. UK Consumer Contracts Regulations and EU Consumer Rights Directive / Digital Content Directive).
            </p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.2 Immediate access and waiver of right to withdraw</h3>
            <p className="mb-4">When you sign up for a Paid Plan or purchase Credits, you:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>request immediate access to the digital content and/or digital service; and</li>
              <li>acknowledge that once we begin to provide the Service (e.g. by granting access to Paid features or Credits, or by starting generation), you may lose your right to withdraw in relation to content already supplied.</li>
            </ul>
            <p className="mb-4">This means that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>if you have started using the Service (e.g. logged into the Paid Plan, used Credits, or generated Outputs) within the 14-day period, we are entitled to withhold or reduce any refund to reflect the value of the service already provided; and</li>
              <li>where we have fully performed the contract (e.g. all Credits or digital content have been supplied and used), your withdrawal right no longer applies to that portion.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.3 If you have not yet used the Service</h3>
            <p>
              If you are an EEA/UK consumer and have not used the Service at all (no log-in to Paid features and no Credits used),
              you may be entitled to a full refund if you notify us within 14 days of purchase. We may ask for reasonable confirmation that no use has occurred.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Technical Issues &amp; Service Problems</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">7.1 Temporary outages or slow performance</h3>
            <p className="mb-4">Internet-based services may occasionally experience outages, degradation, or other technical issues. Short-term or minor disruptions do not normally entitle you to a refund.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">7.2 Material defects</h3>
            <p className="mb-4">If you experience a persistent, material problem with the Service that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>is directly caused by us;</li>
              <li>substantially affects your ability to use Paid features; and</li>
              <li>cannot be resolved within a reasonable time after you contact support,</li>
            </ul>
            <p className="mb-4">then, depending on the circumstances and your local laws, we may offer one or more of the following at our discretion:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>additional Credits or extension of your Subscription period;</li>
              <li>partial refund; or</li>
              <li>in exceptional cases, full refund for the affected billing period.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">7.3 Issues due to your environment</h3>
            <p className="mb-4">We are not responsible for issues caused by:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>your internet connection or network;</li>
              <li>your device hardware, browser, or operating system;</li>
              <li>incompatibility with third-party tools, plug-ins, or settings; or</li>
              <li>misuse of the Service contrary to our Terms &amp; Conditions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Misuse, Fraud &amp; Breach of Terms</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">8.1 Violations of Terms</h3>
            <p className="mb-4">If we suspend or terminate your Account due to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>breach of our Terms &amp; Conditions, Acceptable Use Policy, or this Policy; or</li>
              <li>fraudulent or abusive behaviour,</li>
            </ul>
            <p className="mb-4">you are not entitled to any refund, and we may retain amounts already paid to cover damages or costs incurred.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">8.2 Fraudulent payments</h3>
            <p className="mb-4">If we detect or reasonably suspect fraudulent payments, stolen payment methods, or disputed/unauthorised charges, we may:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>suspend or terminate the Account;</li>
              <li>block access to or use of Credits; and</li>
              <li>cooperate with payment providers, relevant platforms, and/or law enforcement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Chargebacks &amp; Disputes</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">9.1 Talk to us first</h3>
            <p className="mb-4">If you believe a charge is incorrect, please contact us first so we can investigate and, if appropriate, offer a correction or refund.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">9.2 Unfounded chargebacks</h3>
            <p className="mb-4">If you initiate a chargeback or payment dispute without valid grounds:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>this may be treated as a breach of the Terms &amp; Conditions;</li>
              <li>we may suspend or terminate your Account; and</li>
              <li>we reserve the right to dispute the chargeback and provide evidence to the payment provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. How to Request a Refund</h2>
            <p className="mb-4">To request a refund that you believe you are entitled to under this Policy or applicable law, please:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Email us from the address associated with your Account.</li>
              <li>Include:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li>your full name;</li>
                  <li>the email used for your Account;</li>
                  <li>transaction details (date, amount, last 4 digits of card, or payment reference);</li>
                  <li>a clear explanation of why you are requesting a refund.</li>
                </ul>
              </li>
            </ul>
            <p className="mb-4">We may ask you for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>proof of purchase;</li>
              <li>additional information to verify your identity;</li>
              <li>information on your use of the Service (e.g. number of generations, Credits used).</li>
            </ul>
            <p>
              We will review your request in good faith and respond as soon as reasonably possible. Where a refund is approved,
              we will process it using the original payment method wherever possible. Processing times may depend on your bank or card issuer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Enterprise &amp; Custom Agreements</h2>
            <p>
              If you or your organisation use Reelzilla under a separate enterprise, custom, or negotiated agreement,
              the cancellation and refund terms in that agreement will prevail to the extent they differ from this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
            <p className="mb-4">We may update this Policy from time to time (for example, to reflect changes in our pricing models, the Service, or applicable law). When we do:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>we will update the &quot;Effective date&quot; at the top; and</li>
              <li>if changes are material, we will provide additional notice (e.g. via email or in-product).</li>
            </ul>
            <p>If you continue to use the Service after the updated Policy takes effect, you will be deemed to have accepted it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Marketplace Transactions (User-to-User Purchases)</h2>

            <ul className="list-disc list-inside space-y-4 ml-4">
              <li>
                <strong className="text-white">13.1 Scope.</strong> This Policy applies to Credits, add-ons, and other purchases made directly from Reelzilla for access to the AI video-generation Service. It does not govern purchases of Marketplace Items from other Users via the Marketplace.
              </li>
              <li>
                <strong className="text-white">13.2 Marketplace purchases.</strong> Marketplace Transactions (where a Buyer purchases or licenses a Marketplace Item from a Seller) are governed by the Marketplace Payment Terms and any additional terms disclosed at checkout or in the relevant listing.
              </li>
              <li>
                <strong className="text-white">13.3 Digital content.</strong> Because Marketplace Items are digital content, cancellation and refund rights may be limited once delivery or access begins, except where required by law or expressly provided in the Marketplace Payment Terms.
              </li>
              <li>
                <strong className="text-white">13.4 Support.</strong> If you believe a Marketplace Item is infringing, defective, not as described, or otherwise problematic, please contact support with the relevant transaction details. We may (but are not obliged to) assist with dispute resolution in accordance with the Marketplace Payment Terms.
              </li>
              <li>
                <strong className="text-white">13.5 Statutory rights preserved.</strong> Nothing in this Section 13 is intended to exclude or limit any statutory rights you may have under applicable law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
            <p className="mb-4">If you have questions about this Policy or our practices, please contact:</p>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <p className="font-semibold text-white">Reelzilla (ZEPHIRIX LTD)</p>
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
