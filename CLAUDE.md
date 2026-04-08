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
7. **Prices**: Always display in blue (#4A7CF7)
8. **Design**: Follow DESIGN_SYSTEM.md — clean style with Manrope font, white background
9. **Language**: All UI text in Spanish
10. **Never commit .env**

## Design Colors
- Primary: `#4A7CF7` (blue), Hover: `#3A65D4`
- Secondary: `#E07840` (orange accent)
- Background: `#FFFFFF`, Cards: white, Border: `#E2E8F0`
- Text: `#0A0A0A` / `#5C5C5C` / `#8A8A8A`
- Price: `#4A7CF7` (blue)
- Hearts/Favorites: `#ef4444` (red)
- Navbar: `#0A0A0A` (black), Footer: `#0A0A0A`
- Light accent: `#EBF0FF` (light blue backgrounds)
- Font: Manrope (primary), Inter (secondary)

## File Patterns
- Server pages: `import { getUser } from "@/lib/auth-helpers"` + `prisma` + `redirect`
- Client pages: `"use client"` + `import { useAuth } from "@/app/providers"`
- API routes: `import { getUserLight } from "@/lib/auth-helpers"` + `prisma`

## Use the SafeDeal skill (.claude/skills/safedeal.md) for deep context on product vision, business model, and architecture.
