import type { Metadata } from "next";
import { headers } from "next/headers";

import Container from "@/components/Container";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, normalizeLocale, type Locale } from "@/lib/i18n";
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
  const title = getTranslationForLanguage(language, "meta.disclosure.title");
  const description = getTranslationForLanguage(language, "meta.disclosure.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/disclosure`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/disclosure`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/disclosure` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/disclosure`,
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

export default function DisclosurePage({ params }: Props) {
  normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1], values?: Record<string, string | number>) =>
    formatTranslation(getTranslationForLanguage(language, key), values);
  return (
    <Container className="py-10">
      <div className="prose prose-slate max-w-none rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:prose-invert dark:shadow-none">
        <h1>{t("disclosure.heading")}</h1>
        <p>{t("disclosure.intro")}</p>
        <h2>{t("disclosure.section1.title")}</h2>
        <p>{t("disclosure.section1.body")}</p>
        <h2>{t("disclosure.section2.title")}</h2>
        <ul>
          <li>{t("disclosure.section2.item1")}</li>
          <li>{t("disclosure.section2.item2")}</li>
          <li>{t("disclosure.section2.item3")}</li>
        </ul>
        <h2>{t("disclosure.section3.title")}</h2>
        <ul>
          <li>{t("disclosure.section3.item1")}</li>
          <li>{t("disclosure.section3.item2")}</li>
          <li>{t("disclosure.section3.item3")}</li>
        </ul>
        <h2>{t("disclosure.section4.title")}</h2>
        <p>{t("disclosure.section4.body")}</p>
        <h2>{t("disclosure.section5.title")}</h2>
        <p>
          {t("disclosure.section5.body", { email: "hello@techskillsthatpay.com" })}
        </p>
      </div>
    </Container>
  );
}
