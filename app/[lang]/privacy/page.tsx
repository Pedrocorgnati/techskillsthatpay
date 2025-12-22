import type { Metadata } from "next";

import Container from "@/components/Container";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { locales, normalizeLocale, type Locale } from "@/lib/i18n";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `${getBaseUrlForLocale(loc)}/privacy`])
  );
  return {
    title: "Privacy Policy",
    description: "Privacy practices for TechSkillsThatPay.",
    alternates: {
      canonical: `${baseUrl}/privacy`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/privacy` }
    }
  };
}

export default function PrivacyPage({ params }: Props) {
  normalizeLocale(params.lang);
  return (
    <Container className="py-10">
      <div className="prose prose-slate max-w-none rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:prose-invert dark:shadow-none">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          We collect minimal data to operate this site responsibly. Analytics are aggregated and
          anonymized whenever possible. We do not sell your personal information.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>Basic analytics (page views, device type, approximate region).</li>
          <li>Contact form submissions so we can reply.</li>
          <li>Newsletter signups (email address only).</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>Improve content quality and site performance.</li>
          <li>Respond to your requests and send requested newsletters.</li>
          <li>Monitor for abuse or fraud.</li>
        </ul>
        <h2>Your choices</h2>
        <p>
          You can request data deletion or export by emailing{" "}
          <a href="mailto:privacy@techskillsthatpay.com">privacy@techskillsthatpay.com</a>. You can
          unsubscribe from emails at any time via the link in each message.
        </p>
        <h2>Third-parties</h2>
        <p>
          We may use privacy-friendly analytics and email service providers. Affiliate partners do
          not receive your personal data unless you click through to their sites.
        </p>
      </div>
    </Container>
  );
}
