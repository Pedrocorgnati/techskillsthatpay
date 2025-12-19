import Image from "next/image";
import Link from "next/link";

import CategoryBadge from "@/components/CategoryBadge";
import TagPill from "@/components/TagPill";
import type { Post } from "@/lib/types";

type Props = {
  post: Post;
  locale?: string;
};

export default function PostCard({ post, locale }: Props) {
  const base = locale ? `/${locale}` : "";
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:shadow-none">
      <div className="relative h-52 w-full overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <CategoryBadge category={post.category} slug={post.categorySlug} />
          <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-text-secondary shadow-sm backdrop-blur">
            {post.readingTimeText}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <span>
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </span>
          <span className="text-accent">Read</span>
        </div>
        <h3 className="text-xl font-semibold leading-tight text-text-primary transition group-hover:text-accent">
          <Link href={`${base}/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-text-secondary">{post.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag, idx) => (
            <TagPill key={tag} tag={tag} slug={post.tagSlugs[idx]} />
          ))}
        </div>
      </div>
    </article>
  );
}
