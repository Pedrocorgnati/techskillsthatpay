"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale } from "@/lib/i18n";

const navItems = [
  { href: "", label: "Home" },
  { href: "courses", label: "Courses" },
  { href: "categories", label: "Categories" },
  { href: "about", label: "About" }
];

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const pathname = usePathname();

  const buildHref = (path: string) => {
    if (!path) return "/";
    return `/${path}`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-gradient-to-b from-surface/90 via-surface/80 to-surface/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full px-3 py-2 text-lg font-semibold tracking-tight text-text-primary transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="rounded-xl bg-gradient-to-br from-accent to-blue-500 px-3 py-1 text-sm font-bold uppercase text-accent-foreground shadow-lg shadow-slate-900/20">
            Tech
          </span>
          <span>SkillsThatPay</span>
        </Link>
        <nav
          aria-label="Main menu"
          className="hidden items-center gap-2 rounded-full px-3 py-1 shadow-sm shadow-slate-200/70 backdrop-blur dark:shadow-none sm:flex"
        >
          <ul className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={buildHref(item.href)}
                  className="rounded-full px-3 py-2 transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`${buildHref("search")}`}
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-text-secondary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
          >
            <span>Search</span>
            <span aria-hidden className="text-text-secondary">⌘K</span>
          </Link>
          <LanguageSwitcher currentPath={pathname} locale={locale} />
          <ThemeToggle />
        </div>
      </div>
      <nav
        aria-label="Mobile menu"
        className="mt-2 block border-t border-border bg-card/80 px-4 py-2 shadow-sm sm:hidden"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto text-sm font-semibold text-text-secondary">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={buildHref(item.href)}
              className="rounded-full border border-border px-3 py-2 transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`${buildHref("search")}`}
            className="rounded-full border border-border px-3 py-2 transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Search
          </Link>
          <LanguageSwitcher currentPath={pathname} locale={locale} />
        </div>
      </nav>
    </header>
  );
}
