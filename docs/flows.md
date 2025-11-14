
---

## `flows.md`

```md
# BerryScore – User Flows

Primary persona:  
**Single-location Swedish business owner** (e.g. salon, café).

---

## Flow 1 – Discover → Sign up

1. User lands on marketing site.
2. Reads hero:
   - “Hantera alla dina omdömen på ett ställe.”
3. Sees 3-step explainer + pricing.
4. Clicks **“Testa gratis i 14 dagar”**.
5. Goes to sign-up:
   - Name, email, password, company name.
6. On submit:
   - User + Organization + Membership created.
7. Lands in onboarding screen inside app.

---

## Flow 2 – Connect Google Business Profile

1. Onboarding screen:
   - Step 1: “Koppla ditt Google-konto”.
   - Button: **Connect Google**.
2. Redirect to Google OAuth.
3. User consents to Business Profile scopes.
4. Redirect back to `/google/callback`.
5. App:
   - Stores tokens in `OauthAccount`.
   - Calls Google API to list locations.
6. User picks location (if multiple).
7. App:
   - Saves Location.
   - Starts initial review import.
8. User sees a loader + message:
   - “Hämtar dina senaste omdömen…”
9. Redirect to Reviews inbox when done.

---

## Flow 3 – Reviews inbox & first reply

1. User lands on `/reviews`.
2. Sees table/list of most recent reviews:
   - rating, snippet, date, replied status.
3. Clicks an unreplied review.
4. Detail drawer opens:
   - Full text, rating, date.
   - Textbox for reply.
   - Button: **“Föreslå svar med AI”**.
5. User clicks AI button:
   - App calls OpenAI.
   - Shows 2–3 suggested replies (friendly, professional, apologetic).
6. User selects one, edits if needed.
7. User clicks **“Skicka svar”**.
8. App:
   - Calls Google API to post reply.
   - Saves Reply in DB.
   - Marks Review as replied.
9. Status badge changes to “Besvarat”.

---

## Flow 4 – Email notifications

### Instant

1. Cron or webhook detects new review OR refresh job finds new review.
2. App sends email via Resend:
   - Subject: “Nytt omdöme för [Företagsnamn]”.
   - Content: rating, text, link to reply in app.
3. User clicks “Svara nu” → goes directly to that review in app.

### Daily digest

1. Daily cron runs at e.g. 08:00.
2. For each org with digest enabled:
   - Gather reviews from previous day.
   - Compute small summary (count, average rating, unreplied count).
3. Email summary with links to inbox.

---

## Flow 5 – Get more reviews (review link & QR)

1. User goes to `/fler-recensioner` (or part of settings).
2. App shows:
   - Direct GBP review link.
   - QR code pointing to that link.
3. User:
   - Copies link for email/SMS/website.
   - Downloads QR PNG or PDF.
4. User prints and puts at checkout → customers scan and leave reviews.

---

## Flow 6 – Analytics

1. User goes to `/analytics`.
2. App queries:
   - average rating (last 90 days),
   - number of new reviews this month vs last,
   - reply rate.
3. Shows:
   - 3 KPI tiles.
   - Line chart: reviews per month.
   - Small insight text: e.g. “Du har svarat på 85 % av alla omdömen senaste 30 dagarna.”

---

## Flow 7 – Subscription & trial

1. New users get 14-day free trial by default.
2. Banner in app shows days remaining.
3. User clicks “Välj plan” → `/billing`.
4. Sees plan cards (Starter, Standard, Pro).
5. Clicks “Välj plan” → Stripe Checkout.
6. On success:
   - Stripe webhook updates `Organization.plan` + status.
   - Banner disappears; billing page shows active plan and next billing date.
7. If trial ends without upgrade:
   - App switches to read-only mode:
     - Reviews visible, but replying is blocked.
   - Large CTA to activate a plan.

---

## Flow 8 – Settings

1. User goes to `/settings`.
2. Sections:
   - Profile (name, email).
   - Organization (name, country).
   - Locations (list connected; later: add/remove).
   - Notifications (instant email, daily digest toggles).
3. User saves changes; app updates DB.

---

## Flow 9 – Cancel & re-activate

1. User goes to `/billing`.
2. Clicks “Avsluta prenumeration”.
3. Either:
   - Redirect to Stripe customer portal to cancel, or
   - In-app cancel flow that calls Stripe API.
4. When cancelled:
   - Org stays active until current period end.
   - Then switches to free/read-only mode.
5. User can re-activate by going back to `/billing` and choosing a plan.

