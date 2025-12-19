import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
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
  return {
    title: {
      default: "TechSkillsThatPay | Evidence-based career skills",
      template: "%s | TechSkillsThatPay"
    },
    metadataBase: new URL("https://techskillsthatpay.com"),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `https://techskillsthatpay.com/${l}`]).concat([["x-default", "https://techskillsthatpay.com/en"]])
      ),
      canonical: `https://techskillsthatpay.com/${lang}`
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
