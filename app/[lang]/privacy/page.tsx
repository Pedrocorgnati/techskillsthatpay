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
  const title = getTranslationForLanguage(language, "meta.privacy.title");
  const description = getTranslationForLanguage(language, "meta.privacy.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/privacy`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/privacy`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/privacy` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/privacy`,
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

export default function PrivacyPage({ params }: Props) {
  normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1], values?: Record<string, string | number>) =>
    formatTranslation(getTranslationForLanguage(language, key), values);
  const formattedDate = new Intl.DateTimeFormat(getLanguageTag(language)).format(new Date());
  return (
    <Container className="py-10">
      <div className="prose prose-slate max-w-none rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:prose-invert dark:shadow-none">
        <h1>{t("privacy.heading")}</h1>
        <p>
          {t("privacy.updatedLabel")} {formattedDate}
        </p>
        <p>{t("privacy.intro")}</p>
        <h2>{t("privacy.section1.title")}</h2>
        <ul>
          <li>{t("privacy.section1.item1")}</li>
          <li>{t("privacy.section1.item2")}</li>
          <li>{t("privacy.section1.item3")}</li>
        </ul>
        <h2>{t("privacy.section2.title")}</h2>
        <ul>
          <li>{t("privacy.section2.item1")}</li>
          <li>{t("privacy.section2.item2")}</li>
          <li>{t("privacy.section2.item3")}</li>
        </ul>
        <h2>{t("privacy.section3.title")}</h2>
        <p>
          {t("privacy.section3.body", { email: "privacy@techskillsthatpay.com" })}
        </p>
        <h2>{t("privacy.section4.title")}</h2>
        <p>{t("privacy.section4.body")}</p>
      </div>
    </Container>
  );
}
