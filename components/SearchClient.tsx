'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchPost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  tagSlugs: string[];
  category: string;
  categorySlug: string;
  date: string;
  readingTimeText: string;
};

type Props = {
  posts: SearchPost[];
  locale?: string;
};

export default function SearchClient({ posts, locale }: Props) {
  const base = locale ? `/${locale}` : "";
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const q = term.toLowerCase().trim();
    if (!q) return posts;

    return posts.filter((post) => {
      const haystack = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, term]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-text-primary">
        Search posts
        <input
          type="search"
          name="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by title, tag, or description..."
          className="mt-2 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none ring-accent/40 transition focus:ring-2"
          aria-label="Search posts"
        />
      </label>
      <p className="text-sm text-text-secondary">{filtered.length} posts matched.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-accent">
              <Link href={`${base}/category/${post.categorySlug}`} className="hover:underline">
                {post.category}
              </Link>
              <span className="text-text-secondary">
                {new Date(post.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-text-primary">
              <Link href={`${base}/posts/${post.slug}`} className="transition hover:text-accent">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{post.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
              {post.tags.map((tag, idx) => (
                <Link
                  key={tag}
                  href={`${base}/tag/${post.tagSlugs[idx]}`}
                  className="rounded-full bg-muted px-3 py-1 font-semibold hover:bg-muted/80"
                >
                  #{tag}
                </Link>
              ))}
              <span className="font-semibold">{post.readingTimeText}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
