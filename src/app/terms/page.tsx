"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">
          Terms &amp; Conditions
        </h1>
        <p className="text-neutral-400 mb-12">Effective Date: January 2026</p>

        <div className="space-y-8 text-neutral-300">
          <section>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
              <p className="font-semibold text-white">ZEPHIRIX LTD</p>
              <p>Company number: 16828967</p>
              <p>Registered office: International House, 10 Beaufort Court, Admirals Way, London, United Kingdom, E14 9XL</p>
              <p className="mt-2">(trading as &quot;Reelzilla&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;)</p>
              <p className="mt-2">
                Website:{" "}
                <a href="https://reelzila.studio" className="text-[#D4FF4F] hover:underline">
                  https://reelzila.studio
                </a>
              </p>
              <p>
                Contact:{" "}
                <a href="mailto:support@reelzila.studio" className="text-[#D4FF4F] hover:underline">
                  support@reelzila.studio
                </a>
              </p>
            </div>
            <p>These Terms govern your access to and use of the Site and any related online services, applications, and tools provided by Reelzilla.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Definitions</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Account:</strong> A registered profile enabling access to the Service.</li>
              <li><strong className="text-white">AUP:</strong> Our Acceptable Use restrictions in §8.</li>
              <li><strong className="text-white">Credits:</strong> Units consumed to generate, edit, or export content via the Service; not legal tender.</li>
              <li><strong className="text-white">Customer or User:</strong> Any person or entity that creates an Account or otherwise uses the Service.</li>
              <li><strong className="text-white">Input(s):</strong> Content you or your authorized users submit (e.g., prompts, text, images, reference videos/audio, data, tags, settings).</li>
              <li><strong className="text-white">Model:</strong> Any machine-learning system used to create or transform content, whether operated by us or by a third-party provider.</li>
              <li><strong className="text-white">Output(s) or Generated Content:</strong> Content produced by the Service based on Inputs, including videos, frames, images, audio, and related metadata.</li>
              <li><strong className="text-white">Platform or Service:</strong> The Reelzilla website(s) and any related subdomains, web or mobile applications, APIs, software, Models, documentation, and related services.</li>
              <li><strong className="text-white">Third-Party Services:</strong> Cloud, payment, or model providers (e.g., AI video models such as &quot;VEO 3,&quot; &quot;Seedance-1 Pro,&quot; &quot;WAN 2.2,&quot; or others) integrated or accessed via the Service.</li>
              <li><strong className="text-white">Workspace:</strong> A team/organization space that may include multiple users under one billing entity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Acceptance of Terms &amp; Account Creation</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">2.1 Binding agreement.</strong> By creating an Account, clicking &quot;I agree,&quot; or using the Service, you accept these Terms and our referenced policies (including our{" "}
                <Link href="/privacy" className="text-[#D4FF4F] hover:underline">Privacy Policy</Link>). If you do not agree, do not use the Service.</li>
              <li><strong className="text-white">2.2 Authority.</strong> If you use the Service on behalf of an entity, you represent that you have authority to bind it. That entity is responsible for all activity under its Workspace.</li>
              <li><strong className="text-white">2.3 Age &amp; corporate email.</strong> You must be at least 13 (or 16 where required, e.g., EEA/UK) and of legal capacity. If you register with a corporate email, your Account may be claimed by that organization.</li>
              <li><strong className="text-white">2.4 Security.</strong> You are responsible for safeguarding credentials and for all activity under your Account. Notify us immediately of unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Description of the Service; Eligibility</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.1 Functionality</h3>
            <p className="mb-4">Reelzilla is an AI-powered video-generation SaaS platform that allows Users to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>input text prompts;</li>
              <li>upload images;</li>
              <li>generate videos using one or more Models;</li>
              <li>download, store, and use Outputs; and</li>
              <li>purchase credits on a pay-as-you-go basis.</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.2 Availability</h3>
            <p className="mb-4">Features may vary by region, plan, and device. Beta/experimental features may be offered and can change or be withdrawn at any time (§14).</p>
            <h3 className="text-xl font-semibold text-white mb-2 mt-6">3.3 Eligibility</h3>
            <p>You represent that you (a) are not barred under applicable law (e.g., export/sanctions rules), and (b) will use the Service only for lawful purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Credits, Billing, Refunds &amp; Taxes</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">4.1 Credit purchases.</strong> Credits are purchased on a pay-as-you-go basis. There are no subscriptions or recurring charges. Credits are added to your Account immediately upon successful payment.</li>
              <li><strong className="text-white">4.2 Credits.</strong>
                <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                  <li>Credit consumption may vary by Model, resolution, duration, or feature;</li>
                  <li>Credits are not currency, non-transferable, and non-refundable;</li>
                  <li>Credits do not expire;</li>
                  <li>We may adjust credit pricing/consumption with notice for future purchases.</li>
                </ul>
              </li>
              <li><strong className="text-white">4.3 Failed payments.</strong> If your payment method fails, no credits will be added. You may retry with a different payment method.</li>
              <li><strong className="text-white">4.4 Price changes.</strong> We may change credit prices and will provide advance notice for future purchases.</li>
              <li><strong className="text-white">4.5 Taxes.</strong> Prices exclude taxes. You are responsible for all applicable taxes, duties, and government charges, which we may collect where legally obliged.</li>
              <li><strong className="text-white">4.6 Local consumer rights.</strong> If you are an EEA/UK consumer purchasing digital content, you may have a statutory 14-day withdrawal right. You expressly consent to immediate provision of digital content and acknowledge that once generation begins or credits are used, you lose the withdrawal right to the extent permitted by law.</li>
              <li><strong className="text-white">4.7 Chargebacks.</strong> Unfounded chargebacks are a breach. We may contest them and suspend your Account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Inputs (Uploads/Prompts): Your Representations, Warranties &amp; License to Reelzilla</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">5.1 Ownership &amp; permissions.</strong> You represent and warrant that you own or have all necessary rights to the Inputs you provide and that your Inputs do not violate law or rights of others.</li>
              <li><strong className="text-white">5.2 Personal &amp; biometric data.</strong> If Inputs contain personal data (including faces, voices, or other biometric identifiers) or belong to third parties, you represent that you have obtained all required notices, consents, and lawful bases and that processing and generation via the Service is compliant with applicable laws (e.g., GDPR/CCPA/BIPA).</li>
              <li><strong className="text-white">5.3 Processing license to Reelzilla.</strong> You grant us a non-exclusive, worldwide, royalty-free license to host, cache, process, transmit, display, and reproduce Inputs solely to provide the Service, including safety/abuse detection, troubleshooting, analytics, and to enforce these Terms.</li>
              <li><strong className="text-white">5.4 Back-ups.</strong> You are responsible for maintaining backups of Inputs. We are not responsible for loss of Inputs due to your actions or third-party failures.</li>
              <li><strong className="text-white">5.5 Moderation.</strong> We may use automated tools and human review to moderate Inputs/Outputs for policy compliance and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Generated Videos / Outputs</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">6.1 Ownership.</strong> As between you and Reelzilla, and to the extent permitted by law, you own your Outputs created via your Account, subject to these Terms and the rights of others. Due to the probabilistic nature of generative AI, similar Outputs may be independently created by other users based on similar Inputs.</li>
              <li><strong className="text-white">6.2 License back to Reelzilla.</strong> You grant us a non-exclusive, worldwide, royalty-free license to host, process, transmit, display, and store Outputs for operation of the Service, content moderation/safety, troubleshooting, and enforcing the Terms.</li>
              <li><strong className="text-white">6.3 Use of third-party content.</strong> You are solely responsible for verifying that any third-party content appearing in Outputs is authorized for your intended use.</li>
              <li><strong className="text-white">6.4 Commercial vs. non-commercial use.</strong> Unless your plan explicitly limits usage, you may use Outputs commercially, subject to §8 and third-party rights. Some plans may add watermarks/provenance or restrict commercial usage; plan-specific limits in your account prevail.</li>
              <li><strong className="text-white">6.5 No training competitors.</strong> Except as expressly permitted by us in writing, you must not use Outputs, model responses, or any Service data to train or improve models that compete with the Service.</li>
              <li><strong className="text-white">6.6 Labeling, watermarks, and provenance.</strong> We may attach or require you to retain visible or invisible indicators indicating AI generation or edits. You must not remove, alter, obscure, or misrepresent such labels/metadata.</li>
              <li><strong className="text-white">6.7 No professional advice / high-risk use.</strong> Outputs are not professional advice and must not be used for medical, legal, financial, or safety-critical decisions without independent human review.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">7.1 Reelzilla IP.</strong> The Service (including Models, model weights, prompt engineering, datasets, algorithms, source code, UI/UX, documentation, &quot;Reelzilla&quot; trademarks and logos) is protected by IP laws. Except for rights expressly granted, we reserve all rights.</li>
              <li><strong className="text-white">7.2 Your IP.</strong> You retain rights in your Inputs and Outputs (subject to §6 and §9).</li>
              <li><strong className="text-white">7.3 Feedback.</strong> You grant us a perpetual, irrevocable, worldwide, royalty-free license to use suggestions or feedback without restriction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Restrictions &amp; Prohibited Uses (Acceptable Use Policy)</h2>
            <p className="mb-4 text-amber-400">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">8.1 Illegal or infringing content.</strong> Upload or generate content that is illegal, fraudulent, defamatory, or infringes copyrights, trademarks, rights of publicity or privacy, or other rights.</li>
              <li><strong className="text-white">8.2 Deepfakes &amp; impersonation.</strong> Create synthetic media of real individuals (face/voice) without verifiable, documented consent; fail to clearly disclose synthetic nature when required; or otherwise mislead viewers as to authenticity. Political or election-related deepfakes are prohibited.</li>
              <li><strong className="text-white">8.3 Sexual content involving minors; CSA/NCII.</strong> Any sexual or exploitative content involving minors; non-consensual intimate imagery (NCII); sexual violence/coercion. We report apparent CSAM to authorities.</li>
              <li><strong className="text-white">8.4 Hate/terrorism/extremism &amp; violence.</strong> Promote or glorify terrorism, violent extremism, genocide, or hateful conduct toward protected groups; produce graphic gore or incitement of violence.</li>
              <li><strong className="text-white">8.5 Harmful misinformation &amp; civic integrity.</strong> Generate content intended to deceive about civic processes (voting, census, courts) or to manipulate elections; or knowingly spread harmful medical/health misinformation.</li>
              <li><strong className="text-white">8.6 Biometric misuse &amp; surveillance.</strong> Create or expand facial recognition or voiceprint databases; infer emotions or sensitive attributes from biometric data; track individuals without legal basis and consent.</li>
              <li><strong className="text-white">8.7 IP misuse &amp; artist/style replicas.</strong> Infringe third-party IP or replicate the distinctive style/likeness of identifiable living artists or performers in a confusing or misleading manner.</li>
              <li><strong className="text-white">8.8 Security abuse.</strong> Probe, scan, or test system vulnerabilities; scrape or harvest content or metadata at scale; attempt reverse-engineering; bypass access controls/safety features; conduct DDOS or service abuse.</li>
              <li><strong className="text-white">8.9 Malware &amp; unlawful instructions.</strong> Generate malicious code or actionable instructions facilitating illegal acts.</li>
              <li><strong className="text-white">8.10 Age-inappropriate use.</strong> Target or materially involve children under 13 (or 16 where applicable).</li>
              <li><strong className="text-white">8.11 Use to train competitors.</strong> Use Inputs/Outputs to build, train, or improve a competing model or service (§6.5).</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-400">We may filter, block, or remove content; suspend or terminate access; and notify platforms or authorities where harm or illegality is suspected.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Use of Inputs/Outputs for Model Improvement; Opt-Out</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">9.1 Service operation vs. model improvement.</strong> We process Inputs/Outputs to operate the Service. Separately, with your consent or as permitted by law, we may use de-identified content and telemetry to improve models, safety systems, and features.</li>
              <li><strong className="text-white">9.2 Default &amp; regions.</strong> We will not use your content for model training where consent is required by law unless you opt-in (or, where legitimate interest applies, you may opt-out at any time).</li>
              <li><strong className="text-white">9.3 Opt-out mechanism.</strong> You may opt-out (or withdraw consent) at any time via Account Settings → Data &amp; Training or by emailing us. Processing for security/abuse detection and service telemetry may continue.</li>
              <li><strong className="text-white">9.4 De-identification.</strong> When using content for improvement, we apply technical and organizational measures to de-identify data where feasible.</li>
              <li><strong className="text-white">9.5 Public showcases.</strong> If you choose to publish your generations to public galleries/feeds, you grant us a license to display and promote that published content until you remove it or set it private.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. AI &amp; Safety Disclaimers</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">10.1 No guarantee of accuracy or suitability.</strong> The Service may generate inaccurate, biased, or unexpected Outputs. We provide no warranty that Outputs will meet your expectations or be fit for any particular purpose.</li>
              <li><strong className="text-white">10.2 Human review.</strong> You are responsible for human review, testing, and compliance checks (legal, regulatory, brand safety) before distribution or commercial use.</li>
              <li><strong className="text-white">10.3 Third-party policies.</strong> Distribution platforms (social networks, app stores, ad networks, marketplaces) may impose additional AI labeling or content rules. You are responsible for complying with them.</li>
              <li><strong className="text-white">10.4 Watermark/provenance variability.</strong> Technical measures (e.g., watermarks, content credentials) can be altered by format conversions or third-party tooling; you are still responsible for accurate disclosure and lawful use.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Limitation of Liability</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <p className="mb-4 text-sm">
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL REELZILLA OR ITS AFFILIATES, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY.
              </p>
              <p className="text-sm">
                SUBJECT TO MANDATORY LAW, OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) US$100 OR (B) THE AMOUNTS PAID BY YOU TO REELZILLA FOR THE SERVICE IN THE SIX (6) MONTHS PRECEDING THE CLAIM.
              </p>
            </div>
            <p className="mt-4 text-sm text-neutral-400">Some jurisdictions do not allow the above limitations; in such cases, liability is limited to the maximum extent permitted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Indemnification</h2>
            <p>You will defend, indemnify, and hold harmless Reelzilla and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising from or related to: (a) your Inputs/Outputs or use of the Service; (b) your breach of these Terms; (c) alleged infringement, violation of privacy, publicity, or other rights by your content; or (d) your misuse of biometric data or synthetic media.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Suspension; Termination; Data Retention</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">13.1 Suspension/termination.</strong> We may suspend or terminate access immediately if (a) you breach these Terms or law, (b) your use poses risk to users or platforms, (c) payment fails or chargebacks occur, or (d) as required by law or our providers.</li>
              <li><strong className="text-white">13.2 Your termination.</strong> You may terminate at any time in Account settings.</li>
              <li><strong className="text-white">13.3 Effect.</strong> Upon termination, your right to access the Service ceases. We may retain minimal records as required by law, for fraud prevention, or to resolve disputes. Download your content before closure; we may delete remaining data after a reasonable period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to the Service; Roadmap; Pricing</h2>
            <p>We may change, discontinue, or deprecate features (including specific Models), impose or change limits, or update pricing for future terms. Where changes materially reduce functionality you actively use, we will use reasonable efforts to provide notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law; Dispute Resolution</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">15.1 Governing law.</strong> This Agreement is governed by the laws of England and Wales, excluding its conflict-of-laws rules.</li>
              <li><strong className="text-white">15.2 Venue.</strong> The exclusive venue for disputes is London, England.</li>
              <li><strong className="text-white">15.3 Injunctive relief.</strong> Either party may seek injunctive or equitable relief for actual or threatened infringement, misappropriation, confidentiality, or security breaches in any competent court.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">16. Data Protection &amp; Privacy</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">16.1 Privacy Policy.</strong> Our{" "}
                <Link href="/privacy" className="text-[#D4FF4F] hover:underline">Privacy Policy</Link>{" "}
                (incorporated by reference) describes how we collect and process personal data, including cross-border transfers and rights requests.</li>
              <li><strong className="text-white">16.2 Processor/Controller roles.</strong> Depending on your configuration and jurisdiction, we may act as a processor for your organization with respect to certain personal data you upload; you are responsible for providing lawful basis and notices to data subjects.</li>
              <li><strong className="text-white">16.3 Subprocessors.</strong> We may engage vetted subprocessors (cloud, storage, safety tooling, model providers). A current list or description is available on request or posted in our trust resources.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">17. Third-Party Services &amp; Models</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">17.1 Integrations.</strong> The Service may route Inputs/Outputs to Third-Party Services (e.g., cloud renderers, model providers, payment processors). Your use of those services may be subject to their terms; if you do not accept them, do not enable the integration.</li>
              <li><strong className="text-white">17.2 Data sharing.</strong> To enable features, we may share Inputs/Outputs or derived data with Third-Party Services you select. We are not responsible for independent actions of third parties.</li>
              <li><strong className="text-white">17.3 No warranty.</strong> We do not guarantee continued availability of any Third-Party Service or specific Model and may substitute equivalent functionality.</li>
              <li><strong className="text-white">17.4 Open-source components.</strong> Certain components may be provided under their own licenses; those terms govern their components.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">18. Electronic Communications; E-Sign</h2>
            <p>You consent to receive electronic communications from us (email, in-app). You agree that all agreements, notices, disclosures, and other communications we provide electronically satisfy any legal requirement that such communications be in writing and are &quot;in writing&quot; and &quot;signed&quot; for e-signature purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">19. Copyright Complaints (DMCA-Style Procedure)</h2>
            <p className="mb-4">If you believe content on the Service infringes your copyright, please send a notice to{" "}
              <a href="mailto:support@reelzila.studio" className="text-[#D4FF4F] hover:underline">support@reelzila.studio</a>{" "}
              with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>your contact info;</li>
              <li>identification of the work and allegedly infringing material;</li>
              <li>a statement of good-faith belief;</li>
              <li>a statement under penalty of perjury that the information is accurate and you are authorized to act; and</li>
              <li>your signature.</li>
            </ul>
            <p className="mt-4">We may remove or disable access to the material and, where appropriate, accept counter-notices consistent with 17 U.S.C. §512 or analogous regimes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">20. Export Control &amp; Sanctions</h2>
            <p>You represent that you are not located in, under control of, or a national/resident of any country or person prohibited by U.S., EU, UK, or UN sanctions/export control laws. You will not export, re-export, or transfer the Service or Outputs in violation of such laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">21. Beta, Watermarks &amp; Content Credentials</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">21.1 Beta features.</strong> Beta or &quot;labs&quot; features are provided AS IS, may be rate-limited, and may change or cease at any time.</li>
              <li><strong className="text-white">21.2 Watermarks/provenance.</strong> We may apply watermarks or content credentials to Outputs, especially on certain plans or features. You must not remove or obscure them.</li>
              <li><strong className="text-white">21.3 Platform labels.</strong> Some distribution platforms require synthetic-media labels; you agree to apply them as required and not to remove platform-applied labels.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">22. Entire Agreement; Severability; Assignment; Waiver</h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong className="text-white">22.1</strong> These Terms, together with any Order/Form, Privacy Policy, and incorporated policies, constitute the entire agreement between you and us.</li>
              <li><strong className="text-white">22.2</strong> If any provision is found unenforceable, the remainder remains in effect, and the provision will be enforced to the maximum extent permissible.</li>
              <li><strong className="text-white">22.3</strong> You may not assign these Terms without our prior written consent; we may assign to an affiliate or in connection with merger, acquisition, or asset transfer.</li>
              <li><strong className="text-white">22.4</strong> No waiver of any term is a further or continuing waiver of that term or any other term.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">23. Notices; Contact</h2>
            <p className="mb-4">Notices to Reelzilla may be sent to our contact email. We may provide notices by email to the address on your Account or by posting in-product or on our website.</p>
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

          <section className="mt-12 pt-8 border-t border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-4">24. Marketplace (User-to-User Transactions)</h2>

            <ul className="list-disc list-inside space-y-4 ml-4">
              <li>
                <strong className="text-white">24.1 Marketplace scope.</strong> The Service may include a user-to-user marketplace (the &quot;Marketplace&quot;) allowing Users (&quot;Sellers&quot;) to list and sell and/or license AI-generated videos and related digital content (&quot;Marketplace Items&quot;) to other Users (&quot;Buyers&quot;).
              </li>
              <li>
                <strong className="text-white">24.2 Our role; contract between Buyer and Seller.</strong> Unless we expressly state otherwise in a specific checkout flow or Order confirmation, Marketplace Transactions are contracts directly between Buyers and Sellers. We are an intermediary service provider and are not the seller or buyer of Marketplace Items, and we do not take title to Marketplace Items.
              </li>
              <li>
                <strong className="text-white">24.3 Seller appointment of Reelzilla as commercial agent / collection agent (important).</strong> If you are a Seller, you appoint Reelzilla as your commercial agent for the limited purpose of (a) promoting and marketing your Marketplace Items, (b) facilitating and (where applicable) concluding Marketplace Transactions in your name, and (c) collecting payments from Buyers on your behalf and remitting your net proceeds (&quot;Seller Earnings&quot;) to you, subject to these Terms and the Marketplace Payment Terms. Reelzilla acts only on behalf of the Seller (as payee) and not on behalf of the Buyer (as payer). This arrangement is intended to support reliance on the &quot;commercial agent&quot; exclusion from payment services regulation where available; however, regulatory classification depends on the facts and applicable law.
              </li>
              <li>
                <strong className="text-white">24.4 Payment to Reelzilla discharges Buyer&apos;s payment obligation to Seller.</strong> Buyers agree that when they pay Reelzilla (or our designated payment service provider) for a Marketplace Transaction, they are paying the Seller via the Seller&apos;s authorised agent. As a result, payment to Reelzilla discharges the Buyer&apos;s payment obligation to the Seller for that Marketplace Transaction (subject to any refund rights).
              </li>
              <li>
                <strong className="text-white">24.5 Marketplace Payment Terms; third-party payment service providers.</strong> Marketplace payments, holds, payouts, chargebacks, refunds and disputes are governed by our Marketplace Payment Terms (the &quot;Payment Terms&quot;), which are incorporated by reference. Payments are processed by one or more third-party payment service providers (&quot;PSPs&quot;). You may be required to agree to PSP terms, and PSPs may carry out identity checks, sanctions screening and other compliance steps.
              </li>
              <li>
                <strong className="text-white">24.6 No payment account / stored value; Credits are not a Marketplace payment method.</strong> The Marketplace is not a payment account, e-money product, or stored value service. Unless we expressly state otherwise, Credits are for use within the video-generation SaaS features only and cannot be used to buy Marketplace Items or to withdraw funds.
              </li>
              <li>
                <strong className="text-white">24.7 Fees and deductions.</strong> We may charge Sellers and/or Buyers Marketplace fees, processing fees and/or other charges (including dispute/chargeback fees) as described in the Payment Terms. We may deduct such fees from amounts paid by Buyers before remitting Seller Earnings.
              </li>
              <li>
                <strong className="text-white">24.8 Holds, reserves, refunds and chargebacks.</strong> We may (and our PSPs may) place holds/reserves on Seller Earnings, delay payouts, or recover amounts from Sellers (including by set-off from future Seller Earnings) to cover refunds, chargebacks, disputes, fraud or policy breaches, as described in the Payment Terms.
              </li>
              <li>
                <strong className="text-white">24.9 Seller representations.</strong> Sellers represent and warrant that: (a) they have all rights, permissions, and licences needed to sell or license the Marketplace Items; (b) listings are accurate and not misleading; (c) Marketplace Items and listings comply with law and our AUP; and (d) they will comply with all tax obligations relating to their Marketplace activity.
              </li>
              <li>
                <strong className="text-white">24.10 Buyer responsibilities.</strong> Buyers are responsible for reviewing listings and ensuring Marketplace Items meet their needs. Because Marketplace Items are digital content, Marketplace purchases may be non-cancellable and non-refundable once delivery begins, except where required by law or expressly provided in the Payment Terms.
              </li>
              <li>
                <strong className="text-white">24.11 Changes; suspension.</strong> We may modify the Marketplace, eligibility, fees, payout methods, or suspend Marketplace access for compliance, risk, or policy reasons.
              </li>
            </ul>
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
