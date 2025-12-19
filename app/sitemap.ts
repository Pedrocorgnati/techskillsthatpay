import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";

const baseUrl = "https://techskillsthatpay.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = ["", "courses", "about", "privacy", "disclosure", "contact", "search", "categories"];

  for (const locale of locales) {
    staticPaths.forEach((route) => {
      routes.push({
        url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
        lastModified: new Date()
      });
    });

    const posts = await getAllPosts(locale);
    posts.forEach((post) =>
      routes.push({
        url: `${baseUrl}/${locale}/posts/${post.slug}`,
        lastModified: new Date(post.updated)
      })
    );

    const categories = await getAllCategories(locale);
    categories.forEach((category) =>
      routes.push({
        url: `${baseUrl}/${locale}/category/${category.slug}`,
        lastModified: new Date()
      })
    );

    const tags = await getAllTags(locale);
    tags.forEach((tag) =>
      routes.push({
        url: `${baseUrl}/${locale}/tag/${tag.slug}`,
        lastModified: new Date()
      })
    );
  }

  return routes;
}
