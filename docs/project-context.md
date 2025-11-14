# BerryScore – Project Context (for AI assistants)

## About me
- I am a **product/UX designer by trade**, not an engineer.
- I understand product design, flows, and UX very well.
- I need help writing stable, clean, maintainable code without heavy jargon.
- I build this project **solo**, using AI as my primary engineering partner.

## How I work
- I work inside **VS Code** with **Claude Code** and **GitHub**.
- I rely on the AI to:
  - Explain things clearly
  - Make small, incremental changes
  - Support migrations, file edits, and wiring
  - Follow the architecture I define in `/docs`
  - Help me guide Claude Code within VSCode with clear prompts that keep Claude on track.
- I am comfortable editing and reviewing code, but I do **not** want:
  - Overly abstract solutions
  - Overly clever code
  - Major refactors unless asked
  - Large multi-file changes without explanation

## Tech & boilerplate
- I am using the **Next SaaS Stripe Starter** boilerplate (Next.js + Prisma + Auth.js + Stripe).
- The stack is:
  - Next.js App Router
  - TypeScript
  - Prisma + PostgreSQL
  - Auth.js for auth
  - Stripe for billing
  - Tailwind + shadcn/ui for UI
  - Resend for email
  - OpenAI for AI reply suggestions
  - Vercel for hosting
- Architecture, schema, and flows are documented in `/docs/architecture.md`, `/docs/schema.md`, `/docs/flows.md`.

## How AI should help me
- ChatGPT should help me understand what we are doing but mainly help me guide claude code to build the product. ChatGPT should also assist me with GitHub, so that we keep everything safe and clean, suggest when to push to github and create new branches.
- Claude Code will write and edit the code from the prompts that ChatGPT helps me come up with.
- Keep changes small and well-scoped.
- Before making big modifications, **explain the plan** and ask for confirmation.
- When editing code,:
  - Only edit the files I show you
  - Do NOT invent new folders or components unless requested
  - Preserve existing patterns
  - Use TypeScript
  - Use Prisma correctly
- When I ask for help, assume:
  - I want guidance, not just raw code
  - I prefer clear explanations
  - I want to understand what you're doing

## Communication guidelines
- Prefer clarity over cleverness.
- Don’t assume I know backend internals — explain simply if needed.
- Remind me if I’m missing a setup step (env vars, migration, etc.).
- Highlight potential pitfalls (multi-tenancy, API limits, logic flow).
- Offer to create GitHub issues, tasks, or file scaffolds.

## What success looks like
- A stable, clean, modern codebase that evolves predictably.
- I understand the flows and can debug simple things.
- AI + me build BerryScore Reviews step by step without chaos or confusion.
- Consistent architecture across all new chats.
