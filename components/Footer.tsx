"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { defaultLocale, isLocale } from "@/lib/i18n";

export default function Footer() {
  const pathname = usePathname();
  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] && isLocale(segments[0]) ? segments[0] : defaultLocale;
  }, [pathname]);

  const buildHref = (path: string) => `/${lang}/${path}`;

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
