import { getBaseUrlForLocale } from "./domainRouting.ts";
import { getHtmlLang, type Locale } from "./i18n.ts";
import { getAllPosts } from "./posts.ts";
import { getSiteDescription, getSiteTitle, SITE_NAME } from "./seo.ts";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toUTCString();
}

export async function buildRssFeed(locale: Locale) {
  const baseUrl = getBaseUrlForLocale(locale);
  const posts = await getAllPosts(locale);
  const lastBuildDate = posts[0]?.updated ? formatDate(posts[0].updated) : formatDate(new Date());

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = `${baseUrl}/posts/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${formatDate(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(getSiteTitle(locale))}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(getSiteDescription(locale))}</description>
    <language>${escapeXml(getHtmlLang(locale))}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return body;
}
