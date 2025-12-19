import { NextResponse } from "next/server";

import { adminEnabled } from "@/lib/config";
import { createRequestLogger } from "@/lib/logger";
import { isLocale, normalizeLocale, type Locale } from "@/lib/i18n";
import { getAllCategories, getAllPosts } from "@/lib/posts";

// NOTE: In production this endpoint should be protected (auth/rate limits) because it exposes CMS data.

type ContentType = "posts" | "categories";

export async function GET(request: Request) {
  if (!adminEnabled) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const logger = createRequestLogger();
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang") || "";
  const typeParam = (searchParams.get("type") || "") as ContentType;

  if (!isLocale(langParam)) {
    return NextResponse.json({ message: "Invalid lang" }, { status: 400 });
  }

  if (!["posts", "categories"].includes(typeParam)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const lang = normalizeLocale(langParam as Locale);

  if (typeParam === "posts") {
    const posts = await getAllPosts(lang);
    const items = posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      url: `/${lang}/posts/${post.slug}`,
      translationKey: post.translationKey,
      category: post.category,
      tags: post.tags
    }));
    logger.info("Admin content index posts", { locale: lang, count: items.length });
    return NextResponse.json({ items });
  }

  const posts = await getAllPosts(lang);
  const categories = await getAllCategories(lang);
  const counts = categories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.categorySlug === category.slug).length
  }));
  const items = counts.map((category) => ({
    name: category.label,
    slug: category.slug,
    url: `/${lang}/category/${category.slug}`,
    count: category.count
  }));
  logger.info("Admin content index categories", { locale: lang, count: items.length });
  return NextResponse.json({ items });
}
