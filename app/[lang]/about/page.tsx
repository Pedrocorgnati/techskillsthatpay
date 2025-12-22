import type { Metadata } from "next";

import Container from "@/components/Container";
import NewsletterBox from "@/components/NewsletterBox";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { locales, type Locale, normalizeLocale } from "@/lib/i18n";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `${getBaseUrlForLocale(loc)}/about`])
  );
  return {
    title: "About",
    description: "Why TechSkillsThatPay exists and how we evaluate career skills and courses.",
    alternates: {
      canonical: `${baseUrl}/about`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/about` }
    }
  };
}

export default function AboutPage({ params }: Props) {
  normalizeLocale(params.lang);
  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
          <h1 className="text-3xl font-bold text-text-primary">About TechSkillsThatPay</h1>
          <p className="text-lg text-text-secondary">
            We are obsessed with the career moves and skills that materially improve income and
            optionality. Every post is a playbook: concise, tested, and transparent about what
            actually works.
          </p>
          <div className="space-y-3 text-text-secondary">
            <p>
              We interview hiring managers, reverse-engineer job postings, and test courses as
              paying students. That research becomes roadmaps you can follow without spending years
              on trial-and-error.
            </p>
            <p>
              Expect writing that respects your time: clear steps, curated resources, and
              lightweight templates. We embrace affiliate partnerships to keep the content free, and
              we disclose them every time.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">Our criteria</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-text-secondary">
              <li>Skills that map directly to high-paying roles.</li>
              <li>Resources with proven outcomes or strong student reviews.</li>
              <li>Hands-on practice over passive learning.</li>
              <li>Clarity on time-to-value and total cost.</li>
            </ul>
          </div>
        </div>
        <NewsletterBox />
      </div>
    </Container>
  );
}
