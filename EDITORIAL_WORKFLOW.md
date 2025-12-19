# Editorial Workflow

## Creating posts (multilingual)
1. Go to `/admin/publish`.
2. Fill “Campos gerais”:
   - `translationKey` (shared across languages)
   - `author`
   - `affiliateDisclosure` (checkbox)
   - `date` (required) and `updated` (optional; defaults to date)
3. Fill localized columns (EN required; PT/ES/IT optional):
   - `title`, `description`, `slug`, `category`, `tags` (comma), `content` (MDX body).
4. Click **Publicar**. The system writes MDX files to `content/posts/{lang}/{slug}.mdx` for each filled language.
5. Files include frontmatter with `translationKey`, `author`, `affiliateDisclosure`, `date/updated`, `tags`, `category`, `slug`.
6. Posts become available immediately; caches are reset in-memory.

## Translation keys
- Use the same `translationKey` across language variants of one article.
- Hreflang alternates for posts are built by grouping posts via `translationKey`.

## Adding a new language (future)
- Add the locale code to `locales` in `lib/i18n.ts` and adjust `defaultLocale` if needed.
- Create `content/posts/{newLocale}` directory.
- Update UI labels/text as desired in the admin and site copy.
- Regenerate sitemap and deploy.

## SEO practices
- Always set `slug`, `title`, and `description` per language.
- Keep `date/updated` accurate; JSON-LD includes `inLanguage`.
- Ensure tags/categories remain meaningful per locale; slugs remain lowercase/dash-separated.
