# BerryScore – Tech Stack

Goal: modern, boring, well-documented stack that’s easy for AI and other devs to work with.

---

## Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React (Server + Client Components)
- **Styling:** Tailwind CSS
- **Component library:** shadcn/ui (Radix-based, headless & accessible)
- **Charts (later):** simple chart lib (e.g. recharts) if needed

Reasons:
- Next.js App Router is the current standard for React SSR.
- TS + Tailwind + shadcn is extremely AI-friendly; no heavy CSS architecture to maintain.

---

## Backend

- **Runtime:** Node.js via Next.js API routes & server actions
- **Framework:** Next.js app router, route handlers
- **Validation:** Zod where needed on API inputs

Reasons:
- Single codebase for frontend + backend simplifies mental model.
- No extra backend service needed for MVP.

---

## Database & ORM

- **Database:** PostgreSQL (Neon in prod; local Postgres or SQLite in dev)
- **ORM:** Prisma

Reasons:
- Postgres is the default relational DB for SaaS.
- Prisma’s schema and TS typings are very readable and AI-friendly.

---

## Auth & sessions

- **Auth library:** Auth.js (NextAuth) v5
- **Methods:**
  - Email/password credentials (MVP)
  - Potential Google login later

Reasons:
- No need to maintain custom JWT logic.
- Widely used with Next.js; lots of examples.
- Easy to extend with providers later.

---

## Billing & subscriptions

- **Payment processor:** Stripe
- **Usage:**
  - Stripe Checkout for sign-up / plan change
  - Stripe Customer Portal for self-serve billing
  - Webhook for subscription status updates

Reasons:
- Industry standard, excellent docs.
- Starter template already wired to Stripe.
- Test mode for development is straightforward.

---

## Email

- **Provider:** Resend
- **Templates:** React Email or JSX-based templates

Usage:
- Transactional emails (welcome, password reset).
- New review alerts.
- Daily digest (later).

---

## AI

- **Provider:** OpenAI API
- **Model (MVP):** GPT-4.x / GPT-4o-mini tier for cost-efficiency
- **Usage:** Generate Swedish-tone reply suggestions for reviews.

Design:
- Suggestions only; user must confirm final text before sending to platforms.
- System prompt encodes Swedish tone guidelines.

---

## Jobs & background tasks

- **Scheduler:** Vercel Cron
- **Execution:** hit Next.js API route that:
  - Refreshes reviews for all active locations.
  - Sends daily digests.

If needed later:
- Introduce Upstash QStash or a minimal job queue for more robust scheduling.

---

## Hosting & DevOps

- **Hosting:** Vercel
- **Database hosting:** Neon (Postgres-as-a-service)
- **Monitoring:** Sentry (errors) + PostHog (product analytics)
- **CI/CD:** Built into Vercel (deploys on push to main + previews on PRs)

---

## Security & compliance

- **Secrets:** managed via Vercel env vars (encrypted at rest)
- **Multi-tenancy:** all data access scoped by `organizationId` via helper functions
- **OAuth:** Google OAuth for Business Profile API, minimal scopes, tokens encrypted
- **Error monitoring:** Sentry for production errors with context
- **Rate limiting:** Exponential backoff for external APIs
- **GDPR:**
  - Data export API endpoint (`/api/org/export`)
  - Soft-delete with `deletedAt` timestamp
  - Hard-delete cascade for account deletion
  - Documented subprocessors (Vercel, Neon, Stripe, Resend, OpenAI, etc.)
  - 30-day data retention after soft delete

## Environment Variables

Required for local development and production:
```bash
# Database
DATABASE_URL=              # Neon Postgres URL

# Auth
NEXTAUTH_SECRET=           # Generate with: openssl rand -base64 32
NEXTAUTH_URL=              # http://localhost:3000 (local) / production URL

# Stripe
STRIPE_SECRET_KEY=         # sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=     # whsec_...

# Email
RESEND_API_KEY=            # re_...

# AI
OPENAI_API_KEY=            # sk-...

# Google OAuth
GOOGLE_CLIENT_ID=          # From Google Cloud Console
GOOGLE_CLIENT_SECRET=      # From Google Cloud Console

# Monitoring
SENTRY_DSN=                # From Sentry project settings
NEXT_PUBLIC_SENTRY_DSN=    # Same as above (public)
```
