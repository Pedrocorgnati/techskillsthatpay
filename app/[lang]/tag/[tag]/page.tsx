import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, normalizeLocale, type Locale, locales } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { SITE_NAME, buildBreadcrumbList, getDefaultOgImage, getOgLocaleValue, getPreviewRobots, shouldIndexCollection } from "@/lib/seo";

type Props = {
  params: { lang: Locale; tag: string };
  searchParams?: { page?: string | string[] };
};

const POSTS_PER_PAGE = 10;
export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { lang: Locale; tag: string }[] = [];
  for (const lang of locales) {
    const posts = await getAllPosts(lang as Locale);
    const tags = Array.from(new Set(posts.flatMap((p) => p.tagSlugs)));
    tags.forEach((tag) => params.push({ lang: lang as Locale, tag }));
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = normalizeLocale(params.lang);
  const tags = await getAllTags(lang);
  const tag = tags.find((item) => item.slug === params.tag);
  if (!tag) return { title: "Tag not found" };

  const baseUrl = getBaseUrlForLocale(lang);
  const url = `${baseUrl}/tag/${tag.slug}`;
  const alternateEntries = (
    await Promise.all(
      locales.map(async (loc) => {
        const list = await getAllTags(loc);
        const match = list.find((item) => item.slug === tag.slug);
        if (!match) return null;
        return [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/tag/${match.slug}`] as const;
      })
    )
  ).filter(Boolean) as Array<[string, string]>;
  const alternates = Object.fromEntries(alternateEntries);
  const xDefault = alternateEntries.find(([key]) => key === getHtmlLang("en"))?.[1];
  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const posts = (await getAllPosts(lang)).filter((post) =>
    post.tagSlugs.includes(params.tag)
  );
  const shouldIndex = shouldIndexCollection(posts.length);
  const previewRobots = getPreviewRobots();
  const robots =
    previewRobots ||
    (!shouldIndex || page > 1 ? { index: false, follow: true, noarchive: true } : undefined);

  const title = page > 1 ? `Tag: ${tag.label} (Page ${page})` : `Tag: ${tag.label}`;
  return {
    title,
    description: `Posts tagged with ${tag.label} from TechSkillsThatPay.`,
    robots,
    alternates: {
      canonical: url,
      languages: alternateEntries.length
        ? { ...alternates, ...(xDefault ? { "x-default": xDefault } : {}) }
        : undefined
    },
    openGraph: {
      title,
      url,
      description: `Posts tagged with ${tag.label}`,
      locale: getOgLocaleValue(lang),
      images: [{ url: getDefaultOgImage(lang), alt: SITE_NAME }]
    }
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const tags = await getAllTags(lang);
  const tag = tags.find((item) => item.slug === params.tag);

  if (!tag) {
    notFound();
  }

  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const posts = (await getAllPosts(lang)).filter((post) => post.tagSlugs.includes(params.tag));
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visible = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const breadcrumbs = buildBreadcrumbList([
    { name: SITE_NAME, url: `${baseUrl}/` },
    { name: tag.label, url: `${baseUrl}/tag/${tag.slug}` }
  ]);

  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Tag</p>
        <h1 className="text-3xl font-bold text-text-primary">{tag?.label}</h1>
        <p className="mt-2 text-text-secondary">Posts exploring {tag?.label} topics.</p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/tag/${params.tag}`} />
      <JsonLd data={breadcrumbs} />
    </Container>
  );
}
