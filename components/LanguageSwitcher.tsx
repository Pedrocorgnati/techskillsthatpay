"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { getBaseUrlForLocale } from "@/lib/domainRouting";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

type Props = {
  currentPath?: string;
};

export default function LanguageSwitcher({ currentPath }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activePath = currentPath ?? pathname;
  const { currentLang, segments } = useMemo(() => {
    const parts = activePath.split("/").filter(Boolean);
    const lang = parts[0] && isLocale(parts[0]) ? parts[0] : defaultLocale;
    return { currentLang: lang, segments: parts };
  }, [activePath]);

  const handleChange = (lang: string) => {
    const params = searchParams.toString();
    const rest = segments[0] && isLocale(segments[0]) ? segments.slice(1) : segments;
    const nextPath = "/" + rest.join("/");
    const baseUrl = getBaseUrlForLocale(lang as any);
    document.cookie = `locale=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const target = `${baseUrl}${nextPath || "/"}`;
    router.push(params ? `${target}?${params}` : target);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-xs font-semibold text-text-secondary shadow-sm">
      {locales.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleChange(lang)}
          className={`rounded-full px-2 py-1 transition ${
            currentLang === lang
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted text-text-secondary"
          }`}
          aria-label={`Switch to ${lang}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
