import Link from "next/link";

type Props = {
  category: string;
  slug?: string;
  locale?: string;
};

export default function CategoryBadge({ category, slug, locale }: Props) {
  const base = locale ? `/${locale}` : "";
  const badge = (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-blue-500/30">
      <span className="h-2 w-2 rounded-full bg-white/80" aria-hidden />
      {category}
    </span>
  );

  if (slug) {
    return (
      <Link
        href={`${base}/category/${slug}`}
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {badge}
      </Link>
    );
  }

  return badge;
}
