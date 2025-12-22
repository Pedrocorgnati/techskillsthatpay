import type { Metadata } from "next";

import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, normalizeLocale, type Locale } from "@/lib/i18n";
import { getPreviewRobots } from "@/lib/seo";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/contact`])
  );
  return {
    title: "Contact",
    description: "Get in touch with TechSkillsThatPay.",
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/contact`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/contact` }
    }
  };
}

export default function ContactPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  return (
    <Container className="py-10">
      <div className="max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <h1 className="text-3xl font-bold text-text-primary">Contact</h1>
        <p className="text-text-secondary">
          We read every message. Whether you want to suggest a topic, sponsor content, or share a
          success story, reach out.
        </p>
        <ContactForm locale={lang} />
      </div>
    </Container>
  );
}
