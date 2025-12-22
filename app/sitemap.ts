import type { MetadataRoute } from "next";

import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { locales } from "@/lib/i18n";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = ["", "courses", "about", "privacy", "disclosure", "contact", "search", "categories"];

  for (const locale of locales) {
    const baseUrl = getBaseUrlForLocale(locale);
    staticPaths.forEach((route) => {
      routes.push({
        url: `${baseUrl}${route ? `/${route}` : ""}`,
        lastModified: new Date()
      });
    });

    const posts = await getAllPosts(locale);
    posts.forEach((post) =>
      routes.push({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updated)
      })
    );

    const categories = await getAllCategories(locale);
    categories.forEach((category) =>
      routes.push({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date()
      })
    );

    const tags = await getAllTags(locale);
    tags.forEach((tag) =>
      routes.push({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: new Date()
      })
    );
  }

  return routes;
}
