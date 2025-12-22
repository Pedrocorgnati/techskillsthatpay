import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/Container";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, normalizeLocale, type Locale, locales } from "@/lib/i18n";
import { getAllCategories, getAllPosts } from "@/lib/posts";
import { SITE_NAME, buildBreadcrumbList, getDefaultOgImage, getOgLocaleValue, getPreviewRobots, shouldIndexCollection } from "@/lib/seo";

type Props = {
  params: { lang: Locale; category: string };
  searchParams?: { page?: string | string[] };
};

const POSTS_PER_PAGE = 10;
export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { lang: Locale; category: string }[] = [];
  for (const lang of locales) {
    const posts = await getAllPosts(lang as Locale);
    const cats = Array.from(new Set(posts.map((p) => p.categorySlug)));
    cats.forEach((cat) => params.push({ lang: lang as Locale, category: cat }));
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = normalizeLocale(params.lang);
  const categories = await getAllCategories(lang);
  const category = categories.find((cat) => cat.slug === params.category);
  if (!category) return { title: "Category not found" };

  const baseUrl = getBaseUrlForLocale(lang);
  const url = `${baseUrl}/category/${category.slug}`;
  const alternateEntries = (
    await Promise.all(
      locales.map(async (loc) => {
        const list = await getAllCategories(loc);
        const match = list.find((item) => item.slug === category.slug);
        if (!match) return null;
        return [getHtmlLang(loc), `${getBaseUrlForLocale(loc)}/category/${match.slug}`] as const;
      })
    )
  ).filter(Boolean) as Array<[string, string]>;
  const alternates = Object.fromEntries(alternateEntries);
  const xDefault = alternateEntries.find(([key]) => key === getHtmlLang("en"))?.[1];
  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const posts = (await getAllPosts(lang)).filter((post) => post.categorySlug === params.category);
  const shouldIndex = shouldIndexCollection(posts.length);
  const previewRobots = getPreviewRobots();
  const robots =
    previewRobots ||
    (!shouldIndex || page > 1 ? { index: false, follow: true, noarchive: true } : undefined);

  const title = page > 1 ? `Category: ${category.label} (Page ${page})` : `Category: ${category.label}`;
  return {
    title,
    description: `Posts in ${category.label} from TechSkillsThatPay.`,
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
      description: `Posts in ${category.label}`,
      locale: getOgLocaleValue(lang),
      images: [{ url: getDefaultOgImage(lang), alt: SITE_NAME }]
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const categories = await getAllCategories(lang);
  const category = categories.find((cat) => cat.slug === params.category);
  if (!category) {
    notFound();
  }

  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const posts = (await getAllPosts(lang)).filter((post) => post.categorySlug === params.category);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visible = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const breadcrumbs = buildBreadcrumbList([
    { name: SITE_NAME, url: `${baseUrl}/` },
    { name: "Categories", url: `${baseUrl}/categories` },
    { name: category.label, url: `${baseUrl}/category/${category.slug}` }
  ]);

  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Category
        </p>
        <h1 className="text-3xl font-bold text-text-primary">{category?.label}</h1>
        <p className="mt-2 text-text-secondary">Curated posts focused on {category?.label}.</p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${params.category}`} />
      <JsonLd data={breadcrumbs} />
    </Container>
  );
}
