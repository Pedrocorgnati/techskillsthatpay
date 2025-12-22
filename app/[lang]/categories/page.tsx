import type { Metadata } from "next";
import { headers } from "next/headers";

import Container from "@/components/Container";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, normalizeLocale, type Locale } from "@/lib/i18n";
import { getAllCategories, getAllPosts } from "@/lib/posts";
import { getPreviewRobots } from "@/lib/seo";
import {
  formatTranslation,
  getLanguageTag,
  getPreferredLanguage,
  getTranslationForLanguage,
  resolveLanguage
} from "@/libs/language-translations";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const title = getTranslationForLanguage(language, "meta.categories.title");
  const description = getTranslationForLanguage(language, "meta.categories.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/categories`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/categories`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/categories` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/categories`,
      locale: getLanguageTag(language),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function CategoriesPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1], values?: Record<string, string | number>) =>
    formatTranslation(getTranslationForLanguage(language, key), values);
  const categories = await getAllCategories(lang);
  const posts = await getAllPosts(lang);

  const counts = categories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.categorySlug === category.slug).length
  }));

  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          {t("categories.badge")}
        </p>
        <h1 className="text-3xl font-bold text-text-primary">{t("categories.heading")}</h1>
        <p className="mt-2 text-text-secondary">
          {t("categories.intro")}
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {counts.map((category) => (
          <a
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div>
              <p className="text-lg font-semibold text-text-primary">{category.label}</p>
              <p className="text-sm text-text-secondary">
                {t("categories.postCount", { count: category.count })}
              </p>
            </div>
            <span className="text-text-secondary" aria-hidden>
              →
            </span>
          </a>
        ))}
      </div>
    </Container>
  );
}
