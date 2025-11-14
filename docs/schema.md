# BerryScore – Data Model (Prisma)

> This is the conceptual schema. The actual `schema.prisma` may also include fields from the SaaS starter (e.g. audit logs, roles, etc.).

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String?
  passwordHash String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  memberships  Membership[]
  replies      Reply[]
}

model Organization {
  id          String         @id @default(cuid())
  name        String
  country     String         @default("SE")
  plan        Plan           @default(FREE)
  stripeId    String?        // Stripe customer id

  trialEndsAt         DateTime?
  subscriptionStatus  String?        // 'active' | 'past_due' | 'canceled' | 'trialing'
  deletedAt          DateTime?       // for GDPR soft delete

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  memberships Membership[]
  locations   Location[]
  oauth       OauthAccount[]
  reviews     Review[]
  replies     Reply[]
  notifPrefs  NotificationPreference?

  @@index([deletedAt])
}

model Membership {
  id             String        @id @default(cuid())
  userId         String
  organizationId String
  role           Role          @default(MEMBER)
  createdAt      DateTime      @default(now())

  user           User          @relation(fields: [userId], references: [id])
  organization   Organization  @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
}

model Location {
  id             String        @id @default(cuid())
  organizationId String
  name           String
  googleLocationId String?     // GBP location identifier
  address        String?
  timezone       String?       @default("Europe/Stockholm")
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  organization   Organization  @relation(fields: [organizationId], references: [id])
  reviews        Review[]
}

model OauthAccount {
  id             String        @id @default(cuid())
  organizationId String
  provider       String        // "google"
  accessToken    String
  refreshToken   String
  tokenType      String?
  expiresAt      DateTime?
  scope          String?

  isValid        Boolean       @default(true)
  lastError      String?
  lastErrorAt    DateTime?

  organization   Organization  @relation(fields: [organizationId], references: [id])

  @@index([organizationId, provider])
}

model Review {
  id             String        @id @default(cuid())
  organizationId String
  locationId     String?
  source         ReviewSource  @default(GOOGLE)
  sourceReviewId String        // ID from Google
  authorName     String?
  rating         Int
  text           String?
  languageCode   String?
  createdAt      DateTime      // From source
  updatedAt      DateTime      @updatedAt

  replied        Boolean       @default(false)
  repliedAt      DateTime?
  reply          Reply?

  lastSyncedAt   DateTime      @default(now())
  syncVersion    Int           @default(1)

  organization   Organization  @relation(fields: [organizationId], references: [id])
  location       Location?     @relation(fields: [locationId], references: [id])

  @@unique([source, sourceReviewId])
  @@index([organizationId, createdAt])
  @@index([organizationId, lastSyncedAt])
}

model Reply {
  id             String        @id @default(cuid())
  reviewId       String        @unique
  organizationId String
  userId         String?
  text           String
  postedAt       DateTime      @default(now())
  source         ReviewSource  @default(GOOGLE)

  review         Review        @relation(fields: [reviewId], references: [id])
  organization   Organization  @relation(fields: [organizationId], references: [id])
  user           User?         @relation(fields: [userId], references: [id])
}

model NotificationPreference {
  id             String        @id @default(cuid())
  organizationId String        @unique
  instantEmail   Boolean       @default(true)
  dailyDigest    Boolean       @default(true)

  organization   Organization  @relation(fields: [organizationId], references: [id])
}

enum Role {
  OWNER
  MEMBER
}

enum Plan {
  FREE
  STARTER
  STANDARD
  PRO
}

enum ReviewSource {
  GOOGLE
  FACEBOOK
  TRUSTPILOT
  RECO
}
