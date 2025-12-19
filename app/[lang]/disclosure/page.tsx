import type { Metadata } from "next";

import Container from "@/components/Container";
import { locales, normalizeLocale, type Locale } from "@/lib/i18n";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `https://techskillsthatpay.com/${loc}/disclosure`])
  );
  return {
    title: "Affiliate Disclosure",
    description: "How TechSkillsThatPay uses affiliate links and how we choose partners.",
    alternates: {
      canonical: `https://techskillsthatpay.com/${lang}/disclosure`,
      languages: { ...alternates, "x-default": "https://techskillsthatpay.com/en/disclosure" }
    }
  };
}

export default function DisclosurePage({ params }: Props) {
  normalizeLocale(params.lang);
  return (
    <Container className="py-10">
      <div className="prose prose-slate max-w-none rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:prose-invert dark:shadow-none">
        <h1>Affiliate Disclosure</h1>
        <p>Transparency matters. Here is how affiliate links work on TechSkillsThatPay.</p>
        <h2>What are affiliate links?</h2>
        <p>
          Some links on this site are affiliate links. If you click them and buy something, we may
          earn a commission. There is no extra cost to you.
        </p>
        <h2>How we choose partners</h2>
        <ul>
          <li>We test or audit the course or tool ourselves when possible.</li>
          <li>We prioritize outcomes: job offers, portfolio projects, or salary impact.</li>
          <li>We reject partners that over-promise, lack support, or use shady tactics.</li>
        </ul>
        <h2>How we disclose</h2>
        <ul>
          <li>Each article with affiliate links includes a reminder at the top.</li>
          <li>Affiliate CTAs are clearly labeled.</li>
          <li>This dedicated disclosure page is linked in the footer.</li>
        </ul>
        <h2>Why we use affiliates</h2>
        <p>
          Affiliate revenue keeps the content free and lets us spend time testing resources. It also
          reduces reliance on intrusive ads.
        </p>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:hello@techskillsthatpay.com">hello@techskillsthatpay.com</a>.
        </p>
      </div>
    </Container>
  );
}
