# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BerryScore** is a production-ready SaaS application built with Next.js 14, featuring:
- Marketing pages and documentation
- User authentication (Google OAuth + Email) with Auth.js v5
- Subscription management with Stripe billing
- Admin dashboard with role-based access control
- MDX-based content management system (blog, docs, guides)
- Modern UI with Shadcn/ui components

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Update DATABASE_URL, GOOGLE_CLIENT_ID/SECRET, STRIPE keys, RESEND_API_KEY

# Development
pnpm run dev              # Start dev server with hot reload (port 3000)
pnpm run turbo            # Dev with Turbo bundler (faster)
pnpm run email            # Email preview server (port 3333)

# Production
pnpm run build            # Build for production
pnpm run start            # Start production server
pnpm run preview          # Local production preview

# Code quality
pnpm run lint             # ESLint check
```

## Architecture & Key Patterns

### Project Structure

```
berryscore/
├── app/                      # Next.js App Router (route groups separate concerns)
│   ├── (marketing)/          # Public pages (home, blog, pricing)
│   ├── (auth)/               # Login/register (no auth required)
│   ├── (protected)/          # Dashboard/admin (authenticated only)
│   ├── (docs)/               # Documentation pages
│   └── api/                  # API routes (auth, webhooks, user operations)
├── components/               # React components (organized by feature)
│   ├── ui/                   # Shadcn/ui pre-built components
│   ├── layout/               # Navbar, sidebar, headers
│   ├── forms/                # React Hook Form + Zod validation
│   └── [feature]/            # Feature-specific components
├── lib/                      # Server utilities & helpers
│   ├── db.ts                 # Prisma client singleton
│   ├── session.ts            # getCurrentUser() - auth helper
│   ├── subscription.ts       # Stripe plan & subscription logic
│   ├── stripe.ts             # Stripe client
│   ├── email.ts              # Resend email service
│   └── validations/          # Zod schemas for forms & APIs
├── actions/                  # Server actions (form submissions, mutations)
├── config/                   # Configuration files
│   ├── site.ts               # Site metadata & links
│   ├── dashboard.ts          # Sidebar nav with RBAC
│   ├── subscriptions.ts      # Pricing plans & Stripe IDs
│   └── [page].ts             # Page-specific configs
├── content/                  # MDX content (processed by Contentlayer2)
│   ├── blog/                 # Blog posts
│   ├── docs/                 # API documentation
│   ├── guides/               # How-to guides
│   └── pages/                # Static pages (privacy, terms)
├── prisma/
│   ├── schema.prisma         # Database schema (User, Account, Session, VerificationToken)
│   └── migrations/           # Database migrations
└── emails/                   # React Email templates
```

### Authentication & Session Management

**Auth Setup** (`auth.ts`, `middleware.ts`):
- **Provider**: Auth.js v5 with Google OAuth + Email magic links
- **Database**: PrismaAdapter persists users, accounts, sessions
- **Session Strategy**: JWT (stateless, scalable)
- **Protected Routes**: Middleware auto-validates all `/admin` and `/dashboard` routes
- **Session Helper**: `await getCurrentUser()` (cached) returns authenticated user or undefined

**User Model Fields**:
```prisma
User {
  id, email (unique), name, image, emailVerified,
  role (ADMIN | USER),
  // Stripe subscription
  stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd
}
```

### Database & ORM

**Prisma** manages all database operations:
- **Provider**: PostgreSQL (Neon serverless)
- **Singleton**: `import { prisma } from '@/lib/db'` - client is instantiated once per app
- **Type Safety**: Full TypeScript types generated from schema
- **Migrations**: Located in `prisma/migrations/`

### API Routes & Webhooks

**Auth API** (`app/api/auth/[...nextauth]/route.ts`):
- Exports GET/POST from `auth.ts`
- Handles Google OAuth callback, session management

**User API** (`app/api/user/route.ts`):
- DELETE: Deletes authenticated user (uses `auth()` wrapper)

**Stripe Webhook** (`app/api/webhooks/stripe/route.ts`):
- Validates webhook signature with Stripe secret
- Events: `checkout.session.completed` (new subscription), `invoice.payment_succeeded` (renewal)
- Updates user subscription fields in database

**OG Image** (`app/api/og/route.tsx`):
- Generates dynamic OpenGraph images with `@vercel/og`

### Subscription & Billing

**Plans** (`config/subscriptions.ts`):
- Starter: Free ($0)
- Pro: $15/month or $144/year
- Business: $30/month or $300/year

**Subscription Helper** (`lib/subscription.ts`):
```typescript
const plan = await getUserSubscriptionPlan(userId)
// Returns: { name, description, price, features, isSubscribed, isCanceled, ... }
```

**Stripe Integration Flow**:
1. User clicks "Upgrade" → `generateUserStripe()` server action
2. Creates Stripe checkout session with userId in metadata
3. User completes payment → Stripe webhook POSTs to API route
4. Webhook validates signature & updates user `stripeSubscriptionId`, `stripePriceId`, `stripeCurrentPeriodEnd`

### Content Management (Contentlayer2)

**MDX Processing**:
- **Files**: Located in `content/[type]/**/*.mdx`
- **Types**: Doc, Guide, Post, Page (defined in `contentlayer.config.ts`)
- **Computed Fields**: Auto-generates slug, slugAsParams, extracts images
- **Remark**: GitHub-flavored markdown (tables, strikethrough, etc.)
- **Rehype**: Syntax highlighting (rehype-pretty-code with GitHub Dark theme), auto-slug headings, auto-linking

**Generated Types**:
- Contentlayer auto-generates types to `.contentlayer/generated`
- Imported as `import { Doc, Guide, Post } from 'contentlayer/generated'`
- Used to fetch & render content in pages: `allDocs.find(doc => doc.slug === slug)`

### Form Validation & Server Actions

**Validation**: Zod schemas in `lib/validations/`
**Forms**: React Hook Form + Zod via `@hookform/resolvers`
**Server Actions**: `'use server'` functions in `actions/` for form submissions & mutations
- Example: `updateUserName()` validates input, updates database, returns result

## Common Development Tasks

### Adding a New Page

1. Create file in `app/(group)/page.tsx` (e.g., `app/(marketing)/features/page.tsx`)
2. Add to navigation in `config/site.ts` if public
3. Use `constructMetadata()` from `lib/utils.ts` for SEO

### Adding a New API Route

1. Create `app/api/route-name/route.ts`
2. Export async functions: `GET`, `POST`, `DELETE`, etc.
3. Protected routes: Use `auth()` wrapper to get session, throw 401 if unauthorized

### Creating a New Form

1. Define Zod schema in `lib/validations/[feature].ts`
2. Create component in `components/forms/[feature]-form.tsx`
3. Use `useFormStatus()` hook for loading state
4. Call server action on submit

### Adding New UI Component

1. Generate from Shadcn CLI: `npx shadcn-ui@latest add [component-name]`
2. Component appears in `components/ui/`
3. Customize Tailwind styling in `tailwind.config.ts` if needed

### Adding Content (Blog/Docs/Guides)

1. Create `.mdx` file in `content/blog/`, `content/docs/`, or `content/guides/`
2. Add frontmatter (title, description, date, etc.)
3. Contentlayer auto-generates slug from filename
4. Fetch in page with `allPosts.find(post => post.slug === slug)`

## Testing & Debugging

- **Email Preview**: Run `pnpm run email` → Open http://localhost:3333
- **Database**: Prisma Studio: `npx prisma studio`
- **Auth Debug**: Uncomment `debug: true` in `auth.ts` to log auth events
- **Stripe**: Use Stripe CLI to test webhooks locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Environment Variables

Required for local development (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `AUTH_SECRET` - JWT signing secret (generate: `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth credentials from Google Console
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe dashboard
- `RESEND_API_KEY` - Resend email service
- `NEXT_PUBLIC_APP_URL` - Application URL (http://localhost:3000 for dev)

## Key Dependencies & Versions

- **Next.js 14.2.5** - React framework with App Router
- **Prisma 5.17** - Type-safe ORM
- **Auth.js 5.0.0-beta.19** - Authentication
- **Stripe 15.12** - Payment processing
- **React Hook Form 7.52** - Form state management
- **Zod 3.23** - Runtime type validation
- **Tailwind CSS 3.4** - Utility-first styling
- **Shadcn/ui** - Radix UI + Tailwind components
- **Contentlayer2 0.5** - MDX content management
- **Resend 3.5** - Transactional email

## Important Patterns & Conventions

**Imports**: Use `@/` alias for project files (configured in `tsconfig.json`)

**Component Organization**: Functional components with TypeScript, server/client components as needed

**Database Queries**: Always import `{ prisma }` from `@/lib/db` (singleton instance)

**Protected Pages**: Use `const user = await getCurrentUser(); if (!user) redirect("/login");` at start

**API Protection**: Use `const session = await auth();` to check authorization

**Error Handling**: Use custom error classes from `lib/exceptions.ts`

**Metadata**: Use `constructMetadata()` for SEO on all pages

**Images**: Always use Next.js `<Image>` component with `width`, `height`, `alt`

**Tailwind Classes**: Use `cn()` util from `lib/utils.ts` to merge class names safely

## Common Gotchas

- Prisma Client must be used as singleton - don't create multiple instances
- Auth.js session callback runs on every API call - keep it lightweight
- Stripe webhook signature validation is critical - always verify `sig` header
- MDX frontmatter must match Contentlayer schema exactly or content won't render
- Remote images require hostname in `next.config.js` `images.remotePatterns`
- Database migrations must be committed - auto-generated during `pnpm install`

## Git & Deployment

- Current branch: `feature/rebrand-landing-page` (feature branch)
- Main branch: `main` (production)
- Deployment: Vercel (auto-deploys from main branch)
- Commit style: Conventional commits (feat, fix, docs, chore, refactor)
