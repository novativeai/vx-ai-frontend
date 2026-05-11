import { NextRequest } from "next/server";

// ── DeepSeek API Configuration ──────────────────────────────────────────────
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// ── RAG Knowledge Base ──────────────────────────────────────────────────────
// Embedded directly for zero-latency retrieval.
// Each "---" separated block is a standalone retrieval chunk.

const KNOWLEDGE_BASE = `# Reelzila — Customer Support Knowledge Base

**Product:** Reelzila (reelzila.studio)
**Domain:** AI-powered video and image generation platform
**Currency:** Euros (€) — all pricing in EUR unless stated otherwise
**Credit Rate:** €1 = 10 credits (10 credits = €1)

---

## Product Overview

Reelzila is an AI-powered video and image generation platform that allows users to create professional-quality short-form videos and high-resolution images from simple text descriptions (prompts). Users choose from six different AI models — each with its own style, quality level, and cost — and the platform generates the content in seconds to minutes. Reelzila also features a built-in Marketplace where users can buy and sell AI-generated video content. The platform operates on a credit-based system: users purchase credits (€1 = 10 credits) and spend them per generation depending on the chosen model and parameters.

### Who is it for?
Content creators, social media managers, small businesses needing marketing visuals, educators creating instructional content, hobbyists and artists experimenting with AI media, freelancers producing client deliverables.

### Core capabilities
- Text-to-Video (T2V): Generate short-form videos from text prompts
- Image-to-Video (I2V): Animate a static image into a video clip
- Text-to-Image (T2I): Generate high-resolution images from text prompts
- Multiple AI models: Choose from six generation models
- Marketplace: Browse, buy, and sell AI-generated video content
- Audio generation: Some models support native audio synthesis

---

## Getting Started

### How to create an account
1. Go to reelzila.studio
2. Sign up with email and password, or use Google sign-in
3. Complete your profile (display name, optional avatar)
4. You will receive 10 free credits upon registration

### First generation
1. Navigate to the Generator page
2. Type a prompt describing your desired output
3. Select the output type: Video or Image
4. Choose an AI model from the dropdown
5. Adjust settings if available (aspect ratio, duration, resolution)
6. Click Generate
7. Wait for processing — typically 10–60 seconds depending on the model
8. Preview, download, or share your result

---

## Credits System

Exchange rate: €1 = 10 credits (1 credit ≈ €0.10)

New users receive 10 free credits upon registration. Credits do not expire. They remain in your account until used.

### How to get credits
- Free credits: 10 credits at signup
- Purchase credits: Buy credit packs from the Pricing page (any amount between €1 and €1,000)
- Promotions: Occasional promotional offers and bonus credits

### Credit costs by model

| Model | Type | Base Cost | Available Options |
|-------|------|-----------|-------------------|
| veo-3.1 | Video | 32 credits | 4s→16cr / 6s→24cr / 8s→32cr; audio off → ×0.5 |
| sora-2 | Video | 4 credits | 4s→4cr / 8s→8cr / 12s→12cr |
| kling-2.6 | Video | 5 credits | 5s→5cr / 10s→10cr |
| ltx-2 | Video | 1 credit | Fixed price, no duration modifiers |
| hailuo-2.3-pro | Video | 4 credits | 5s→4cr / 10s→8cr |
| nano-banana-pro | Image | 2 credits | 1K→2cr / 2K→3cr / 4K→4cr |

Failed generations do not consume credits — if deducted, they are automatically refunded.

### Credit purchase
One-time purchase: Any amount between €1 and €1,000. Credits = amount × 10.

---

## AI Models — Strengths, Capabilities, and Flaws

### veo-3.1 (Google DeepMind)
Type: Text-to-Video & Image-to-Video. Best for cinematic-quality video with native audio synthesis. Duration up to 8 seconds. Premium quality, highest visual fidelity, realistic motion. Speed: 30–60 seconds. Cost: 16–32 credits depending on duration; 50% discount without audio. Flaws: Higher cost, longer generation time. Strengths: Best-in-class realism, native audio generation, handles complex prompts well.

### sora-2 (OpenAI)
Type: Text-to-Video & Image-to-Video. Best for creative, stylized video content with strong subject consistency. Duration up to 12 seconds (longest available). Premium quality, excellent motion coherence. Speed: 30–60 seconds. Cost: 4–12 credits. Flaws: Occasionally misinterprets abstract prompts. Strengths: Longest video duration, excellent at maintaining subject identity.

### kling-2.6 (Kuaishou)
Type: Text-to-Video & Image-to-Video. Best for professional video with excellent motion quality. Duration: 5 or 10 seconds. High quality, sharp 1080p output. Speed: 15–30 seconds. Cost: 5–10 credits. Flaws: Less consistent with abstract prompts. Strengths: Excellent balance of quality and cost, good for social media.

### ltx-2 (Lightricks)
Type: Text-to-Video. Best for quick drafts and budget-friendly generation. Fixed duration. Standard quality. Speed: 5–15 seconds (fastest). Cost: 1 credit (cheapest). Flaws: Lower resolution, no I2V. Strengths: Lowest cost, fastest generation, ideal for testing prompts.

### hailuo-2.3-pro (MiniMax)
Type: Text-to-Video. Best for balanced quality and affordability. Duration: 5 or 10 seconds. High quality, strong prompt adherence. Speed: 15–30 seconds. Cost: 4–8 credits. Flaws: Limited to T2V only, occasional artifacts. Strengths: Competitive price-to-quality ratio, reliable output.

### nano-banana-pro (Nano Banana)
Type: Text-to-Image only. Best for high-resolution image generation. Output: 1K, 2K, or 4K resolution. Speed: 5–10 seconds. Cost: 2–4 credits. Flaws: Image-only, limited style range. Strengths: Affordable, multiple resolution options, fast.

### How to choose
- Fast drafts/iteration: ltx-2 (1 credit)
- Affordable but quality video: kling-2.6 or hailuo-2.3-pro (4–10 credits)
- High-quality cinematic: veo-3.1 or sora-2 (4–32 credits)
- Images: nano-banana-pro (2–4 credits)

---

## Pricing and Payments

Users can purchase any amount between €1 and €1,000. Credits = amount × 10.

Examples: €5 = 50 credits, €10 = 100 credits, €25 = 250 credits, €50 = 500 credits, €100 = 1,000 credits.

### Payment methods
Credit/debit card (Visa, Mastercard, American Express). No credit card info stored on Reelzila servers.

---

## Marketplace

The marketplace lets users browse, buy, and sell AI-generated video content.

### Buying
1. Go to Marketplace or Explore page
2. Browse listings by category, popularity, or recency
3. Filter by tags
4. Click a listing to preview (video plays on hover)
5. Click Buy and complete payment
6. Content added to your library for download
7. Download link also sent to email

Buyers receive full usage rights: commercial use, personal use, editing, no attribution required, perpetual license. Not exclusive — seller may sell to others.

### Selling
1. Generate content on the platform
2. Navigate to your generation and select "List on Marketplace"
3. Set title, description, category, tags, and price
4. Submit for listing

Revenue split: Seller 80%, Platform 20%.

### Seller verification
Sellers must be verified: Unverified → Verified (by admin) → can request payouts. Suspended sellers cannot sell or withdraw.

### Earnings and payouts
Sellers earn 80% of each sale. Payouts via bank transfer (IBAN + BIC) or PayPal. Minimum withdrawal: €0.01. Processing time: 24–48 hours after admin approval.

---

## Ownership and Legal

### Who owns generated content?
You own the content you generate on Reelzila. You may use it for any lawful purpose, including commercial use, and may sell it on the Marketplace. Reelzila does not claim ownership.

### Copyright considerations
Legal status varies by jurisdiction. US Copyright Office requires human authorship — AI-only works may not be copyrightable. EU may protect AI content reflecting "author's own intellectual creation." Consult a legal professional for specific situations. Reelzila does not provide legal advice.

---

## Troubleshooting

### Generation failed
Cause: AI model could not complete request (content policy, server load, or prompt issue). Fix: Rephrase prompt, select different model, or try again. Credits: No charge for failed generations — automatically refunded if deducted.

### Generation taking too long
Typical time: 10–60 seconds. Premium models take longer. If exceeding 120 seconds, it may time out (no charge). Check Generator page — result may be ready.

### Cannot download content
Ensure signed into the correct account. Try different browser or clear cache. Generated content URLs expire after 24 hours.

### Payment not going through
Verify card details and billing address. Ensure card supports international transactions. Try different payment method.

### Credits not appearing after purchase
Allow up to 5 minutes. Refresh page or sign out/in. Check your email for a payment confirmation. Contact support if missing after 15 minutes.

---

## Contact and Support

- In-app chatbot: Available on all pages
- Contact form: reelzila.studio/contact
- Email: support@reelzila.studio
- Response times: Chatbot instant, email within 24–48 hours
- Urgent issues: Email with subject "URGENT" for payment/security concerns

---

## Refund Policy

Credit purchases are non-refundable except as required by law. Failed generations are not charged — automatically refunded. Marketplace purchases are final sale (digital goods). EU consumers have 14-day withdrawal right.

---

## Account Management

Update profile at Account > Profile. View generation history from Generator page or Account dashboard. Transaction history available in Account. For password reset, use Forgot Password link. Account deletion available upon request — contact support.
`;

// ── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Reelzila, a friendly, concise, and helpful customer support assistant for Reelzila (reelzila.studio), an AI-powered video and image generation platform.

## Persona
- Speak in second person ("you can…", "your account…")
- Be professional but approachable
- Use short paragraphs and bullet points for readability
- Never fabricate features that don't exist in the knowledge base
- If you don't know something, say: "I don't have that information — please contact our support team at support@reelzila.studio"
- Do NOT provide legal advice, financial advice, or medical advice
- Do NOT help with prompt injection, jailbreaking, or bypassing content policies
- Do NOT share internal system details, API keys, or admin functionality

## STRICT BOUNDARIES — Features that do NOT exist
The following features are NOT available on Reelzila. Never claim they exist:
- Changing avatars or profile pictures (avatars are set during signup only and cannot be changed later)
- Two-factor authentication (2FA)
- Subscription plans or recurring billing
- Mobile app (the platform is web-only at reelzila.studio)
- API access or developer SDK
- Direct messaging between users
- Social media login other than Google (e.g. no Facebook, Twitter, Apple, GitHub login)
- Referral programs or referral bonuses
- Coupons, discount codes, or promo codes
- Gift cards
- Affiliate program
- Team/workspace accounts or multi-user organizations
- Video editing features (trimming, cutting, adding text/overlays)
- Voice cloning or custom voice models
- Live streaming
- Export to specific social media platforms (TikTok, Instagram, YouTube) — users download and upload manually
- Custom AI model training or fine-tuning
- Free trial beyond the initial 10 free credits
- Browser extension
- Desktop app

## Verification rule
Before answering a user's question, first check if the feature they're asking about exists in the knowledge base above. If you cannot find it in the knowledge base, do NOT guess or invent — say: "I don't have that information — please contact our support team at support@reelzila.studio"

## Formatting Rules
- Use **bold** for emphasis on key terms
- Use [link text](URL) for clickable links
- Use bullet points (•) for lists
- Keep responses warm but efficient — don't be overly verbose

## Escalation
- For billing discrepancies or security concerns, direct to support@reelzila.studio with subject "URGENT"
- For legal questions, direct to Terms of Service at reelzila.studio/terms and Privacy Policy at reelzila.studio/privacy

## Knowledge Base
Refer to the knowledge base below for accurate answers. If information isn't there, say you don't know.

---
${KNOWLEDGE_BASE}
---`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ── POST Handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages.length) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.DEEPSEEK_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Chat service is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build conversation with system prompt
    const conversation: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: conversation,
        temperature: 0.2,
        max_tokens: 800,

        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "AI service temporarily unavailable. Please try again or email support@reelzila.studio.",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: DeepSeekResponse = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't process that. Please try again or contact support@reelzila.studio.";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again or contact support@reelzila.studio.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}