# Starter Template Audit

## Overview

We're using the [Next.js SaaS Starter](https://github.com/leerob/next-saas-starter) as our foundation for BerryScore. This document tracks what exists, what we're keeping, what we're changing, and what we're adding.

**Date audited:** [Current Date]
**Starter version:** Next.js 14 + Prisma + Auth.js v5 + Stripe

---

## Database Schema

### What Already Exists ✅

**Auth Models (from NextAuth/Auth.js):**
- Account - OAuth providers (Google, GitHub, etc.)
- Session - User sessions
- User - Core user model with email/password
- VerificationToken - Email verification tokens

**User Fields:**
- id, name, email, emailVerified, image
- createdAt, updatedAt
- role (enum: ADMIN, USER)
- Stripe fields on User: stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd

**Key Observations:**
- ✅ Auth is complete and working
- ✅ Stripe billing exists (but on User, not Organization)
- ✅ Simple role system (ADMIN/USER)
- ⚠️ No multi-tenancy (no Organization model)

---

### What We're Adding for BerryScore 🆕

**Multi-Tenancy Foundation:**

We're adding Organization and Membership models to enable proper B2B multi-tenancy. See docs/schema.md for full Prisma definitions.

Key new models:
- Organization (with plan, trialEndsAt, country fields)
- Membership (links User to Organization with role)
- New Role enum (OWNER, MEMBER)
- New Plan enum (FREE, STARTER, STANDARD, PRO)

**BerryScore Domain Models:**

See docs/schema.md for complete Prisma schema including:
- Location (business locations with Google integration)
- OauthAccount (Google OAuth tokens per org)
- Review (normalized reviews from Google)
- Reply (owner responses to reviews)
- NotificationPreference (email notification settings)
- ReviewSource enum (GOOGLE, FACEBOOK, TRUSTPILOT, RECO)

---

### What We're Keeping (For Now) ⏸️

**Stripe Billing on User:**
- Keep stripeCustomerId, stripeSubscriptionId, etc. on User model initially
- This allows us to use the starter's billing code as-is
- Migration plan: Move to Organization model in Phase 5+ (after core features work)

**Reasoning:**
- Less refactoring upfront
- Can validate product faster
- Billing migration is straightforward once we're stable

---

## Architecture Decisions

### ✅ Decision: Add Multi-Tenancy Now (Light Approach)

**Approach:**
- Add Organization + Membership models in Phase 1
- Auto-create Organization on user signup
- Scope all BerryScore data by organizationId
- Keep Stripe billing on User temporarily (migrate later)

**Why this approach:**
1. Small upfront cost: Only ~1 extra day of work
2. Avoids painful migration: No need to refactor later
3. Matches our docs: All our planning assumes orgs
4. Enables growth: Can add team members when needed
5. Cleaner code: Logical data model from day 1
6. Customer mental model: Businesses think "my company" not "me personally"

