# SafeDeal — Next.js Marketplace

## Quick Reference

**Stack:** Next.js 16 + TypeScript + Tailwind + Prisma + Supabase + Cloudinary + Stripe + Resend

**Commands:**
```bash
npm run dev          # Start dev server
npx prisma db push   # Push schema to Supabase
npx prisma generate  # Regenerate Prisma client
npx next build       # Production build
```

## Key Rules

1. **Next.js 16**: `params` and `searchParams` are Promises — always `await` them
2. **Auth server-side**: Use `getUser()` or `getUserLight()` from `@/lib/auth-helpers`
3. **Auth client-side**: Use `useAuth()` from `@/app/providers`
4. **Stripe**: NEVER show Stripe branding — everything looks like SafeDeal's own payment
5. **Images**: Always use Cloudinary (upload via `/api/upload`, display via `getProductImageUrl()`)
6. **Emails**: Use functions from `@/lib/email.ts` (Resend)
7. **Prices**: Always display in pink (#E6007E)
8. **Design**: Follow DESIGN_SYSTEM.md — Wildberries style with Manrope font, white background
9. **Language**: All UI text in Spanish
10. **Never commit .env**

## Design Colors
- Primary: `#E6007E` (pink/magenta), Secondary: `#FF6B2B` (orange)
- Blue accent: `#0075FF` (search, trust icons)
- Background: `#FFFFFF`, Cards: white, Border: `#E2E8F0`
- Text: `#0F172A` / `#64748B` / `#94A3B8`
- Price: `#E6007E` (pink)
- Navbar: `#212121` (dark gray), Footer: `#1C1C1D`
- Font: Manrope (primary), Inter (secondary)

## File Patterns
- Server pages: `import { getUser } from "@/lib/auth-helpers"` + `prisma` + `redirect`
- Client pages: `"use client"` + `import { useAuth } from "@/app/providers"`
- API routes: `import { getUserLight } from "@/lib/auth-helpers"` + `prisma`

## Use the SafeDeal skill (.claude/skills/safedeal.md) for deep context on product vision, business model, and architecture.
