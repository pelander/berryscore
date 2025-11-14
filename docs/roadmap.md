# BerryScore – Roadmap (MVP-focused)

Time scales are approximate and assume part-time solo founder with AI assistance.

---

## Phase 0 – Setup & foundation (Week 0–1)

- Fork SaaS starter repo (Next.js + Prisma + Auth.js + Stripe).
- Run locally; understand pages and flows.
- Add `/docs` files (architecture, stack, flows, schema, etc.).
- Rebrand starter to “BerryScore”.
- Configure local DB (Neon or local Postgres).
- Verify auth and Stripe test mode flows work.

Deliverable:  
Branded, running app with auth + generic dashboard + Stripe test.

---

## Phase 1 – Core domain model (Week 1–2)

- Extend Prisma schema:
  - Organization, Membership, Location, OauthAccount, Review, Reply, NotificationPreference.
- Implement multi-tenancy helpers (current org lookup).
- Add stub pages:
  - `/reviews`, `/locations`, `/analytics`, `/settings`.
- Restrict all app routes by auth + org.

Deliverable:  
Tenant-aware skeleton for BerryScore-specific features.

---

## Phase 2 – Google integration (Week 2–3)

- Set up Google Cloud project + Business Profile API.
- Implement Google OAuth:
  - `/api/google/auth`, `/api/google/callback`.
- Store tokens in `OauthAccount`.
- List available GBP locations; allow user to select a location.
- Save `Location` with selected Google location ID.

Deliverable:  
Users can connect Google and see their locations.

---

## Phase 3 – Reviews ingestion & inbox (Week 3–4)

- Implement `fetchGoogleReviews` service.
- Create API route to perform initial import after connect.
- Add Vercel Cron route for daily refresh.
- Build Reviews inbox:
  - List with filters (rating, date, replied).
  - Detail drawer for a single review.

Deliverable:  
User sees real reviews from Google inside BerryScore.

---

## Phase 4 – Replying & AI suggestions (Week 4–5)

- Implement reply UI:
  - Textarea + “Send reply”.
- Post reply to Google via API.
- Save Reply model, update Review state.
- Integrate OpenAI:
  - `suggestReplies(reviewText, language, toneOptions)`.
  - Show 2–3 suggestions; user can choose and edit.
- Add success/ error states and basic logging.

Deliverable:  
Users can reply to reviews from the app with AI help.

---

## Phase 5 – Notifications & growth tools (Week 5–6)

- Configure Resend for transactional email.
- Implement:
  - Instant new review email notification.
  - (Optional) daily digest email.
- Build “Get more reviews” page:
  - Show direct GBP review link.
  - Generate QR code and allow PNG/PDF download.

Deliverable:  
BerryScore supports review habit loop + review generation.

---

## Phase 6 – MVP polish & beta (Week 6+)

- Clean up UI, microcopy (Swedish).
- Add basic analytics tiles on `/analytics`.
- Add settings for notification preferences.
- Plug Stripe plan names into pricing UI.
- Set trial handling (14 days) and read-only behavior after trial.
- Invite 3–10 Swedish SMBs for beta (friends, local businesses).
- Iterate based on feedback.

Deliverable:  
Real MVP with first external users and early learnings.

---

## Later phases (post-MVP, not required for initial launch)

- Add Facebook review integration.
- Add Trustpilot (read-only).
- Add Reco.se (via partnership).
- Build agency/white-label plan.
- Add Norwegian/Danish UI.
- Improve analytics (keywords, sentiment).