**Trade-offs accepted:**
- Slightly more complex signup flow (auto-create org)
- Need to scope queries by org (but this is good practice anyway)
- Will need to move billing to Org later (but that's a small, focused change)

---

## Existing Features (From Starter)

### Authentication ✅
- Status: Working out of the box
- Provider: Auth.js (NextAuth) v5
- Methods: Email/password (credentials), OAuth providers (Google, GitHub - can remove GitHub)
- Features: Sign up, Sign in, Email verification, Password reset, Session management

**What we're keeping:**
- ✅ All auth flows
- ✅ Session handling
- ✅ Email verification

**What we're changing:**
- Add "Business Name" field to signup
- Auto-create Organization + Membership on signup
- Modify post-signup redirect to onboarding

---

### Billing (Stripe) ✅
- Status: Working in test mode
- Integration: Stripe Checkout + Customer Portal
- Features: Subscription creation, Plan changes, Cancellation, Webhook handling

**What we're keeping:**
- ✅ All Stripe integration code
- ✅ Webhook handlers
- ✅ Customer Portal

**What we're adapting:**
- Update pricing page with BerryScore plans (Starter, Standard, Pro)
- Update Stripe product IDs in config
- Add trial logic (14-day free trial)
- Add read-only mode when trial expires

**Migration plan (Phase 5+):**
- Move Stripe fields from User → Organization
- Update billing code to reference org.stripeCustomerId
- One-time data migration script

---

### Email (Resend) ✅
- Status: Configured and ready
- Provider: Resend
- Templates: React Email

**What we're keeping:**
- ✅ Email infrastructure
- ✅ Transactional email setup

**What we're adding:**
- Welcome email (Swedish)
- New review notification email
- Daily digest email
- Password reset (already exists, may translate)

---

### UI Components ✅
- Library: shadcn/ui (Radix-based)
- Styling: Tailwind CSS
- Status: Complete component library available

**Components available:**
- Button, Input, Select, Textarea
- Dialog, Sheet, Drawer
- Table, Card, Badge
- Toast notifications
- Form components

**What we're doing:**
- ✅ Use existing components as-is
- Add BerryScore-specific components in components/reviews/, components/locations/, etc.
- Keep UI components "dumb" and reusable

---

## File Structure

### What Exists (Starter)

app/
├── (marketing)/
│   ├── page.tsx              # Landing page
│   ├── pricing/page.tsx      # Pricing page
│   └── blog/                 # Blog (can remove)
├── (app)/
│   ├── layout.tsx            # Authenticated app shell
│   ├── dashboard/page.tsx    # Generic dashboard
│   └── settings/page.tsx     # User settings
├── api/
│   ├── auth/[...nextauth]/   # Auth.js handlers
│   └── stripe/webhook/       # Stripe webhooks
components/
├── ui/                       # shadcn components
└── layout/                   # Nav, footer, etc.
lib/
├── db.ts                     # Prisma client
├── auth.ts                   # Auth.js config
└── stripe.ts                 # Stripe helpers
prisma/
└── schema.prisma             # Database schema

### What We're Adding (BerryScore)

app/
├── (marketing)/
│   └── [Keep and rebrand]
├── (app)/
│   ├── onboarding/page.tsx         # NEW: Connect Google flow
│   ├── reviews/                    # NEW: Review inbox
│   │   ├── page.tsx
│   │   └── [reviewId]/page.tsx
│   ├── locations/page.tsx          # NEW: Location management
│   ├── analytics/page.tsx          # NEW: Simple analytics
│   ├── fler-recensioner/page.tsx   # NEW: Get more reviews (QR, link)
│   └── billing/page.tsx            # MODIFY: Add trial banner
├── api/
│   ├── google/
│   │   ├── auth/route.ts           # NEW: Start OAuth
│   │   └── callback/route.ts       # NEW: OAuth callback
│   ├── reviews/
│   │   ├── route.ts                # NEW: CRUD reviews
│   │   └── [id]/reply/route.ts     # NEW: Post reply
│   ├── cron/
│   │   ├── reviews-refresh/route.ts # NEW: Scheduled refresh
│   │   └── daily-digest/route.ts    # NEW: Daily email
│   └── ai/
│       └── suggest-reply/route.ts   # NEW: OpenAI suggestions
components/
├── reviews/                    # NEW: Review components
│   ├── ReviewTable.tsx
│   ├── ReviewDetailDrawer.tsx
│   ├── ReviewFilters.tsx
│   └── ReplyComposer.tsx
├── locations/                  # NEW: Location components
│   └── LocationSelector.tsx
└── onboarding/                 # NEW: Onboarding flow
    └── ConnectGoogleCard.tsx
lib/
├── org.ts                      # NEW: Organization helpers
├── google.ts                   # NEW: Google Business API
├── reviews.ts                  # NEW: Review fetch/normalize
├── ai.ts                       # NEW: OpenAI integration
├── email.ts                    # MODIFY: Add BerryScore emails
└── qr.ts                       # NEW: QR code generation

---

## Environment Variables

### Already Required (From Starter)

DATABASE_URL=                  # Neon Postgres
NEXTAUTH_SECRET=               # Auth.js secret
NEXTAUTH_URL=                  # App URL
STRIPE_SECRET_KEY=             # Stripe API key
STRIPE_WEBHOOK_SECRET=         # Stripe webhook signing
RESEND_API_KEY=                # Resend for email

### Need to Add for BerryScore

GOOGLE_CLIENT_ID=              # From Google Cloud Console
GOOGLE_CLIENT_SECRET=          # From Google Cloud Console
OPENAI_API_KEY=                # For reply suggestions
SENTRY_DSN=                    # Error tracking
NEXT_PUBLIC_SENTRY_DSN=        # Client-side errors

---

## Phase 0 Checklist

### ✅ Completed
- [x] Fork starter repo
- [x] Deploy to Vercel
- [x] Connect Neon database
- [x] Run locally (localhost:3000)
- [x] Test auth flows (signup, login)
- [x] Verify Stripe test mode works
- [x] Create comprehensive /docs folder
- [x] Audit starter template (this document)

### 🔲 Remaining
- [ ] Commit docs to GitHub
- [ ] Set up feature branch workflow
- [ ] Rebrand landing page (replace "SaaS Starter" with "BerryScore")
- [ ] Update pricing page with BerryScore tiers
- [ ] Configure all environment variables in Vercel
- [ ] Set up Sentry for error monitoring

---

## Next: Phase 1 Plan

### Goal
Add multi-tenancy foundation + BerryScore domain models

### Steps
1. Create feature branch: feature/phase-1-multi-tenancy
2. Add Organization + Membership models to schema
3. Add all BerryScore domain models (Location, Review, etc.)
4. Run migration: npx prisma migrate dev --name add_berryscore_models
5. Create lib/org.ts with helper functions
6. Update signup flow to auto-create Organization
7. Add simple org switcher (if user in multiple orgs)
8. Test multi-tenancy isolation

### Success Criteria
- ✅ User signup creates User + Organization + Membership
- ✅ All queries are scoped by organizationId
- ✅ Different users cannot access each other's data
- ✅ Can add stub pages for reviews, locations, etc.

---

## Known Technical Debt

### To Address in Future Phases

**Phase 5+: Move Billing to Organization**
- Migrate Stripe fields from User → Organization
- Update all billing code to use org.stripeCustomerId
- Write data migration script for existing users
- Test thoroughly before deploying

**Phase 6+: Enhanced Roles**
- Add more granular permissions (can_reply, can_manage_locations, etc.)
- Build role management UI
- Add audit log for sensitive actions

**Post-MVP: Performance**
- Add database indexes for common queries
- Implement caching for review counts
- Optimize Google API calls (batch requests)

---

## Questions/Uncertainties

### Resolved ✅
- Should we add multi-tenancy now or later?
  - Decision: Add now (light approach) to avoid painful migration later

### Open Questions
- Should we remove the blog functionality from starter? (Probably yes)
- Do we need ADMIN role at all? (Maybe just for internal use)
- Should we add soft-delete to User model too? (Later, if needed)

---

## Notes

- Starter is very clean and well-structured
- Auth and billing "just work" - huge time saver
- Adding multi-tenancy is additive, not destructive
- We're keeping 80% of starter code untouched
- Main work is adding BerryScore-specific features on top