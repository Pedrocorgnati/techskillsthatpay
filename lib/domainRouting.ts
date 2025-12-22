const env = process.env;

export const LOCALES = ["en", "pt", "es", "it"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const DOMAIN_EN = env.DOMAIN_EN || env.NEXT_PUBLIC_DOMAIN_EN || "techskillsthatpay.com";
const DOMAIN_PT = env.DOMAIN_PT || env.NEXT_PUBLIC_DOMAIN_PT || "techskillsthatpay.com.br";
const DOMAIN_ES = env.DOMAIN_ES || env.NEXT_PUBLIC_DOMAIN_ES || "techskillsthatpay.es";
const DOMAIN_IT = env.DOMAIN_IT || env.NEXT_PUBLIC_DOMAIN_IT || "techskillsthatpay.it";

export const LOCALE_TO_DOMAIN: Record<Locale, string> = {
  en: DOMAIN_EN,
  pt: DOMAIN_PT,
  es: DOMAIN_ES,
  it: DOMAIN_IT
};

export const DOMAIN_TO_LOCALE: Record<string, Locale> = {
  [DOMAIN_EN.toLowerCase()]: "en",
  [DOMAIN_PT.toLowerCase()]: "pt",
  [DOMAIN_ES.toLowerCase()]: "es",
  [DOMAIN_IT.toLowerCase()]: "it"
};

export function normalizeHost(host: string): string {
  return host.split(":")[0].trim().toLowerCase();
}

export function isMappedDomain(host: string): boolean {
  return Boolean(DOMAIN_TO_LOCALE[normalizeHost(host)]);
}

export function getLocaleFromHost(host: string): Locale {
  const normalized = normalizeHost(host);
  return DOMAIN_TO_LOCALE[normalized] || DEFAULT_LOCALE;
}

export function getBaseUrlForLocale(locale: Locale): string {
  const domain = LOCALE_TO_DOMAIN[locale] || LOCALE_TO_DOMAIN[DEFAULT_LOCALE];
  return `https://${domain}`;
}
