type Props = {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
};

export default function AffiliateCTA({
  title = "Recommended course",
  description = "Level up with a curated course that we actually recommend for its ROI.",
  href = "https://example.com/aff/placeholder",
  buttonLabel = "Check the course"
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="absolute inset-y-0 right-0 w-32 translate-x-16 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Affiliate pick
        </p>
        <h4 className="text-lg font-bold text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
        <a
          href={href}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {buttonLabel}
          <span aria-hidden>↗</span>
        </a>
        <p className="text-xs text-text-secondary">
          We may earn a commission at no extra cost to you. This supports TechSkillsThatPay.
        </p>
      </div>
    </div>
  );
}
