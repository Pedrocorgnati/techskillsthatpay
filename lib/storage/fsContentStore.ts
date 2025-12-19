import fs from "fs/promises";
import path from "path";

import matter from "gray-matter";

import type { ContentStore, StoredPostIndex } from "@/lib/storage/contentStore";

const baseDir = path.join(process.cwd(), "content", "posts");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function getFsContentStore(): ContentStore {
  const provider = "fs";
  return {
    provider,
    async writePost(locale, slug, mdxText) {
      const localeDir = path.join(baseDir, locale);
      await ensureDir(localeDir);
      const filePath = path.join(localeDir, `${slug}.mdx`);
      await fs.writeFile(filePath, mdxText, { encoding: "utf-8" });
    },
    async readPost(locale, slug) {
      try {
        const filePath = path.join(baseDir, locale, `${slug}.mdx`);
        const text = await fs.readFile(filePath, "utf-8");
        return text;
      } catch {
        return null;
      }
    },
    async listPosts(locale?) {
      const locales = locale ? [locale] : await safeLocales();
      const results: StoredPostIndex[] = [];
      for (const loc of locales) {
        const dir = path.join(baseDir, loc);
        let files: string[] = [];
        try {
          files = await fs.readdir(dir);
        } catch {
          continue;
        }
        files
          .filter((file) => file.endsWith(".mdx"))
          .forEach((file) => results.push({ locale: loc, slug: file.replace(/\.mdx$/, "") }));
      }
      return results;
    },
    async listCategories(locale?) {
      const posts = await this.listPosts(locale);
      const categories = new Set<string>();
      for (const post of posts) {
        const text = await this.readPost(post.locale, post.slug);
        if (!text) continue;
        const parsed = matter(text);
        if (parsed.data?.category) categories.add(String(parsed.data.category));
      }
      return Array.from(categories.values());
    },
    isWritable() {
      return true;
    }
  };
}

async function safeLocales() {
  try {
    return await fs.readdir(baseDir);
  } catch {
    return [];
  }
}
