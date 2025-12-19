import Link from "next/link";

type Props = {
  tag: string;
  slug?: string;
  locale?: string;
};

export default function TagPill({ tag, slug, locale }: Props) {
  const base = locale ? `/${locale}` : "";
  const content = (
    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-text-secondary shadow-sm">
      {tag}
    </span>
  );

  if (slug) {
    return (
      <Link
        href={`${base}/tag/${slug}`}
        className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
      >
        {content}
      </Link>
    );
  }

  return content;
}
