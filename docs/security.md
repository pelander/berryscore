# BerryScore — Security Guidelines

## Multi-tenancy Security

### Golden Rules

1. **NEVER trust client-supplied organization IDs**
2. **ALWAYS derive org context from authenticated session**
3. **EVERY database query MUST filter by organizationId**
4. **Use helper functions consistently**

### Required Helper Functions

Located in `lib/org.ts`:
```typescript
// Get current user's organization from session
export async function requireOrganization(userId: string): Promise<Organization>

// Verify user has access to specific org
export async function verifyOrgAccess(userId: string, orgId: string): Promise<boolean>

// Get org from request context (for API routes)
export async function getOrgFromRequest(req: Request): Promise<Organization>
```

### API Route Pattern

Every API route must follow this pattern:
```typescript
// app/api/reviews/route.ts
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const org = await requireOrganization(session.user.id);

  // Now safe to query with org.id
  const reviews = await prisma.review.findMany({
    where: { organizationId: org.id }, // REQUIRED
  });

  return Response.json({ data: reviews });
}
```

## OAuth Token Security

### Storage
- Tokens stored in `OauthAccount` table
- Access tokens and refresh tokens MUST be encrypted at rest
- Use Vercel environment variable encryption

### Token Lifecycle
1. Store tokens after OAuth callback
2. Check `isValid` flag before use
3. Auto-refresh access tokens before expiry
4. On auth error (401, 403), mark `isValid = false`
5. Show user "Reconnect Google" prompt

### Implementation
```typescript
// lib/google-auth.ts
export async function getValidGoogleToken(orgId: string): Promise<string> {
  const oauth = await prisma.oauthAccount.findFirst({
    where: { organizationId: orgId, provider: 'google' },
  });

  if (!oauth || !oauth.isValid) {
    throw new OAuthInvalidError('Please reconnect Google');
  }

  // Check if token expired
  if (oauth.expiresAt && oauth.expiresAt < new Date()) {
    // Refresh token logic
    return await refreshGoogleToken(oauth);
  }

  return decrypt(oauth.accessToken);
}
```

## Rate Limiting

### External APIs
- Google Business Profile API has rate limits
- Implement exponential backoff for 429 responses
- Track retry attempts, max 3 retries
```typescript
// lib/api-helpers.ts
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  
  throw lastError!;
}
```

## Data Privacy (GDPR)

### User Rights
1. **Right to access**: `/api/org/export` returns all org data as JSON
2. **Right to deletion**: Two-phase delete process
3. **Right to portability**: Export in machine-readable format

### Deletion Flow
```typescript
// Soft delete (30-day grace period)
await prisma.organization.update({
  where: { id: orgId },
  data: { deletedAt: new Date() },
});

// Hard delete (after 30 days or immediate on request)
await prisma.$transaction([
  prisma.reply.deleteMany({ where: { organizationId: orgId } }),
  prisma.review.deleteMany({ where: { organizationId: orgId } }),
  prisma.location.deleteMany({ where: { organizationId: orgId } }),
  prisma.oauthAccount.deleteMany({ where: { organizationId: orgId } }),
  prisma.membership.deleteMany({ where: { organizationId: orgId } }),
  prisma.organization.delete({ where: { id: orgId } }),
]);
```

## Input Validation

- Use Zod for all API inputs
- Validate on server, not just client
- Sanitize user input before database storage
```typescript
import { z } from 'zod';

const ReplySchema = z.object({
  reviewId: z.string().cuid(),
  text: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validated = ReplySchema.parse(body); // Throws if invalid
  // ... proceed with validated data
}
```

## Monitoring & Alerts

- All errors sent to Sentry with context:
```typescript
  Sentry.captureException(error, {
    extra: { orgId, userId, action: 'fetch_reviews' },
  });
```
- Set up Sentry alerts for:
  - OAuth failures
  - Rate limit hits
  - Database query errors
  - Payment webhook failures