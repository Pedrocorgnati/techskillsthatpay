import "server-only";

import fs from "fs/promises";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import slugify from "slugify";

import { mdxComponents } from "@/lib/mdx-components";
import { logError } from "@/lib/logger";
import { locales, type Locale } from "@/lib/i18n";
import type { Post, PostFrontmatter } from "@/lib/types";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

let cachedPosts: Post[] | null = null;

const slugOptions = { lower: true, strict: true, trim: true };

function normalizeSlug(value: string): string {
  return slugify(value, slugOptions);
}

function assertFrontmatter(data: Record<string, unknown>, fallbackSlug: string): PostFrontmatter {
  const required = [
    "title",
    "description",
    "date",
    "updated",
    "tags",
    "category",
    "slug",
    "affiliateDisclosure",
    "author",
    "translationKey"
  ];
  for (const key of required) {
    if (!(key in data)) {
      throw new Error(`Missing "${key}" in frontmatter for ${fallbackSlug}`);
    }
  }

  const fm: PostFrontmatter = {
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    updated: String(data.updated ?? data.date),
    tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t)) : [],
    category: String(data.category),
    slug: String(data.slug || fallbackSlug),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    affiliateDisclosure: Boolean(data.affiliateDisclosure),
    readingTime: data.readingTime ? String(data.readingTime) : undefined,
    author: String(data.author),
    translationKey: String(data.translationKey)
  };

  if (!fm.tags.length) {
    throw new Error(`"tags" must be a non-empty array in ${fallbackSlug}`);
  }

  return fm;
}

async function loadPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for (const locale of locales) {
    const localeDir = path.join(POSTS_PATH, locale);
    let files: string[] = [];
    try {
      files = await fs.readdir(localeDir);
    } catch (err) {
      continue;
    }
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const localePosts = (await Promise.all(
      mdxFiles.map(async (file) => {
        const fullPath = path.join(localeDir, file);
        try {
          const fileContent = await fs.readFile(fullPath, "utf-8");
          const { content, data } = matter(fileContent);
          const frontmatter = assertFrontmatter(data, file.replace(/\.mdx$/, ""));
          const stats = readingTime(content);

          return {
            ...frontmatter,
            content,
            readingTimeText: stats.text,
            minutes: Math.max(1, Math.round(stats.minutes)),
            categorySlug: normalizeSlug(frontmatter.category),
            tagSlugs: frontmatter.tags.map(normalizeSlug),
            locale
          };
        } catch (err: any) {
          logError("Failed to parse MDX", { file: fullPath, error: err?.message });
          return null;
        }
      })
    )).filter(Boolean) as Post[];
    posts.push(...localePosts);
  }

  posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return posts;
}

export async function getAllPosts(locale?: Locale): Promise<Post[]> {
  if (cachedPosts) {
    return locale ? cachedPosts.filter((p) => p.locale === locale) : cachedPosts;
  }
  cachedPosts = await loadPosts();
  return locale ? cachedPosts.filter((p) => p.locale === locale) : cachedPosts;
}

export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
  const posts = await getAllPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getCompiledPost(locale: Locale, slug: string) {
  const post = await getPostBySlug(locale, slug);
  if (!post) {
    return null;
  }

  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        // Cast to avoid versioned type mismatch between unified and remark-gfm types.
        remarkPlugins: [remarkGfm as unknown as never]
      }
    },
    components: mdxComponents
  });

  return { post, content };
}

export async function getAllCategories(locale?: Locale) {
  const posts = await getAllPosts(locale);
  const map = new Map<string, string>();
  posts.forEach((post) => map.set(post.categorySlug, post.category));
  return Array.from(map.entries()).map(([slug, label]) => ({ slug, label }));
}

export async function getAllTags(locale?: Locale) {
  const posts = await getAllPosts(locale);
  const map = new Map<string, string>();
  posts.forEach((post) =>
    post.tags.forEach((tag, idx) => map.set(post.tagSlugs[idx], tag))
  );
  return Array.from(map.entries()).map(([slug, label]) => ({ slug, label }));
}

export async function searchPosts(query: string, locale?: Locale): Promise<Post[]> {
  const posts = await getAllPosts(locale);
  const term = query.toLowerCase().trim();
  if (!term) return posts;

  return posts.filter((post) => {
    const haystack = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
    return haystack.includes(term);
  });
}

export function resetPostCache() {
  cachedPosts = null;
}

export async function getTranslationsFor(translationKey: string) {
  const posts = await getAllPosts();
  const map: Partial<Record<Locale, string>> = {};
  posts
    .filter((p) => p.translationKey === translationKey)
    .forEach((p) => {
      map[p.locale as Locale] = p.slug;
    });
  return map;
}
