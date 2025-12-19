import Link from "next/link";

import Container from "@/components/Container";
import NewsletterBox from "@/components/NewsletterBox";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { normalizeLocale, type Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

const POSTS_PER_PAGE = 10;

export const dynamic = "force-dynamic";

type Props = {
  params: { lang: Locale };
  searchParams?: { page?: string | string[] };
};

export default async function HomePage({ params, searchParams }: Props) {
  const lang = normalizeLocale(params.lang);
  const pageParam = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const posts = await getAllPosts(lang);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const visible = posts.slice(start, start + POSTS_PER_PAGE);
  const latestUpdated = posts[0]?.updated ?? new Date().toISOString();

  return (
    <div className="bg-gradient-to-b from-background to-surface pb-16 pt-6">
      <Container>
        <section className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:shadow-none">
            <div className="absolute inset-0 opacity-60 dark:opacity-50" aria-hidden>
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl dark:bg-blue-500/20" />
              <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-indigo-100 blur-3xl dark:bg-indigo-500/10" />
            </div>
            <div className="relative space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-accent-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                TechSkillsThatPay
              </p>
              <h1 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
                Learn the tech skills that actually boost your salary — without wasting time.
              </h1>
              <p className="text-lg text-text-secondary">
                Roadmaps, course picks, and templates for breaking into high-paying tech roles. No
                fluff, just what works.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/courses`}
                  className="rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Explore curated courses
                </Link>
                <Link
                  href={`/${lang}/categories`}
                  className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Browse by category
                </Link>
              </div>
              <div className="grid gap-3 rounded-2xl border border-border bg-card/80 p-4 text-sm text-text-secondary shadow-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary">Posts</p>
                  <p className="text-xl font-semibold text-text-primary">{posts.length}+ playbooks</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary">Focus</p>
                  <p className="text-xl font-semibold text-text-primary">ROI-first skills</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary">Latest update</p>
                  <p className="text-xl font-semibold text-text-primary">
                    {new Date(latestUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full">
            <NewsletterBox />
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Latest Playbooks
              </p>
              <h2 className="text-2xl font-semibold text-text-primary">Fresh, evergreen guides</h2>
            </div>
            <Link
              href={`/${lang}/search`}
              className="text-sm font-semibold text-accent transition hover:text-accent/80"
            >
              Search posts →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} locale={lang} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/${lang}`} />
        </section>
      </Container>
    </div>
  );
}
