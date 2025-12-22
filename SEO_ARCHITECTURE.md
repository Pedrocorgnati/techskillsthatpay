# SEO Architecture

This document describes how SEO is implemented for the multi-domain, multi-locale blog.

## Canonical Strategy
- Canonicals are domain-aware and always point to the ccTLD host for the current locale.
- Canonical overrides are supported per post via frontmatter (`canonicalOverride`).
- Internal links avoid `/en|/pt|/es|/it` prefixes to keep mapped domains clean.

## hreflang Strategy
- hreflang is emitted only for locales that exist for a translationKey.
- `x-default` is emitted only when an EN translation exists.
- hreflang URLs are domain-aware and map to ccTLD hosts.

## Sitemap Strategy
- `/sitemap.xml` returns a locale-specific sitemap based on request host.
- `/sitemap-index.xml` aggregates all locale sitemaps for Search Console convenience.
- Post entries use `updated` for `lastmod` and include cover images.
- Category/tag URLs appear only when a locale has enough posts (see `MIN_POSTS_FOR_INDEX`).
- Static pages use a stable lastmod derived from latest post or a fixed fallback.

## Robots Strategy
- `/robots.txt` disallows `/admin`, `/api/admin`, and `/api/`.
- Preview deployments set `Disallow: /` and add `X-Robots-Tag: noindex`.

## Structured Data (Schema.org)
- WebSite + Organization JSON-LD is rendered in `app/[lang]/layout.tsx`.
- BlogPosting JSON-LD is rendered on post pages.
- BreadcrumbList JSON-LD is rendered on post, category, and tag pages.

## Pagination & Thin Pages
- Pagination pages are noindex with canonical to the first page.
- Category/tag pages are noindex if they have fewer than 3 posts.

## Feeds
- RSS is available per locale at `/rss.xml` (host-based rewrite to `[lang]/rss.xml`).
- RSS autodiscovery links are emitted per locale via metadata alternates.

## Preview Environment Indexing Policy
- `VERCEL_ENV=preview` triggers `X-Robots-Tag: noindex` and robots disallow all.
- Prevents duplicate indexing of preview builds.

## Validation
- Run `npm run seo:check` to validate canonicals, hreflang, sitemaps, html lang, and JSON-LD coverage.
