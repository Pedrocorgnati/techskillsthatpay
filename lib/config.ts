const isProd = process.env.NODE_ENV === "production";

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined || value === null) return defaultValue;
  const normalized = value.toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
}

export const adminEnabled = parseBoolean(process.env.ADMIN_ENABLED, !isProd);
export const adminAuthEnabled = parseBoolean(
  process.env.ADMIN_AUTH_ENABLED,
  isProd ? true : false
);
export const adminAuthUser = process.env.ADMIN_AUTH_USER ?? "";
export const adminAuthPass = process.env.ADMIN_AUTH_PASS ?? "";

export const contentStoreProvider =
  process.env.CONTENT_STORE_PROVIDER ??
  process.env.NEXT_PUBLIC_CONTENT_STORE_PROVIDER ??
  "fs";

export const contactProvider = process.env.CONTACT_PROVIDER ?? "mock";
export const contactFromEmail = process.env.CONTACT_FROM_EMAIL ?? "";
export const contactToEmail = process.env.CONTACT_TO_EMAIL ?? "";
export const contactApiKey = process.env.CONTACT_API_KEY ?? "";

export const analyticsProvider = process.env.ANALYTICS_PROVIDER ?? "none";
export const ga4Id = process.env.GA4_ID ?? "";
export const plausibleDomain = process.env.PLAUSIBLE_DOMAIN ?? "";

export const adsenseEnabled = parseBoolean(process.env.ADSENSE_ENABLED, false);
export const adsensePublisherId = process.env.ADSENSE_PUBLISHER_ID ?? "";

export const adminFeatureFlags = {
  adminEnabled,
  adminAuthEnabled,
  contentStoreProvider
};

export const isProduction = isProd;

export function getDefaultLocale() {
  return "en";
}
