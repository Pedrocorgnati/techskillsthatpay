import type { Metadata } from "next";
import { headers } from "next/headers";

import AffiliateCTA from "@/components/AffiliateCTA";
import Container from "@/components/Container";
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
  const title = getTranslationForLanguage(language, "meta.courses.title");
  const description = getTranslationForLanguage(language, "meta.courses.description");
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/courses`])
  );
  return {
    title,
    description,
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/courses`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/courses` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/courses`,
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

export default function CoursesPage({ params }: Props) {
  normalizeLocale(params.lang);
  const language = resolveLanguage({
    preferredLanguage: getPreferredLanguage(),
    acceptLanguage: headers().get("accept-language")
  });
  const t = (key: Parameters<typeof getTranslationForLanguage>[1]) =>
    getTranslationForLanguage(language, key);
  const coursePicks = [
    {
      title: t("courses.item1.title"),
      description: t("courses.item1.description"),
      href: "https://example.com/aff/python"
    },
    {
      title: t("courses.item2.title"),
      description: t("courses.item2.description"),
      href: "https://example.com/aff/cloud"
    },
    {
      title: t("courses.item3.title"),
      description: t("courses.item3.description"),
      href: "https://example.com/aff/cyber"
    }
  ];
  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <h1 className="text-3xl font-bold text-text-primary">{t("courses.heading")}</h1>
        <p className="mt-2 text-text-secondary">
          {t("courses.intro")}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {coursePicks.map((course) => (
            <AffiliateCTA
              key={course.title}
              title={course.title}
              description={course.description}
              href={course.href}
              buttonLabel={t("courses.ctaLabel")}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
