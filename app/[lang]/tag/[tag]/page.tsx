import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/Container";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { normalizeLocale, type Locale, locales } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";

type Props = {
  params: { lang: Locale; tag: string };
  searchParams?: { page?: string | string[] };
};

const POSTS_PER_PAGE = 10;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const params: { lang: Locale; tag: string }[] = [];
  for (const lang of locales) {
    const posts = await getAllPosts(lang as Locale);
    const tags = Array.from(new Set(posts.flatMap((p) => p.tagSlugs)));
    tags.forEach((tag) => params.push({ lang: lang as Locale, tag }));
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = normalizeLocale(params.lang);
  const tags = await getAllTags(lang);
  const tag = tags.find((item) => item.slug === params.tag);
  if (!tag) return { title: "Tag not found" };

  const url = `https://techskillsthatpay.com/${lang}/tag/${tag.slug}`;
  const alternates = Object.fromEntries(
    locales.map((loc) => [loc, `https://techskillsthatpay.com/${loc}/tag/${tag.slug}`])
  );

  const title = `Tag: ${tag.label}`;
  return {
    title,
    description: `Posts tagged with ${tag.label} from TechSkillsThatPay.`,
    alternates: { canonical: url, languages: { ...alternates, "x-default": `https://techskillsthatpay.com/en/tag/${tag.slug}` } },
    openGraph: {
      title,
      url,
      description: `Posts tagged with ${tag.label}`
    }
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const lang = normalizeLocale(params.lang);
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

  return (
    <Container className="py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg shadow-slate-200/70 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Tag</p>
        <h1 className="text-3xl font-bold text-text-primary">{tag?.label}</h1>
        <p className="mt-2 text-text-secondary">Posts exploring {tag?.label} topics.</p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} locale={lang} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/${lang}/tag/${params.tag}`} />
    </Container>
  );
}
