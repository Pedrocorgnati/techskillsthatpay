import type { Metadata } from "next";
import { headers } from "next/headers";

import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, normalizeLocale, type Locale } from "@/lib/i18n";
import { getPreviewRobots } from "@/lib/seo";
import {
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
  const title = getTranslationForLanguage(language, "meta.contact.title");
  const description = getTranslationForLanguage(language, "meta.contact.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/contact`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/contact`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/contact` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/contact`,
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

export default function ContactPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1]) =>
    getTranslationForLanguage(language, key);
  return (
    <Container className="py-10">
      <div className="max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <h1 className="text-3xl font-bold text-text-primary">{t("contact.heading")}</h1>
        <p className="text-text-secondary">
          {t("contact.intro")}
        </p>
        <ContactForm locale={lang} />
      </div>
    </Container>
  );
}
