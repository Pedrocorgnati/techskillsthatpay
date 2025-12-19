import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import AffiliateCTA from "@/components/AffiliateCTA";
import Container from "@/components/Container";
import CategoryBadge from "@/components/CategoryBadge";
import TagPill from "@/components/TagPill";
import { normalizeLocale, type Locale, locales } from "@/lib/i18n";
import { getAllPosts, getCompiledPost, getPostBySlug, getTranslationsFor } from "@/lib/posts";

type Props = {
  params: { lang: Locale; slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ lang: post.locale, slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = normalizeLocale(params.lang);
  const post = await getPostBySlug(lang, params.slug);
  if (!post) return { title: "Post not found" };

  const translations = await getTranslationsFor(post.translationKey);
  const url = `https://techskillsthatpay.com/${lang}/posts/${post.slug}`;
  const alternates = Object.fromEntries(
    locales.map((loc) => {
      const slug = translations[loc as Locale] ?? post.slug;
      return [loc, `https://techskillsthatpay.com/${loc}/posts/${slug}`];
    })
  );

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url, languages: { ...alternates, "x-default": `https://techskillsthatpay.com/en/posts/${post.slug}` } },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
      locale: lang,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

export default async function PostPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  const compiled = await getCompiledPost(lang, params.slug);
  if (!compiled) {
    notFound();
  }

  const { post, content } = compiled;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    image: post.coverImage,
    url: `https://techskillsthatpay.com/${lang}/posts/${post.slug}`,
    inLanguage: lang,
    author: {
      "@type": "Person",
      name: post.author
    }
  };

  return (
    <Container className="py-10">
      <article className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-slate-200/70 dark:shadow-none">
          <div className="relative">
            {post.coverImage ? (
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
              </div>
            ) : (
              <div className="h-80 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700" />
            )}
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge category={post.category} slug={post.categorySlug} locale={lang} />
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {post.readingTimeText}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  Updated {new Date(post.updated).toLocaleDateString()}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/80">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <TagPill key={tag} tag={tag} slug={post.tagSlugs[idx]} locale={lang} />
              ))}
            </div>

            {post.affiliateDisclosure ? (
              <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text-primary shadow-sm">
                <span aria-hidden className="mt-1 text-lg">⚡</span>
                <p>
                  This article contains affiliate links that may earn us a commission at no extra
                  cost to you. We only recommend what aligns with our standards.
                </p>
              </div>
            ) : null}

            <div className="prose prose-slate max-w-none text-text-primary dark:prose-invert">{content}</div>

            <div className="mt-10">
              <AffiliateCTA />
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <TagPill key={tag} tag={tag} slug={post.tagSlugs[idx]} locale={lang} />
              ))}
            </div>
          </div>
        </div>
      </article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Container>
  );
}
