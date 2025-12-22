import type { Metadata } from "next";
import { headers } from "next/headers";

import Container from "@/components/Container";
import NewsletterBox from "@/components/NewsletterBox";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, type Locale, normalizeLocale } from "@/lib/i18n";
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
  const title = getTranslationForLanguage(language, "meta.about.title");
  const description = getTranslationForLanguage(language, "meta.about.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/about`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/about`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/about` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/about`,
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

export default function AboutPage({ params }: Props) {
  normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1], values?: Record<string, string | number>) =>
    formatTranslation(getTranslationForLanguage(language, key), values);
  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
          <h1 className="text-3xl font-bold text-text-primary">{t("about.heading")}</h1>
          <p className="text-lg text-text-secondary">
            {t("about.intro")}
          </p>
          <div className="space-y-3 text-text-secondary">
            <p>{t("about.paragraph1")}</p>
            <p>{t("about.paragraph2")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">{t("about.criteria.title")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-text-secondary">
              <li>{t("about.criteria.item1")}</li>
              <li>{t("about.criteria.item2")}</li>
              <li>{t("about.criteria.item3")}</li>
              <li>{t("about.criteria.item4")}</li>
            </ul>
          </div>
        </div>
        <NewsletterBox />
      </div>
    </Container>
  );
}
