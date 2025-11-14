# BerryScore — Testing Strategy

## Philosophy

We prioritize:
1. **Critical path testing** - flows that affect revenue or data integrity
2. **Multi-tenancy testing** - ensure org isolation works
3. **Integration testing** - external APIs (Google, Stripe)

We deprioritize:
- Unit tests for simple utility functions
- UI snapshot tests (too brittle for solo dev)
- 100% coverage goals

## Testing Stack

- **Playwright** - E2E tests for critical flows
- **Vitest** - Unit tests for business logic
- **Manual checklists** - for feature acceptance

## Critical Flows to Test

### 1. Multi-tenancy Isolation
```typescript
// tests/multi-tenancy.spec.ts
test('users cannot access other org reviews', async () => {
  const org1 = await createTestOrg('Org 1');
  const org2 = await createTestOrg('Org 2');
  
  const review = await createTestReview(org1.id);
  
  // Try to access org1 review as org2 user
  const response = await getReviewAsUser(org2.userId, review.id);
  
  expect(response.status).toBe(403);
});
```

### 2. Auth & Onboarding
- Sign up flow
- Email verification (if added)
- Google OAuth connection
- Location selection

### 3. Review Management
- Review list loads correctly
- Filtering works
- Reply posting succeeds
- Reply appears in Google (mock in test)

### 4. Billing & Trial
- Trial starts on signup
- Trial expiry blocks writes
- Plan upgrade works
- Stripe webhook updates org status

## Manual Testing Checklist

Before each deployment to production:

**Phase 1 Checklist:**
- [ ] Can create account
- [ ] Cannot access app without login
- [ ] Different users see different orgs
- [ ] Trial countdown shows correctly
- [ ] Expired trial blocks reply button

**Phase 2 Checklist:**
- [ ] Google OAuth works
- [ ] Can see locations from Google
- [ ] Token refresh works
- [ ] "Reconnect" prompt shows on invalid token

**Phase 3 Checklist:**
- [ ] Reviews import from Google
- [ ] Filters work (rating, date, replied)
- [ ] Review detail drawer opens
- [ ] Can view full review text

**Phase 4 Checklist:**
- [ ] Can write reply
- [ ] AI suggestions appear
- [ ] Can edit AI suggestion
- [ ] Reply posts to Google
- [ ] Review marked as replied

## Test Data Setup
```typescript
// tests/helpers/setup.ts
export async function createTestOrg(name: string) {
  const user = await prisma.user.create({
    data: { email: `test-${Date.now()}@example.com`, name },
  });
  
  const org = await prisma.organization.create({
    data: { 
      name,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  
  await prisma.membership.create({
    data: { userId: user.id, organizationId: org.id, role: 'OWNER' },
  });
  
  return { user, org };
}
```

## CI/CD Integration

- Run tests on every PR
- Block merge if tests fail
- Run tests before deploy to production
```yaml
# .github/workflows/test.yml
name: Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npx playwright test
```