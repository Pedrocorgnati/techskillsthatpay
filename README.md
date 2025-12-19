# TechSkillsThatPay Blog (Next.js + MDX)

Full Next.js App Router blog for **techskillsthatpay.com** with MDX content, Tailwind CSS, and SEO baked in.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + typography plugin
- MDX via `next-mdx-remote/rsc` (server-friendly compilation for App Router)
- `gray-matter` + `reading-time` + `slugify` for content pipeline

## Getting started
```bash
npm install
npm run dev
```
Visit http://localhost:3000.

## Project structure
- `app/` – routes (home, posts, categories/tags, search, courses, about, privacy, disclosure, contact, sitemap, robots).
- `components/` – UI pieces (cards, badges, CTA, newsletter).
- `lib/posts.ts` – loads/parses MDX, caches posts, compiles MDX.
- `content/posts/*.mdx` – blog posts with frontmatter.

## Adding a post
1. Create a new file in `content/posts/your-slug.mdx`.
2. Include frontmatter:
   ```yaml
   ---
   title: "Post title"
   description: "One-liner for lists and SEO."
   date: "2024-07-01"
   updated: "2024-07-10"
   tags: ["tag one", "tag two"]
   category: "Category Name"
   slug: "your-slug"
   coverImage: "https://images.unsplash.com/..." # optional
   affiliateDisclosure: true
   readingTime: "auto" # will be overridden by runtime calculation
   ---
   ```
3. Write MDX content. Components available inside MDX: `<AffiliateCTA />`, `<NewsletterBox />`, and styled links.
4. `reading-time` and tag/category slugs are computed automatically at runtime; no extra step needed.

## Deployment (Vercel)
1. Push the repo to GitHub/GitLab.
2. Import into Vercel as a Next.js project.
3. Set **Build Command**: `npm run build`, **Output**: `.next`.
4. Enable **Edge Runtime** defaults as-is (not required for this project).
5. After the first deploy, add the custom domain `techskillsthatpay.com` in Vercel’s Domains tab and set DNS to Vercel’s nameservers or add the provided CNAME record.

## Domain configuration
- Primary domain: `techskillsthatpay.com`
- Add a redirect for `www.techskillsthatpay.com -> techskillsthatpay.com` in Vercel if desired.
- Ensure DNS A/CNAME records point to Vercel; TTL 300s recommended while propagating.

## Linting & formatting
```bash
npm run lint
npm run format
```

## SEO & feeds
- `generateMetadata` on key routes for OpenGraph/Twitter.
- `app/sitemap.ts` and `app/robots.txt/route.ts` auto-generate sitemap and robots.
- JSON-LD `BlogPosting` injected on post pages.

## AdSense & affiliates checklist
- [ ] Add your AdSense verification/meta tags to `app/layout.tsx` or Vercel env.
- [ ] Add AdSense script snippet to a layout or specific pages where ads should render.
- [ ] Replace affiliate placeholder URLs (`https://example.com/aff/...`) with real links.
- [ ] Keep `affiliateDisclosure: true` in frontmatter when affiliate links are present.
- [ ] Validate `robots.txt` and `sitemap.xml` after going live.
- [ ] Run `npm run build` locally to ensure production readiness before shipping.

## Why `next-mdx-remote/rsc`?
It compiles MDX during request/build time on the server, keeping the App Router tree server-friendly without bundling MDX parsing into the client. Frontmatter is parsed with `gray-matter` for type safety and enriched with reading-time + slug helpers in `lib/posts.ts`.

## Production modes
- **Vercel/serverless**: prefer `ADMIN_ENABLED=false` to hide admin UI; content-store `mock` does not persist writes. Use Git-based commits for content or move to a real DB/storage.
- **VPS/container**: set `CONTENT_STORE_PROVIDER=fs` and ensure the `content/posts` directory is writable/persisted (volume). Admin can publish MDX directly.

## Admin security & feature flags
- `ADMIN_ENABLED` (default: true in dev, false in prod) hides `/admin` and `/api/admin/*` when false.
- `ADMIN_AUTH_ENABLED` (default: false in dev, true in prod) enables Basic Auth for `/admin` and admin APIs. Requires `ADMIN_AUTH_USER` / `ADMIN_AUTH_PASS`.
- `CONTENT_STORE_PROVIDER` = `fs | mock` (default fs). `mock` is in-memory only; good for demos.
- `NEXT_PUBLIC_CONTENT_STORE_PROVIDER` mirrors the provider for UI warnings.

## Contact + providers
- `/api/contact` uses a provider interface. Defaults to `CONTACT_PROVIDER=mock` (logs only). Future providers (`resend`, `sendgrid`) are scaffolded but require `CONTACT_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.
- The contact form uses honeypot + simple rate-limit.

## Analytics & Ads (optional, flag controlled)
- `ANALYTICS_PROVIDER` = `none | ga4 | plausible` with `GA4_ID` or `PLAUSIBLE_DOMAIN`.
- `ADSENSE_ENABLED` plus `ADSENSE_PUBLISHER_ID` injects the AdSense script and enables `<AdSlot/>` (renders null when disabled).

## i18n middleware behavior
- Detects cookie `locale` > `Accept-Language`; bots (Googlebot/Bingbot/etc.) default to `en` without lang-based redirect.
- `?nolocale=1` query skips locale redirect and sets `locale=en` cookie.

## Env vars (see `.env.example`)
- Admin: `ADMIN_ENABLED`, `ADMIN_AUTH_ENABLED`, `ADMIN_AUTH_USER`, `ADMIN_AUTH_PASS`
- Content store: `CONTENT_STORE_PROVIDER`, `NEXT_PUBLIC_CONTENT_STORE_PROVIDER`
- Contact: `CONTACT_PROVIDER`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_API_KEY`
- Analytics: `ANALYTICS_PROVIDER`, `GA4_ID`, `PLAUSIBLE_DOMAIN`
- Ads: `ADSENSE_ENABLED`, `ADSENSE_PUBLISHER_ID`
- Research: `PPLX_API_KEY`
