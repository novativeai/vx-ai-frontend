# Testing Feedback Fixes Plan
**Date:** 2026-01-15
**Source:** Reelzila-testing-feedback.pdf

---

## Summary of Issues & Fixes

### Issue #1: Country Dropdown - "Other" won't work
**File:** `src/app/signup/page.tsx` (lines 44-52)
**Fix:** Replace limited country list with comprehensive ISO country list (all ~195 countries)
**Priority:** High

### Issue #2: Email Verification Redirect
**Current:** Shows static "Your email has been verified" page with no redirect
**Fix:** Create Firebase auth action handler page at `/auth/action` that:
- Handles email verification callbacks
- Auto-redirects to signin page after success
**Priority:** Medium

### Issue #3: Video Generation Failed (VEO 3.1)
**File:** `video-generator-backend/main.py`
**Root Cause:**
- `duration` sent as `"4"` but VEO 3.1 reference-to-video only accepts `"8s"`
- `image_url` sent but endpoint requires `image_urls` (array)
**Fix:**
1. Update FAL_MODELS config to use `image_urls` for VEO 3.1
2. Format duration with 's' suffix for VEO models
3. Remove 4s/6s duration options from frontend for VEO 3.1 (only 8s allowed)
**Priority:** Critical

### Issue #4: Payment Processing Stuck
**File:** `src/app/payment/pending/page.tsx`
**Root Cause:** Webhook not firing or payment status not updating in Firestore
**Fix:**
- Add timeout with fallback redirect
- Add manual "Check Status" button
- Improve error handling
**Priority:** High

### Issue #5: Second Generation Failed
**Same as #3** - VEO 3.1 API parameter issues

### Issue #6: Website Slow (>20s checkout)
**File:** `src/components/PurchaseFormModal.tsx`
**Possible Causes:**
- PayTrust API latency
- Large component bundle
**Fix:**
- Add loading skeleton/spinner immediately
- Lazy load modal content
- Add timeout handling
**Priority:** Medium

### Issue #7: Remove "Powered by PayTrust"
**File:** `src/components/PurchaseFormModal.tsx` (lines 218-220)
**Fix:** Delete the text element
**Priority:** Low (quick fix)

### Issue #8: Inconsistent Payment Messages
**Files:**
- `src/app/payment/pending/page.tsx` - "Processing Payment"
- Marketplace purchase uses different flow
**Fix:** Unify messaging across both flows
**Priority:** Low

### Issue #9: "Back to Marketplace" Wrong Redirect
**File:** `src/app/marketplace/purchase/success/page.tsx` (lines 99-101)
**Current:** Already points to `/marketplace` - need to verify
**Fix:** Ensure href is `/marketplace` (may be a different page)
**Priority:** Medium

### Issue #10: History Videos Cropped
**File:** `src/components/HistoryCard.tsx`
**Current:** Uses AspectRatio 1:1 with object-cover (crops non-square videos)
**Fix:**
- Change to AspectRatio 16:9 for videos
- Keep 1:1 for images
- Or use object-contain to show full video
**Priority:** Medium

### Issue #11: "Back to History" Wrong Redirect
**File:** `src/app/marketplace/create/page.tsx` (lines 163-166)
**Current:** Points to `/explore`
**Fix:** Change to `/account?tab=history` or `/explore#history`
**Priority:** Low (quick fix)

### Issue #12: Billing History Not Updated
**File:** `src/app/account/page.tsx`
**Root Cause:** PayTrust webhook not updating payment status, or second payment not recorded
**Fix:** Backend webhook investigation needed
**Priority:** High (related to #4)

---

## Implementation Order

### Phase 1: Critical Backend Fixes
1. Fix VEO 3.1 generation parameters (duration format, image_urls)
2. Verify PayTrust webhook is updating Firestore correctly

### Phase 2: Quick Frontend Fixes
3. Remove "Powered by PayTrust" text
4. Fix "Back to History" redirect
5. Add all countries to signup

### Phase 3: UX Improvements
6. Fix history video display (aspect ratio)
7. Add email verification redirect
8. Unify payment messages
9. Add timeout/fallback to payment pending page

### Phase 4: Performance
10. Optimize checkout loading
