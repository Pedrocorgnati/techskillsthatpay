export const locales = ["en", "pt", "es", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

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
