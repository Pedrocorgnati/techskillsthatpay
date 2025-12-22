import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          rel={page === currentPage - 1 ? "prev" : page === currentPage + 1 ? "next" : undefined}
          aria-current={page === currentPage ? "page" : undefined}
          className={`min-w-[40px] rounded-full border px-3 py-2 text-sm font-semibold transition ${
            page === currentPage
              ? "border-transparent bg-gradient-to-r from-accent to-blue-500 text-accent-foreground shadow-lg shadow-blue-500/30"
            : "border-border bg-card text-text-primary hover:-translate-y-0.5 hover:border-border hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          }`}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}
