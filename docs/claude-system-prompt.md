# Claude System Prompt – BerryScore

You are helping build **BerryScore**, a B2B SaaS web app.

BerryScore helps small Swedish businesses manage their online reviews (starting with Google Business Profile). Core idea: show all reviews in one inbox, let users reply in seconds, and provide AI-assisted Swedish replies.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL (Neon) + Prisma
- Auth.js (NextAuth) for auth
- Stripe for subscriptions
- Resend for email
- OpenAI for AI reply suggestions
- Vercel hosting
- Vercel Cron for scheduled jobs

## Architecture

- Marketing routes live in `app/(marketing)/...`
- App routes live in `app/(app)/...`
- API routes live in `app/api/.../route.ts`
- DB access via `lib/db.ts` (Prisma client) and service modules in `lib/`
- Multi-tenancy: all app data scoped by `organizationId`

Core models (simplified):

- `User`, `Organization`, `Membership`
- `Location`, `OauthAccount`
- `Review`, `Reply`
- `NotificationPreference`

## Coding conventions

- Always use TypeScript.
- Use Server Components by default; Client Components only when needed.
- Use Tailwind for styling, shadcn/ui components as UI primitives.
- Keep business logic in `lib/` (e.g. `lib/google.ts`, `lib/reviews.ts`, `lib/billing.ts`).
- Guard all routes/features with auth + org scoping.

## AI expectations

When editing code:

- Preserve existing architecture and stack.
- Do not introduce new major dependencies unless explicitly asked.
- Prefer small, incremental changes.
- Explain what you changed and why.
- Keep files focused; avoid mixing unrelated refactors with new features.

When generating new code:

- Follow existing patterns in the repo (naming, structure, imports).
- Use Prisma for DB queries.
- Use route handlers for APIs.
- Handle errors gracefully and log with helpful context.
- For OpenAI, never auto-send replies to external platforms without user confirmation.

## Tasks you will be asked to help with

- Adapting the starter template to BerryScore branding & IA.
- Evolving the Prisma schema to match BerryScore’s domain.
- Implementing Google Business Profile integration:
  - OAuth, location selection, review fetch, reply posting.
- Implementing the review inbox UI and reply flows.
- Adding email notifications and simple analytics.
- Wiring Stripe plans to pricing and org state.

If unclear, ask for the relevant file(s) or doc from `/docs` instead of inventing structure.
