import type { Metadata } from "next";

import Container from "@/components/Container";
import SearchClient from "@/components/SearchClient";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { locales, normalizeLocale, type Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

type Props = { params: { lang: Locale } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `${getBaseUrlForLocale(loc)}/search`])
  );
  return {
    title: "Search",
    description: "Search TechSkillsThatPay posts by title, tags, or description.",
    alternates: {
      canonical: `${baseUrl}/search`,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/search` }
    }
  };
}

export default async function SearchPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  const posts = await getAllPosts(lang);

  const searchable = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    tagSlugs: post.tagSlugs,
    category: post.category,
    categorySlug: post.categorySlug,
    date: post.date,
    readingTimeText: post.readingTimeText
  }));

  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <h1 className="text-3xl font-bold text-text-primary">Search</h1>
        <p className="mt-2 text-text-secondary">
          Filter posts instantly on the client. Type a title, keyword, tag, or topic.
        </p>
        <div className="mt-6">
          <SearchClient posts={searchable} locale={lang} />
        </div>
      </div>
    </Container>
  );
}
