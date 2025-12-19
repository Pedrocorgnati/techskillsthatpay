export default function NewsletterBox() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-slate-200/80 backdrop-blur dark:shadow-none">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        Stay updated
      </p>
      <h4 className="mt-2 text-lg font-bold text-text-primary">
        Get the latest tech skills that actually pay.
      </h4>
      <p className="mt-1 text-sm text-text-secondary">
        No spam. One high-signal email with career experiments, course picks, and templates.
      </p>
      <form className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none ring-accent/40 transition focus:ring-2"
          required
        />
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Join waitlist
        </button>
      </form>
      <p className="mt-2 text-xs text-text-secondary">
        By subscribing you agree to receive emails from TechSkillsThatPay.
      </p>
    </div>
  );
}
