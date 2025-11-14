# BerryScore — Environment Setup

## Local Development

### 1. Prerequisites
- Node.js 18+ 
- PostgreSQL (or use Neon for local dev too)
- Git

### 2. Clone & Install
```bash
git clone [your-repo]
cd berryscore
npm install
```

### 3. Environment Variables

Create `.env.local`:
```bash
# Copy from .env.example
cp .env.example .env.local
```

Required variables:
```bash
# Database - Get from Neon or use local Postgres
DATABASE_URL="postgresql://user:pass@localhost:5432/berryscore"

# Auth - Generate secret
NEXTAUTH_SECRET="[run: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"

# Stripe - Get from Stripe Dashboard (test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # From Stripe CLI

# Email - Get from Resend
RESEND_API_KEY="re_..."

# AI - Get from OpenAI
OPENAI_API_KEY="sk-..."

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="..."

# Monitoring (optional for local)
SENTRY_DSN="https://...@sentry.io/..."
```

### 4. Database Setup
```bash
# Push schema to database
npx prisma db push

# (Later, use migrations)
npx prisma migrate dev

# Open Prisma Studio to view data
npx prisma studio
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Setup (Vercel)

### 1. Create Vercel Project
```bash
vercel
```

### 2. Connect Neon Database
- Create Neon project
- Copy connection string
- Add to Vercel environment variables

### 3. Add All Environment Variables
Go to Vercel Dashboard > Settings > Environment Variables

Add all variables from `.env.local` with production values

### 4. Configure Domains
- Add custom domain in Vercel
- Configure DNS (usually just CNAME)

### 5. Set Up Stripe Webhooks
- Go to Stripe Dashboard > Webhooks
- Add endpoint: `https://yourdomain.com/api/stripe/webhook`
- Copy webhook secret to Vercel env vars

### 6. Configure Cron Jobs
In `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reviews-refresh",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### 7. Set Up Monitoring
- Create Sentry project
- Add DSN to Vercel env vars
- Configure alerts in Sentry

## Google Cloud Setup

### 1. Create Project
- Go to Google Cloud Console
- Create new project: "BerryScore"

### 2. Enable APIs
- Google Business Profile API
- Google My Business API (if separate)

### 3. Create OAuth Credentials
- APIs & Services > Credentials
- Create OAuth 2.0 Client ID
- Application type: Web application
- Authorized redirect URIs:
  - `http://localhost:3000/api/google/callback` (dev)
  - `https://yourdomain.com/api/google/callback` (prod)
- Copy Client ID and Secret to env vars

### 4. Configure OAuth Consent Screen
- User type: External (for MVP)
- Add app name, logo, support email
- Scopes: only what's needed for Business Profile
- Add test users for development

## Resend Setup

### 1. Create Account
- Sign up at resend.com
- Verify your domain

### 2. Configure DNS
Add these DNS records to your domain:
- SPF record
- DKIM record
(Resend provides exact values)

### 3. Create API Key
- Copy API key to env vars
- Keep this secret!

## Stripe Setup

### 1. Create Account
- Sign up at stripe.com
- Complete business verification (for production)

### 2. Create Products
In Stripe Dashboard:
- Create "Starter" product ($X/month)
- Create "Standard" product ($Y/month)
- Create "Pro" product ($Z/month)
- Note down Price IDs

### 3. Configure Webhook
- Webhooks > Add endpoint
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events to listen for:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 4. Test Mode
- Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database (DANGER: deletes all data)
npx prisma migrate reset
```

### OAuth Not Working
- Check redirect URIs match exactly
- Ensure Google Cloud project is not in test mode
- Verify scopes are correct

### Stripe Webhooks Failing
- Check webhook secret matches
- Verify endpoint is publicly accessible
- Check Stripe Dashboard > Webhooks > Attempts for errors

### Email Not Sending
- Verify DNS records (SPF, DKIM)
- Check Resend dashboard for delivery status
- Ensure "from" email is from verified domain