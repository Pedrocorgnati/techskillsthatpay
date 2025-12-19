export type StoredPostIndex = { locale: string; slug: string };

export interface ContentStore {
  provider: string;
  writePost(locale: string, slug: string, mdxText: string): Promise<void>;
  readPost(locale: string, slug: string): Promise<string | null>;
  listPosts(locale?: string): Promise<StoredPostIndex[]>;
  listCategories(locale?: string): Promise<string[]>;
  isWritable(): boolean;
}

import { contentStoreProvider } from "@/lib/config";
import { getFsContentStore } from "@/lib/storage/fsContentStore";
import { getMockContentStore } from "@/lib/storage/mockContentStore";

let cachedStore: ContentStore | null = null;

export function getContentStore(): ContentStore {
  if (cachedStore) return cachedStore;

  const provider = (contentStoreProvider || "fs").toLowerCase();
  switch (provider) {
    case "mock":
      cachedStore = getMockContentStore();
      break;
    case "fs":
    default:
      cachedStore = getFsContentStore();
  }
  return cachedStore;
}
