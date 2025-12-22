"use client";

import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export default function Footer({ locale: _locale }: Props) {
  const buildHref = (path: string) => `/${path}`;

  return (
    <footer className="mt-12 border-t border-border bg-surface py-10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-text-primary">TechSkillsThatPay</p>
          <p className="text-sm text-text-secondary">
            Straightforward playbooks for tech careers and smart learning investments.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Link className="rounded-full px-3 py-2 transition hover:bg-muted" href={buildHref("privacy")}>
            Privacy
          </Link>
          <Link className="rounded-full px-3 py-2 transition hover:bg-muted" href={buildHref("disclosure")}>
            Disclosure
          </Link>
          <Link className="rounded-full px-3 py-2 transition hover:bg-muted" href={buildHref("contact")}>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
