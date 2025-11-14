# BerryScore – Roadmap (MVP-focused)

Time scales are approximate and assume part-time solo founder with AI assistance.

---

## Phase 0 — Setup & foundation (Week 0–1)

- Fork SaaS starter repo (Next.js + Prisma + Auth.js + Stripe)
- Run locally; understand pages and flows
- Add `/docs` files (architecture, stack, flows, schema, etc.)
- Rebrand starter to "BerryScore"
- Configure local DB (Neon or local Postgres)
- Verify auth and Stripe test mode flows work

**Security & Error Setup:**
- Set up Sentry for error monitoring
- Configure all environment variables in Vercel
- Create `lib/errors.ts` with custom error classes
- Set up SPF/DKIM for Resend email domain

**Git Workflow:**
- Configure GitHub branch protection on `main`
- Set up feature branch workflow
- Configure Vercel preview deployments for PRs
- Set up Neon branch databases for previews

Deliverable:  
Branded, running app with auth + generic dashboard + Stripe test + proper monitoring.

---

## Phase 1 — Core domain model + Security (Week 1–2)

- Extend Prisma schema:
  - Organization (add trial fields, deletedAt)
  - Membership, Location
  - OauthAccount (add isValid, error tracking)
  - Review (add sync tracking), Reply, NotificationPreference

**Multi-tenancy Security:**
- Create `lib/org.ts` with `requireOrganization()` helper
- Create `lib/auth-helpers.ts` for session + org access
- Add middleware to check org access on all app routes
- Test org scoping with different users

**Trial & Billing Logic:**
- Add trial check middleware
- Create trial banner component
- Add read-only mode for expired trials
- Create billing status helpers

**GDPR Foundation:**
- Create `lib/gdpr.ts` with export/delete functions
- Add soft delete to organization model
- Create data export API endpoint

- Add stub pages:
  - `/reviews`, `/locations`, `/analytics`, `/settings`
- Restrict all app routes by auth + org

Deliverable:  
Secure, tenant-aware skeleton with trial logic and GDPR basics.

---

## Phase 2 — Google integration (Week 2–3)

- Set up Google Cloud project + Business Profile API
- Implement Google OAuth:
  - `/api/google/auth`, `/api/google/callback`
- Store tokens in `OauthAccount`
- List available GBP locations; allow user to select a location
- Save `Location` with selected Google location ID

Deliverable:  
Users can connect Google and see their locations.

---

## Phase 3 — Reviews ingestion & inbox (Week 3–4)

- Implement `fetchGoogleReviews` service
- Create API route to perform initial import after connect
- Add Vercel Cron route for daily refresh
- Build Reviews inbox:
  - List with filters (rating, date, replied)
  - Detail drawer for a single review

Deliverable:  
User sees real reviews from Google inside BerryScore.

---

## Phase 4 — Replying & AI suggestions (Week 4–5)

- Implement reply UI:
  - Textarea + "Send reply"
- Post reply to Google via API
- Save Reply model, update Review state
- Integrate OpenAI:
  - `suggestReplies(reviewText, language, toneOptions)`
  - Show 2–3 suggestions; user can choose and edit
- Add success/error states and basic logging

Deliverable:  
Users can reply to reviews from the app with AI help.

---

## Phase 5 — Notifications & growth tools (Week 5–6)

- Configure Resend for transactional email
- Implement:
  - Instant new review email notification
  - (Optional) daily digest email
- Build "Get more reviews" page:
  - Show direct GBP review link
  - Generate QR code and allow PNG/PDF download

Deliverable:  
BerryScore supports review habit loop + review generation.

---

## Phase 6 — MVP polish & beta (Week 6+)

- Clean up UI, microcopy (Swedish)
- Add basic analytics tiles on `/analytics`
- Add settings for notification preferences
- Plug Stripe plan names into pricing UI
- Set trial handling (14 days) and read-only behavior after trial
- Invite 3–10 Swedish SMBs for beta (friends, local businesses)
- Iterate based on feedback

Deliverable:  
Real MVP with first external users and early learnings.

---

## Later phases (post-MVP, not required for initial launch)

- Add Facebook review integration
- Add Trustpilot (read-only)
- Add Reco.se (via partnership)
- Build agency/white-label plan
- Add Norwegian/Danish UI
- Improve analytics (keywords, sentiment)