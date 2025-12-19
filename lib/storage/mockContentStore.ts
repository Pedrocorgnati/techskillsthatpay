import matter from "gray-matter";

import type { ContentStore, StoredPostIndex } from "@/lib/storage/contentStore";
import { getAllPosts } from "@/lib/posts";

const memory = new Map<string, string>(); // key: `${locale}:${slug}`

export function getMockContentStore(): ContentStore {
  const provider = "mock";
  return {
    provider,
    async writePost(locale, slug, mdxText) {
      memory.set(`${locale}:${slug}`, mdxText);
      // eslint-disable-next-line no-console
      console.warn(
        JSON.stringify({
          level: "warn",
          message: "Writing to mock content store (not persisted)",
          locale,
          slug
        })
      );
    },
    async readPost(locale, slug) {
      const key = `${locale}:${slug}`;
      if (memory.has(key)) return memory.get(key) ?? null;
      return null;
    },
    async listPosts(locale?) {
      const posts = await getAllPosts(locale as any);
      const list: StoredPostIndex[] = posts.map((p) => ({ locale: p.locale, slug: p.slug }));
      // add memory-only posts
      memory.forEach((_value, key) => {
        const [loc, slug] = key.split(":");
        if (!locale || locale === loc) {
          if (!list.find((p) => p.locale === loc && p.slug === slug)) {
            list.push({ locale: loc, slug });
          }
        }
      });
      return list;
    },
    async listCategories(locale?) {
      const posts = await getAllPosts(locale as any);
      const categories = new Set<string>();
      posts.forEach((p) => categories.add(p.category));
      memory.forEach((value, key) => {
        const [loc] = key.split(":");
        if (locale && locale !== loc) return;
        const parsed = matter(value);
        if (parsed.data?.category) categories.add(String(parsed.data.category));
      });
      return Array.from(categories.values());
    },
    isWritable() {
      return true;
    }
  };
}
