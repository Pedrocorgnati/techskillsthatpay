import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { locales, type Locale, normalizeLocale } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: { lang: Locale };
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  return {
    title: {
      default: "TechSkillsThatPay | Evidence-based career skills",
      template: "%s | TechSkillsThatPay"
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      languages: Object.fromEntries(
        locales
          .map((l) => [l, `${getBaseUrlForLocale(l)}`])
          .concat([["x-default", `${getBaseUrlForLocale("en")}`]])
      ),
      canonical: `${baseUrl}/`
    }
  };
}

export default function LangLayout({ children }: Props) {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
