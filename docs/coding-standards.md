# BerryScore Reviews – Coding Standards

Goal: keep the codebase simple, consistent, and AI-friendly.

---

## General

- Use **TypeScript everywhere**.
- Prefer **small, focused functions and components**.
- Avoid premature optimization; clarity > cleverness.
- Keep business logic in `lib/` or service modules, not inside React components.

---

## React & Next.js

- Use **Server Components by default** where possible.
- Use Client Components only when:
  - Using browser-only APIs (window, localStorage, etc.).
  - Needing interactive state (forms, drawers, filters).
- Place routes under:
  - `app/(marketing)/...` for public pages.
  - `app/(app)/...` for authenticated app.
- Do not mix marketing and app layouts.

---

## Components

- Prefer composition over deep prop drilling.
- Keep UI components dumb and reusable.
- Use `components/ui` for shadcn-based components:
  - `Button`, `Input`, `Select`, `Dialog`, `Table`, etc.
- Use `components/<domain>/...` for feature-specific components:
  - e.g. `components/reviews/ReviewTable.tsx`.

---

## Styling

- Use **Tailwind CSS** for styling.
- Avoid custom CSS files unless necessary.
- Use design tokens via Tailwind config (colors, font sizes, spacing).
- Keep classes readable; use Prettier/Tailwind plugin for sorting.

---

## Data access & Prisma

- Define all models in `schema.prisma`.
- Run `npx prisma migrate dev` for any schema change.
- Do not access `prisma` directly in components; create helper functions in `lib/db` or `lib/services` for complex operations.
- Always scope queries by `organizationId` for multi-tenant safety.

---

## Auth & multi-tenancy

- Use Auth.js for sessions.
- Create helper(s) to:
  - Get current user from session.
  - Get current organization (via Membership).
- Never trust client-supplied org IDs; derive from session context.
- Guard all app routes to ensure an org is selected.

---

## API routes

- Use `app/api/.../route.ts` with route handlers.
- Validate request bodies with Zod where appropriate.
- Return structured JSON with `data` or `error` keys.
- For cron routes, log summary of work done.

---

## Errors & logging

- Use Sentry for unexpected errors in prod.
- Wrap critical areas (e.g. Stripe webhooks, Google API calls) with try/catch and log errors.
- Show user-friendly error messages, not raw error objects.

---

## Git & PRs

- Small, atomic commits.
- Commit messages:
  - `feat: ...`
  - `fix: ...`
  - `chore: ...`
  - `refactor: ...`
- Avoid letting AI modify huge chunks of the repo at once.

---

## AI usage

- When asking AI to edit files:
  - Provide the relevant file content.
  - State clearly what you want changed.
  - Ask it to keep unrelated code intact.
- After AI changes:
  - Run `npm run lint` and `npm run test` if available.
  - Manually verify key flows in the browser.

