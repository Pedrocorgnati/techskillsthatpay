import { DEFAULT_LOCALE, LOCALES, type Locale } from "./domainRouting.ts";

export const locales = LOCALES;
export type { Locale };
export const defaultLocale: Locale = DEFAULT_LOCALE;

const HTML_LANG_MAP: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
  es: "es-ES",
  it: "it-IT"
};

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
  it: "it_IT"
};

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Portuguese (Brazil)",
  es: "Spanish (Spain)",
  it: "Italian"
};

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

export function getHtmlLang(locale: Locale): string {
  return HTML_LANG_MAP[locale] ?? HTML_LANG_MAP[defaultLocale];
}

export function getOgLocale(locale: Locale): string {
  return OG_LOCALE_MAP[locale] ?? OG_LOCALE_MAP[defaultLocale];
}

export function getLocaleLabel(locale: Locale): string {
  return LOCALE_LABELS[locale] ?? LOCALE_LABELS[defaultLocale];
}
