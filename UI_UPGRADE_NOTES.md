# UI Upgrade Notes

## Inspiration from `Modern-Design-Blog-Builder-Solution`
- Light base on warm off-white `#fbfbf8`, dark overlay gradients on hero headers.
- Plus Jakarta Sans for rounded, modern typography with bold headings and roomy line-height.
- Large radii (16px+), soft borders, subtle shadows, and pill-shaped badges.
- Hero headers with gradient overlays, uppercase micro-labels, and visible timestamps.
- Minimal grids with generous padding and breathing room between sections.
- Muted gray body copy, accent blue links, and elegant blockquotes.

## Changes applied to main blog
- Swapped to Plus Jakarta Sans across the site and refreshed Tailwind tokens (surface/text colors, dark mode support).
- Reworked layout widths (max-w-6xl), hero section, and post cards with gradient overlays, richer metadata chips, and smoother hover states.
- Upgraded pagination, tag/category pills, affiliate CTA, newsletter box, search results, and list/category/tag headers for consistent styling and dark mode.
- Post page now uses a hero banner with overlays, refined affiliate disclosure, improved prose/blockquote styling, and new `<Callout>` MDX component.
- Added theme toggler (next-themes) with proper hydration guard and dark-mode theming across components.
- Footer/Header alignment improved; mobile nav pills added; search link surfaced in header.

## How to adjust in the future
- Tailwind color tokens live in `tailwind.config.ts` (`surface`, `text`, `brand`). Update there for global palette shifts.
- Global background/typography tweaks live in `app/globals.css`. Dark mode overrides are under `.dark`.
- Header/hero/button treatments are in `components/Header.tsx`, `app/page.tsx`, `components/PostCard.tsx`, and `components/NewsletterBox.tsx`.
- MDX component styling: `lib/mdx-components.tsx` plus `components/Callout.tsx`; prose overrides are in `app/globals.css`.
- Theme behavior is powered by `next-themes` via `components/ThemeProvider.tsx` + `ThemeToggle.tsx` (attribute `class`). Update these if changing theming strategy.
