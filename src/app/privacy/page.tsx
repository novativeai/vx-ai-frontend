"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Privacy &amp; Cookies Policy
        </h1>
        <p className="text-neutral-400 mb-12">Effective date: December 2025</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <p className="mb-4">
              This Privacy &amp; Cookies Policy (&quot;Policy&quot;) explains how ZEPHIRIX LTD, trading as
              &quot;Reelzilla&quot; (&quot;Reelzilla,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;) collects, uses, discloses, and
              protects personal data when you use:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>our website reelzila.studio (the &quot;Site&quot;); and</li>
              <li>our AI-powered video-generation SaaS platform, applications, and related services (together, the &quot;Service&quot;).</li>
            </ul>
            <p className="mb-4">Reelzilla is operated by:</p>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4">
              <p className="font-semibold text-white">ZEPHIRIX LTD</p>
              <p>Company number: 16828967</p>
              <p>Registered office: International House, 10 Beaufort Court, Admirals Way, London, United Kingdom, E14 9XL</p>
            </div>
            <p>
              For most processing described in this Policy, ZEPHIRIX LTD is the &quot;controller&quot; under UK GDPR and (where applicable) EU GDPR.
              If you have any questions, please contact us at{" "}
              <a href="mailto:support@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                support@reelzila.studio
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Scope &amp; Relationship with Other Terms</h2>
            <p className="mb-4">This Policy applies to personal data we process about:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>visitors to the Site;</li>
              <li>individual users and representatives of business customers using the Service; and</li>
              <li>contacts, prospects, and other people who interact with us (e.g. by email or social media).</li>
            </ul>
            <p className="mb-4">
              This Policy should be read together with our{" "}
              <Link href="/terms" className="text-[#D4FF4F] hover:underline">Terms &amp; Conditions</Link>,
              which govern your use of the Service and describe certain AI-specific features (e.g. model training, content moderation, and acceptable use).
            </p>
            <p>
              If you use the Service as part of an organization (e.g. your employer), that organization may be the controller for some data processed in the Service
              (e.g. Inputs and Outputs it manages); in those cases, we act as its processor under a separate agreement, and that organization&apos;s privacy notice may also apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Types of Data We Collect</h2>
            <p className="mb-4">We collect the following categories of personal data, depending on how you use the Site and Service:</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.1 Account &amp; Contact Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Name, username, display name</li>
              <li>Email address and password (hashed)</li>
              <li>Workspace or company name; role or job title</li>
              <li>Contact preferences, language, time zone</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.2 Subscription &amp; Billing Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Plan type (Free / Paid / Enterprise)</li>
              <li>Billing contact details, invoicing details</li>
              <li>Payment-related information (e.g. last 4 digits of card, card type, billing address) processed via our payment processor; we do not store full card numbers ourselves.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.3 Service Usage &amp; Technical Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Log-in records (date/time, IP address, device identifiers)</li>
              <li>Browser type, operating system, referring URLs</li>
              <li>Feature usage data (e.g. which tools you use, generation counts, success/error logs)</li>
              <li>Session activity, crash logs, and performance metrics</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.4 Content &amp; Generation Data (Inputs and Outputs)</h3>
            <p className="mb-4">As an AI-powered video generation platform, we process:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-white">Inputs:</strong> text prompts, images, reference media, metadata (e.g. tags, project names), and other information you upload or enter into the Service.</li>
              <li><strong className="text-white">Outputs / Generated Content:</strong> AI-generated videos, frames, images, audio, thumbnails, intermediate representations, and associated metadata.</li>
            </ul>
            <p className="text-amber-400 text-sm">
              Inputs and Outputs may contain personal data, including faces, voices, or other biometric identifiers. You are responsible for ensuring you have all necessary rights and valid consents
              before uploading personal data of third parties.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.5 Communications &amp; Support Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Content of messages you send us (e.g. support tickets, feedback, feature requests)</li>
              <li>Recordings or transcripts of calls or video meetings if we host them and you are notified in advance</li>
              <li>Marketing preferences, such as whether you have opted into product updates or newsletters</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.6 Marketing &amp; Analytics Data</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Cookie IDs and other online identifiers</li>
              <li>Page views, clickstream data, campaign performance</li>
              <li>Basic demographic inferences where available (at aggregated or pseudonymous level)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">2.7 Special Categories of Data</h3>
            <p>
              We do not intentionally seek to collect &quot;special category&quot; data (e.g. data revealing racial or ethnic origin, political opinions, religious beliefs, health, or sexual orientation)
              through the Service. If such data appears in Inputs or Outputs, you are responsible for having lawful grounds (including explicit consent where needed) before uploading and using that content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Collect Data</h2>
            <p className="mb-4">We collect personal data from the following sources:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Directly from you</strong> when you create an Account, use the Service, contact us, or subscribe to marketing.</li>
              <li><strong className="text-white">Automatically</strong> via cookies and similar technologies when you visit the Site or use the Service (see Section 10).</li>
              <li><strong className="text-white">From third parties,</strong> such as payment processors, authentication providers (e.g. single sign-on), analytics and error-tracking vendors, and business partners or resellers who refer you to us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Purposes and Legal Bases for Processing</h2>
            <p className="mb-4">Where UK/EU data protection law applies, we rely on the following legal bases:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Contract</strong> – to provide the Service you have requested;</li>
              <li><strong className="text-white">Legitimate interests</strong> – e.g. improving our Service, preventing abuse, defending legal claims;</li>
              <li><strong className="text-white">Consent</strong> – e.g. for certain cookies, optional marketing, and specific model-training scenarios;</li>
              <li><strong className="text-white">Legal obligation</strong> – e.g. tax, accounting, regulatory compliance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. AI-Specific Processing: Content, Training &amp; Safety</h2>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.1 Service Operation</h3>
            <p className="mb-4">We process Inputs and Outputs in order to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>generate content (e.g. videos) using AI Models;</li>
              <li>provide features like storage, editing, and export;</li>
              <li>maintain logs for troubleshooting and performance;</li>
              <li>detect and respond to abuse (e.g. non-consensual deepfakes, CSAM, hate content).</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.2 Model Improvement and Training</h3>
            <p className="mb-4">In addition to operating the Service, we may—if allowed by law and in line with our Terms:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>use de-identified or aggregated content and telemetry to train and improve our own models, safety systems, and product features;</li>
              <li>store limited content samples to review and improve generation quality and safety.</li>
            </ul>
            <p>We do not use content for training where law requires consent and you have not given it.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">5.3 Opt-Out / Withdrawal of Consent</h3>
            <p className="mb-4">You can opt-out (or withdraw consent) from having your content used for model improvement by:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>adjusting your settings in Account Settings → Data &amp; Training (where available); or</li>
              <li>emailing us with your account/workspace details.</li>
            </ul>
            <p>We may continue to process content and related data as necessary to provide the Service you requested, for security, fraud prevention, and abuse detection, or where required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. How We Share Personal Data</h2>
            <p className="mb-4">We share personal data only as needed for the purposes described in this Policy:</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.1 Service Providers (Processors)</h3>
            <p className="mb-4">We use carefully selected third-party service providers to help us run the Service, such as:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>cloud hosting and storage providers;</li>
              <li>payment processors;</li>
              <li>analytics and error-tracking services;</li>
              <li>communication and support platforms;</li>
              <li>AI model providers (where we route Inputs/Outputs through third-party models).</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.2 Business Customers &amp; Workspace Admins</h3>
            <p>If you use the Service under an organization&apos;s Workspace, your Workspace owner/admin may see your profile, activity, and content within that Workspace.
            We may share account and billing information with your organization as needed to administer the subscription.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.3 Legal &amp; Compliance</h3>
            <p className="mb-4">We may disclose data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>if required by law, court order, or government request;</li>
              <li>to establish, exercise, or defend legal claims; or</li>
              <li>to respond to legitimate requests in relation to safety or rights protection (e.g. DMCA-style copyright claims, NCII/CSAM reporting).</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.4 Corporate Transactions</h3>
            <p>If we are involved in a merger, acquisition, financing, or sale of all or part of our business, personal data may be transferred as part of that transaction, subject to appropriate protections.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">6.5 With Your Consent</h3>
            <p className="mb-4">We may share data with third parties when you explicitly consent, e.g. integrating the Service with a third-party workflow tool or publishing content to a public gallery.</p>
            <p className="font-semibold text-white">We do not sell your personal data in the sense of exchanging it for money.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
            <p className="mb-4">We are located in the United Kingdom and may process personal data in the UK and other countries.</p>
            <p className="mb-4">Where we transfer personal data from the UK or EEA to countries that do not have an adequacy decision, we implement appropriate safeguards such as:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission or UK equivalents; and/or</li>
              <li>other legally recognised transfer mechanisms.</li>
            </ul>
            <p>You may request more information about these safeguards by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
            <p className="mb-4">We retain personal data only as long as necessary for the purposes described in this Policy, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>as long as your Account is active or your organization uses the Service;</li>
              <li>for a reasonable period after termination to maintain records, resolve disputes, and enforce our agreements;</li>
              <li>as required by applicable law (e.g. tax and accounting rules).</li>
            </ul>
            <p>Different categories of data may have different retention periods. Where data is no longer needed, we will delete or irreversibly anonymise it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Security</h2>
            <p className="mb-4">We implement technical and organisational measures designed to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access.</p>
            <p className="mb-4">While specific controls may evolve, they typically include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>encryption in transit and at rest where appropriate;</li>
              <li>access controls and role-based permissions;</li>
              <li>logging and monitoring;</li>
              <li>secure development and testing practices;</li>
              <li>regular review of vendors and subprocessors.</li>
            </ul>
            <p>No system is 100% secure, but we work to continuously improve our security posture.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Cookies &amp; Similar Technologies</h2>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">10.1 What Are Cookies?</h3>
            <p className="mb-4">Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage, pixels, and SDKs. They help websites function, remember preferences, and analyse usage.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">10.2 How We Use Cookies</h3>
            <p className="mb-4">On the Site and within the Service, we use:</p>
            <ul className="list-disc list-inside space-y-3 ml-4 mb-4">
              <li><strong className="text-white">Strictly necessary cookies:</strong> Required for basic operation (e.g. log-in, session management, security features, load balancing). Set on the basis of legitimate interests or contract, and do not require consent under UK/EU cookie rules.</li>
              <li><strong className="text-white">Preference (functional) cookies:</strong> Remember choices (e.g. language, region, UI preferences). May rely on legitimate interests or consent, depending on local law.</li>
              <li><strong className="text-white">Analytics &amp; performance cookies:</strong> Help us understand how the Site and Service are used (e.g. pages visited, features used, error rates). Used to improve performance and usability. Typically rely on consent (via cookie banner) in the UK/EEA.</li>
              <li><strong className="text-white">Advertising / marketing cookies (if we use them):</strong> Used to measure campaigns or to show relevant ads on other sites. Only used where you have given consent, and can be disabled via the cookie banner and/or browser settings.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">10.3 Cookie Consent &amp; Management</h3>
            <p className="mb-4">When you first visit the Site from certain jurisdictions (e.g. UK/EEA), you will see a cookie banner that explains our use of cookies and allows you to accept all, reject non-essential, or customise cookie settings.</p>
            <p className="mb-4">You can change your preferences at any time (e.g. via a &quot;Cookie Settings&quot; link in the Site footer) or by clearing cookies in your browser.</p>
            <p>If you disable certain cookies, some features of the Site or Service may not work properly.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">10.4 Browser Controls &amp; Do Not Track</h3>
            <p>Most browsers let you manage cookies (e.g. block, delete, or limit them). Please refer to your browser&apos;s help section. The Service does not currently respond to Do Not Track (DNT) signals; if that changes, we will update this Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Your Rights</h2>
            <p className="mb-4">Your rights depend on where you live. This section summarises key rights under UK/EU data protection law and US/California law.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">11.1 UK/EEA Data Subject Rights</h3>
            <p className="mb-4">If you are in the UK or EEA, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-white">Access:</strong> obtain confirmation whether we process your personal data and receive a copy.</li>
              <li><strong className="text-white">Rectification:</strong> correct inaccurate or incomplete data.</li>
              <li><strong className="text-white">Erasure:</strong> request deletion of personal data where no longer necessary or where you withdraw consent (subject to legal exceptions).</li>
              <li><strong className="text-white">Restriction:</strong> request restriction of processing in certain situations.</li>
              <li><strong className="text-white">Portability:</strong> receive data you provided in a structured, commonly used format and have it transmitted to another controller where technically feasible.</li>
              <li><strong className="text-white">Objection:</strong> object to processing based on our legitimate interests, including direct marketing; we will honour this unless we have compelling legitimate grounds.</li>
              <li><strong className="text-white">Withdraw consent:</strong> withdraw consent at any time where processing is based on consent (e.g. certain cookies, marketing, some training uses).</li>
            </ul>
            <p>You also have the right to lodge a complaint with your local data protection authority. In the UK, that is the Information Commissioner&apos;s Office (ICO).</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">11.2 California &amp; Certain US States</h3>
            <p className="mb-4">If you are a resident of California or another US state with comprehensive privacy laws, you may have rights to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>access and portability of certain information;</li>
              <li>deletion of personal information, subject to exceptions;</li>
              <li>correction of inaccurate personal information;</li>
              <li>information about categories of personal information collected, sources, purposes, and disclosures;</li>
              <li>not to receive discriminatory treatment for exercising your rights.</li>
            </ul>
            <p>We do not sell your personal information and do not share it for cross-context behavioural advertising as those terms are defined under California law.</p>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">11.3 Exercising Your Rights</h3>
            <p className="mb-4">To exercise any of these rights (where applicable), please contact us at{" "}
              <a href="mailto:support@reelzila.studio" className="text-[#D4FF4F] hover:underline">support@reelzila.studio</a>{" "}
              and specify the right you wish to exercise and provide sufficient information to verify your identity.
            </p>
            <p>Where we act as a processor for a business customer (e.g. your employer), we may direct you to contact that organization.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Children&apos;s Privacy</h2>
            <p>The Service is not intended for children under 13 (or under 16 where required by local law). We do not knowingly collect personal data from children in this age group.
            If we become aware that we have collected such data, we will take reasonable steps to delete it.
            If you believe a child has provided us with personal data, please{" "}
              <Link href="/contact" className="text-[#D4FF4F] hover:underline">contact us</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Third-Party Links &amp; Services</h2>
            <p>The Site and Service may contain links to third-party websites, content, or services (e.g. cloud storage, social networks, other AI tools).
            We are not responsible for the privacy practices of those third parties. We encourage you to read their privacy policies before providing personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to This Policy</h2>
            <p>We may update this Policy from time to time. We will indicate the &quot;Effective date&quot; at the top and, where changes are material, we will provide additional notice (e.g. via email or in-app notifications).
            If you continue to use the Site or Service after the revised Policy takes effect, you will be deemed to have accepted it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Details</h2>
            <p className="mb-4">If you have questions or concerns about this Policy or our data practices, or wish to exercise your rights, please contact us:</p>
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
