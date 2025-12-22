import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/Container";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { normalizeLocale, type Locale, locales } from "@/lib/i18n";
import { getAllCategories, getAllPosts } from "@/lib/posts";

type Props = {
  params: { lang: Locale; category: string };
  searchParams?: { page?: string | string[] };
};

const POSTS_PER_PAGE = 10;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const params: { lang: Locale; category: string }[] = [];
  for (const lang of locales) {
    const posts = await getAllPosts(lang as Locale);
    const cats = Array.from(new Set(posts.map((p) => p.categorySlug)));
    cats.forEach((cat) => params.push({ lang: lang as Locale, category: cat }));
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = normalizeLocale(params.lang);
  const categories = await getAllCategories(lang);
  const category = categories.find((cat) => cat.slug === params.category);
  if (!category) return { title: "Category not found" };

  const baseUrl = getBaseUrlForLocale(lang);
  const url = `${baseUrl}/category/${category.slug}`;
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `${getBaseUrlForLocale(loc)}/category/${category.slug}`])
  );

  const title = `Category: ${category.label}`;
  return {
    title,
    description: `Posts in ${category.label} from TechSkillsThatPay.`,
    alternates: {
      canonical: url,
      languages: { ...alternates, "x-default": `${getBaseUrlForLocale("en")}/category/${category.slug}` }
    },
    openGraph: {
      title,
      url,
      description: `Posts in ${category.label}`
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const lang = normalizeLocale(params.lang);
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
          <PostCard key={post.slug} post={post} locale={lang} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/${lang}/category/${params.category}`} />
    </Container>
  );
}
