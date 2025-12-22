import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, type Locale } from "@/lib/i18n";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/posts";
import { shouldIndexCollection } from "@/lib/seo";

const STATIC_ROUTES = ["", "courses", "about", "privacy", "disclosure", "contact", "categories"];
const DEFAULT_LASTMOD = "2024-01-01";

type TranslationIndex = Record<string, Partial<Record<Locale, string>>>;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value?: string | Date) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function buildTranslationIndex(posts: Awaited<ReturnType<typeof getAllPosts>>): TranslationIndex {
  const map: TranslationIndex = {};
  posts.forEach((post) => {
    if (!map[post.translationKey]) {
      map[post.translationKey] = {};
    }
    map[post.translationKey][post.locale as Locale] = post.slug;
  });
  return map;
}

function buildAlternateLinks(translations: Partial<Record<Locale, string>>) {
  const links = Object.entries(translations).map(([loc, slug]) => ({
    hreflang: getHtmlLang(loc as Locale),
    href: `${getBaseUrlForLocale(loc as Locale)}/posts/${slug}`
  }));
  const xDefault = translations.en
    ? { hreflang: "x-default", href: `${getBaseUrlForLocale("en")}/posts/${translations.en}` }
    : null;
  return xDefault ? [...links, xDefault] : links;
}

function buildUrlEntry(opts: {
  loc: string;
  lastmod?: string;
  images?: string[];
  alternates?: Array<{ hreflang: string; href: string }>;
}) {
  const lastmod = formatDate(opts.lastmod);
  const images = opts.images ?? [];
  const alternates = opts.alternates ?? [];

  return `
  <url>
    <loc>${escapeXml(opts.loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${alternates
      .map(
        (alt) =>
          `<xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(
            alt.href
          )}"/>`
      )
      .join("")}
    ${images
      .map(
        (img) =>
          `<image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`
      )
      .join("")}
  </url>`;
}

export async function buildLocaleSitemap(locale: Locale) {
  const baseUrl = getBaseUrlForLocale(locale);
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => post.locale === locale);
  const translationIndex = buildTranslationIndex(allPosts);

  const latestUpdated = posts.map((post) => post.updated).sort().reverse()[0] ?? DEFAULT_LASTMOD;

  const entries: string[] = [];

  STATIC_ROUTES.forEach((route) => {
    entries.push(
      buildUrlEntry({
        loc: `${baseUrl}${route ? `/${route}` : ""}`,
        lastmod: latestUpdated
      })
    );
  });

  posts.forEach((post) => {
    const translations = translationIndex[post.translationKey] ?? {};
    entries.push(
      buildUrlEntry({
        loc: `${baseUrl}/posts/${post.slug}`,
        lastmod: post.updated,
        images: post.coverImage ? [post.coverImage] : undefined,
        alternates: buildAlternateLinks(translations)
      })
    );
  });

  const categories = await getAllCategories(locale);
  const categoryCounts = categories.map((category) => {
    const items = posts.filter((post) => post.categorySlug === category.slug);
    const lastmod = items.map((post) => post.updated).sort().reverse()[0];
    return { category, count: items.length, lastmod };
  });
  categoryCounts
    .filter((entry) => shouldIndexCollection(entry.count))
    .forEach((entry) => {
      entries.push(
        buildUrlEntry({
          loc: `${baseUrl}/category/${entry.category.slug}`,
          lastmod: entry.lastmod || latestUpdated
        })
      );
    });

  const tags = await getAllTags(locale);
  const tagCounts = tags.map((tag) => {
    const items = posts.filter((post) => post.tagSlugs.includes(tag.slug));
    const lastmod = items.map((post) => post.updated).sort().reverse()[0];
    return { tag, count: items.length, lastmod };
  });
  tagCounts
    .filter((entry) => shouldIndexCollection(entry.count))
    .forEach((entry) => {
      entries.push(
        buildUrlEntry({
          loc: `${baseUrl}/tag/${entry.tag.slug}`,
          lastmod: entry.lastmod || latestUpdated
        })
      );
    });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${entries.join("\n")}
</urlset>`;

  return body;
}

export async function buildSitemapIndex() {
  const allPosts = await getAllPosts();
  const latestByLocale = locales.reduce<Record<Locale, string | undefined>>((acc, loc) => {
    const posts = allPosts.filter((post) => post.locale === loc);
    acc[loc] = posts.map((post) => post.updated).sort().reverse()[0];
    return acc;
  }, {} as Record<Locale, string | undefined>);

  const entries = locales
    .map((loc) => {
      const baseUrl = getBaseUrlForLocale(loc);
      const lastmod = formatDate(latestByLocale[loc]);
      return `
  <sitemap>
    <loc>${escapeXml(`${baseUrl}/sitemap.xml`)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  </sitemap>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return body;
}
