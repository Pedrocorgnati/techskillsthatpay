import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import ThemeProvider from "@/components/ThemeProvider";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, type Locale, locales, normalizeLocale } from "@/lib/i18n";
import {
  SITE_NAME,
  SITE_TWITTER,
  buildSiteJsonLd,
  getDefaultOgImage,
  getOgLocaleValue,
  getPreviewRobots,
  getSiteDescription,
  getSiteTitle
} from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: { lang: Locale };
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const title = getSiteTitle(lang);
  const description = getSiteDescription(lang);
  const ogImage = getDefaultOgImage(lang);
  const robots = getPreviewRobots();

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`
    },
    metadataBase: new URL(baseUrl),
    description,
    robots,
    alternates: {
      languages: Object.fromEntries(
        locales
          .map((l) => [getHtmlLang(l), `${getBaseUrlForLocale(l)}`])
          .concat([["x-default", `${getBaseUrlForLocale("en")}`]])
      ),
      canonical: `${baseUrl}/`,
      types: {
        "application/rss+xml": [{ url: `${baseUrl}/rss.xml`, title: `${SITE_NAME} RSS` }]
      }
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/`,
      siteName: SITE_NAME,
      locale: getOgLocaleValue(lang),
      images: ogImage ? [{ url: ogImage, alt: SITE_NAME }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      creator: SITE_TWITTER,
      site: SITE_TWITTER,
      title,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export default function LangLayout({ children, params }: Props) {
  const lang = normalizeLocale(params.lang);
  return (
    <ThemeProvider>
      <JsonLd data={buildSiteJsonLd(lang)} />
      <Header locale={lang} />
      <main className="flex-1">{children}</main>
      <Footer locale={lang} />
    </ThemeProvider>
  );
}
