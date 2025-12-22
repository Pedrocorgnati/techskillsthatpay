import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import AffiliateCTA from "@/components/AffiliateCTA";
import Container from "@/components/Container";
import CategoryBadge from "@/components/CategoryBadge";
import JsonLd from "@/components/JsonLd";
import TagPill from "@/components/TagPill";
import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { getHtmlLang, getLocaleLabel, normalizeLocale, type Locale } from "@/lib/i18n";
import { getAllPosts, getCompiledPost, getPostBySlug, getTranslationsFor } from "@/lib/posts";
import {
  SITE_NAME,
  SITE_TWITTER,
  buildBreadcrumbList,
  buildPostJsonLd,
  getOgLocaleValue,
  getPostKeywords,
  getPostOgImage,
  getPostSeoDescription,
  getPostSeoTitle,
  getPreviewRobots
} from "@/lib/seo";

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
  const baseUrl = getBaseUrlForLocale(lang);
  const url = `${baseUrl}/posts/${post.slug}`;
  const canonical = post.canonicalOverride?.trim() || url;
  const alternates = Object.fromEntries(
    Object.entries(translations).map(([locale, slug]) => [
      getHtmlLang(locale as Locale),
      `${getBaseUrlForLocale(locale as Locale)}/posts/${slug}`
    ])
  );
  const xDefault = translations.en
    ? `${getBaseUrlForLocale("en")}/posts/${translations.en}`
    : undefined;
  const ogImage = getPostOgImage(post, lang);
  const previewRobots = getPreviewRobots();
  const robots =
    previewRobots ||
    (post.noindex ? { index: false, follow: false, noarchive: true } : undefined);
  const keywords = getPostKeywords(post);

  return {
    title: getPostSeoTitle(post),
    description: getPostSeoDescription(post),
    keywords: keywords.length ? keywords : undefined,
    robots,
    alternates: {
      canonical,
      languages: post.canonicalOverride ? undefined : { ...alternates, ...(xDefault ? { "x-default": xDefault } : {}) }
    },
    openGraph: {
      title: getPostSeoTitle(post),
      description: getPostSeoDescription(post),
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
      locale: getOgLocaleValue(lang),
      siteName: SITE_NAME,
      images: ogImage ? [{ url: ogImage, alt: post.coverImageAlt || post.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: getPostSeoTitle(post),
      description: getPostSeoDescription(post),
      site: SITE_TWITTER,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export default async function PostPage({ params }: Props) {
  const lang = normalizeLocale(params.lang);
  const baseUrl = getBaseUrlForLocale(lang);
  const compiled = await getCompiledPost(lang, params.slug);
  if (!compiled) {
    notFound();
  }

  const { post, content } = compiled;
  const translations = await getTranslationsFor(post.translationKey);
  const translationLinks = (Object.entries(translations) as Array<[Locale, string]>)
    .filter(([locale]) => locale !== lang)
    .map(([locale, slug]) => ({
      locale,
      label: getLocaleLabel(locale),
      url: `${getBaseUrlForLocale(locale)}/posts/${slug}`
    }));
  const breadcrumbs = buildBreadcrumbList([
    { name: SITE_NAME, url: `${baseUrl}/` },
    { name: post.category, url: `${baseUrl}/category/${post.categorySlug}` },
    { name: post.title, url: `${baseUrl}/posts/${post.slug}` }
  ]);

  return (
    <Container className="py-10">
      <article className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-slate-200/70 dark:shadow-none">
          <div className="relative">
            {post.coverImage ? (
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
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
                <CategoryBadge category={post.category} slug={post.categorySlug} />
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
                <TagPill key={tag} tag={tag} slug={post.tagSlugs[idx]} />
              ))}
            </div>
            {translationLinks.length ? (
              <div className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">Available in:</span>{" "}
                {translationLinks.map((item, idx) => (
                  <span key={item.locale}>
                    <a
                      href={item.url}
                      className="font-semibold text-accent hover:text-accent/80"
                    >
                      {item.label}
                    </a>
                    {idx < translationLinks.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            ) : null}

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
                <TagPill key={tag} tag={tag} slug={post.tagSlugs[idx]} />
              ))}
            </div>
          </div>
        </div>
      </article>
      <JsonLd data={buildPostJsonLd(post, lang)} />
      <JsonLd data={breadcrumbs} />
    </Container>
  );
}
