import type { Metadata } from "next";

import AffiliateCTA from "@/components/AffiliateCTA";
import Container from "@/components/Container";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, locales, normalizeLocale, type Locale } from "@/lib/i18n";
import { getPreviewRobots } from "@/lib/seo";

type Props = { params: { lang: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/courses`])
  );
  return {
    title: "Courses",
    description: "Curated affiliate-friendly courses with strong ROI for tech careers.",
    robots: getPreviewRobots(),
    alternates: {
      canonical: `${baseUrl}/courses`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/courses` }
    }
  };
}

const coursePicks = [
  {
    title: "Python for Career Switchers",
    description: "A practical Python track with projects focused on automating business workflows.",
    href: "https://example.com/aff/python"
  },
  {
    title: "Cloud Foundations to Architect",
    description: "Hands-on AWS labs that map directly to real-world roles and certifications.",
    href: "https://example.com/aff/cloud"
  },
  {
    title: "Security Analyst Jumpstart",
    description: "Blue-team labs, SIEM practice, and incident response fundamentals.",
    href: "https://example.com/aff/cyber"
  }
];

export default function CoursesPage({ params }: Props) {
  normalizeLocale(params.lang);
  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <h1 className="text-3xl font-bold text-text-primary">Courses we recommend</h1>
        <p className="mt-2 text-text-secondary">
          Affiliate-friendly picks with a clear ROI narrative. We only feature courses we&apos;d use
          ourselves or recommend to friends.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {coursePicks.map((course) => (
            <AffiliateCTA
              key={course.title}
              title={course.title}
              description={course.description}
              href={course.href}
              buttonLabel="View course"
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
