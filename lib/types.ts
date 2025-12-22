export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  category: string;
  slug: string;
  coverImage?: string;
  keywords?: string[];
  affiliateDisclosure: boolean;
  readingTime?: string;
  author: string;
  translationKey: string;
};

export type Post = PostFrontmatter & {
  content: string;
  readingTimeText: string;
  minutes: number;
  categorySlug: string;
  tagSlugs: string[];
  locale: string;
};
