# Publishing Architecture

## Single source of truth

Publishing is handled exclusively by:
- `POST /api/admin/publish`
- `lib/publish/githubPublisher.ts`

Desktop clients must call the admin API. No other publish path is supported.

## Admin publish payload (AdminPublishPayload)

Payload shape:

```json
{
  "global": {
    "translationKey": "string",
    "author": "string",
    "coverImage": "https://...",
    "affiliateDisclosure": true,
    "date": "YYYY-MM-DD",
    "blogUrl": "optional",
    "linkPolicy": "optional",
    "defaultAffiliateDisclosure": false,
    "source": "creator|translator"
  },
  "localized": {
    "en": {
      "title": "string",
      "description": "string",
      "slug": "string",
      "category": "string",
      "tags": ["string"],
      "keywords": ["string"],
      "content": "mdx"
    },
    "pt": {},
    "es": {},
    "it": {}
  }
}
```

Schema: `schemas/content_package.schema.json`

## Admin API behavior

- Validates required fields per locale and the global fields.
- Normalizes tags/keywords into arrays.
- Rejects conflicting slugs (same locale, different translationKey).
- Writes MDX to `content/posts/{locale}/{slug}.mdx`.
- If `CONTENT_PUBLISH_PROVIDER=github`, creates a commit/PR via GitHub API and triggers Vercel deploy.

## Desktop publish flow

Translator app steps:
1. Build AdminPublishPayload JSON (validated against schema).
2. POST to `${BLOG_ADMIN_API_BASE_URL}/api/admin/publish`.
3. Pass `BLOG_ADMIN_API_TOKEN` via `x-admin-token` if configured.
4. Show commit/PR URL from API response.

## QA checklist

- Domains:
  - `techskillsthatpay.com` serves EN without `/en` prefix.
  - `techskillsthatpay.com.br` serves PT without `/pt` prefix.
  - `techskillsthatpay.es` serves ES without `/es` prefix.
  - `techskillsthatpay.it` serves IT without `/it` prefix.
- Canonicals:
  - Each domain’s canonical points to itself.
- hreflang:
  - All 4 alternates are present with correct domains + x-default.
- Sitemap:
  - URLs are generated for each locale domain.
- Publish:
  - Desktop publish creates commit/PR and triggers deploy.
- Content:
  - MDX files end up in `content/posts/{locale}/` and share `translationKey`.
