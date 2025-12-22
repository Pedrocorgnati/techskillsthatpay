export type PostFrontmatter = {
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalOverride?: string;
  noindex?: boolean;
  date: string;
  updated: string;
  tags: string[];
  category: string;
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;
  keywords?: string[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
  serpFeature?: string;
  contentCluster?: string;
  internalLinks?: string[];
  externalCitations?: string[];
  authorBio?: string;
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
