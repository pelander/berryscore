# BerryScore – Architecture

BerryScore is a B2B SaaS web app that helps small Swedish businesses manage and reply to their online reviews (starting with Google Business Profile).

Core idea:  
**“All your reviews. One simple inbox. Reply in seconds.”**

---

## High-level overview

- **Frontend:** Next.js App Router + React + TypeScript
- **Backend:** Next.js API routes + server components/actions
- **DB:** PostgreSQL (Neon) via Prisma
- **Auth:** Auth.js (NextAuth) with email/password (and optional social later)
- **Billing:** Stripe subscriptions (test mode first)
- **Email:** Resend for transactional + notifications
- **AI:** OpenAI for Swedish reply suggestions
- **Hosting:** Vercel
- **Jobs:** Vercel Cron hitting API routes on schedule

---

## Core domains

1. **Accounts & orgs**
   - User
   - Organization (company)
   - Membership (user ↔ org)

2. **Locations & integrations**
   - Location (a physical business location tied to an org)
   - OauthAccount (Google tokens per org/location)

3. **Reviews & replies**
   - Review (normalized from Google, later other sources)
   - Reply (outgoing owner reply)
   - NotificationPreference (org-level)

4. **Billing**
   - Subscription state stored on Organization (backed by Stripe)

---

## Main features (MVP)

1. **Onboarding**
   - Create account, create organization, connect Google, pick location.

2. **Review inbox**
   - List reviews for selected location.
   - Filter by rating, date, replied/unreplied.
   - Open review details in drawer.

3. **Replying**
   - Compose reply in app.
   - Optional AI-generated suggestions (Swedish).
   - Post reply to Google.
   - Mark as replied, store Reply row.

4. **Notifications**
   - Email when new review comes in.
   - Optional daily digest.

5. **Analytics (simple)**
   - Average rating.
   - Reviews per period.
   - Response rate (% replied).

6. **Growth**
   - Direct Google review link.
   - QR code generator for in-store use.

7. **Settings**
   - Org & location management.
   - Notification preferences.
   - Subscription / billing.

---

## Directory structure (planned)

Using Next.js App Router:

- `app/`
  - `(marketing)/`
    - `page.tsx` – landing page
    - `pricing/page.tsx`
  - `(app)/`
    - `layout.tsx` – authed app shell
    - `dashboard/page.tsx` – overview / shortcut to reviews
    - `reviews/page.tsx` – main inbox
    - `analytics/page.tsx`
    - `locations/page.tsx`
    - `settings/page.tsx`
    - `billing/page.tsx`
  - `api/`
    - `auth/[...nextauth]/route.ts` – Auth.js
    - `google/auth/route.ts` – start OAuth flow
    - `google/callback/route.ts` – handle OAuth callback
    - `cron/reviews-refresh/route.ts` – refresh reviews (cron)
    - `cron/daily-digest/route.ts` – daily summary emails
    - `stripe/webhook/route.ts` – subscription updates

- `components/`
  - `layout/` – nav bars, shells
  - `reviews/` – inbox table, detail drawer, filters
  - `analytics/`
  - `settings/`
  - `ui/` – shadcn-based components (Button, Input, Dialog, Table, Badge, etc.)

- `lib/`
  - `db.ts` – Prisma client
  - `auth.ts` – Auth.js config/helpers
  - `google.ts` – Google Business API client
  - `reviews.ts` – review fetch/normalize helpers
  - `billing.ts` – Stripe integration
  - `email.ts` – Resend wrapper + templates
  - `ai.ts` – OpenAI reply suggestions
  - `org.ts` – tenant helpers
  - `qr.ts` – QR code generation

- `prisma/`
  - `schema.prisma` – DB models
  - migrations/

- `docs/` – project docs (this file and others)

---

## Data flow (Google reviews)

1. **Connect Google**
   - User clicks “Connect Google”.
   - Auth flow gets consent and OAuth tokens.
   - Tokens stored in `OauthAccount` tied to org.

2. **Import reviews (initial)**
   - User triggers import (or automatically after connect).
   - API route calls Google Business Profile API.
   - Reviews normalized and upserted into `Review` table.

3. **Refresh reviews (cron)**
   - Vercel Cron schedules `/api/cron/reviews-refresh`.
   - For each active Location:
     - Fetch new/updated reviews.
     - Upsert into DB.
     - Emit events for new reviews.

4. **Notify user**
   - New review → send email via Resend.
   - Daily cron → aggregate stats and send digest if enabled.

5. **Reply**
   - User opens review, optionally asks for AI suggestion.
   - Posts reply -> API calls Google, stores `Reply`, marks `Review.replied` true.

---

## Multi-tenancy model

- Every user belongs to at least one Organization via Membership.
- All queries are scoped by current organization:
  - Middleware or helpers ensure `orgId` is always present.
- Locations, Reviews, Replies, NotificationPreferences, and billing state all belong to an Organization.

---

## Non-goals (for MVP)

- No mobile apps (web only, but responsive).
- No Facebook / Trustpilot / Reco integrations yet (Google first).
- No complex RBAC beyond `owner` / `member`.
- No extended admin backoffice beyond basic user/org management.
- No SMS sending in MVP (emails only).
