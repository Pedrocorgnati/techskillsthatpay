import { getBaseUrlForLocale } from "../lib/domainRouting";
import { getHtmlLang, locales, type Locale } from "../lib/i18n";
import { getAllPosts, getTranslationsFor } from "../lib/posts";
import { buildPostJsonLd } from "../lib/seo";
import { buildLocaleSitemap } from "../lib/sitemap";

type CheckResult = {
  errors: string[];
  warnings: string[];
};

const bcp47Regex = /^[a-z]{2}(-[A-Z]{2})?$/;

function assert(condition: boolean, message: string, errors: string[]) {
  if (!condition) errors.push(message);
}

async function checkLocales(result: CheckResult) {
  locales.forEach((locale) => {
    const baseUrl = getBaseUrlForLocale(locale);
    assert(
      !baseUrl.includes(`/${locale}`),
      `Base URL for ${locale} should not include a locale prefix: ${baseUrl}`,
      result.errors
    );
    const htmlLang = getHtmlLang(locale);
    assert(
      bcp47Regex.test(htmlLang),
      `HTML lang for ${locale} must be BCP47 (${htmlLang})`,
      result.errors
    );
  });
}

async function checkTranslations(result: CheckResult) {
  const posts = await getAllPosts();
  const postsByLocale = new Map<string, Set<string>>();
  posts.forEach((post) => {
    if (!postsByLocale.has(post.locale)) {
      postsByLocale.set(post.locale, new Set());
    }
    postsByLocale.get(post.locale)?.add(post.slug);
  });

  for (const post of posts) {
    const translations = await getTranslationsFor(post.translationKey);
    Object.entries(translations).forEach(([locale, slug]) => {
      const localePosts = postsByLocale.get(locale);
      assert(
        Boolean(localePosts?.has(slug)),
        `Translation ${post.translationKey} points to missing slug ${locale}/${slug}`,
        result.errors
      );
    });
  }
}

async function checkSitemap(result: CheckResult) {
  for (const locale of locales) {
    const baseUrl = getBaseUrlForLocale(locale);
    const xml = await buildLocaleSitemap(locale);
    const posts = await getAllPosts(locale);
    posts.forEach((post) => {
      const url = `${baseUrl}/posts/${post.slug}`;
      assert(
        xml.includes(`<loc>${url}</loc>`),
        `Sitemap missing post URL ${url}`,
        result.errors
      );
      if (post.updated) {
        assert(
          xml.includes(post.updated),
          `Sitemap lastmod not using updated date for ${url}`,
          result.warnings
        );
      }
    });
  }
}

async function checkJsonLd(result: CheckResult) {
  const posts = await getAllPosts();
  posts.forEach((post) => {
    const jsonLd = buildPostJsonLd(post, post.locale as Locale);
    const required = ["headline", "description", "datePublished", "dateModified", "author", "publisher", "mainEntityOfPage", "url"];
    required.forEach((key) => {
      assert(
        Boolean((jsonLd as Record<string, unknown>)[key]),
        `JSON-LD missing ${key} for ${post.locale}/${post.slug}`,
        result.errors
      );
    });
  });
}

async function run() {
  const result: CheckResult = { errors: [], warnings: [] };

  await checkLocales(result);
  await checkTranslations(result);
  await checkSitemap(result);
  await checkJsonLd(result);

  result.warnings.forEach((warning) => console.warn(`SEO warning: ${warning}`));
  result.errors.forEach((error) => console.error(`SEO error: ${error}`));

  if (result.errors.length) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error("SEO check failed:", err);
  process.exit(1);
});
