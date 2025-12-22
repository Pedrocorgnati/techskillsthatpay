import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/domainRouting";

export const locales = LOCALES;
export type { Locale };
export const defaultLocale: Locale = DEFAULT_LOCALE;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value?: string): Locale {
  if (!value) return defaultLocale;
  const lower = value.toLowerCase();
  const direct = locales.find((loc) => loc === lower);
  if (direct) return direct;
  // accept-language may send "pt-BR"
  const prefix = lower.split("-")[0];
  const match = locales.find((loc) => loc === prefix);
  return match ?? defaultLocale;
}
