import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import Analytics from "@/components/Analytics";
import AdSlot from "@/components/AdSlot";
import { adsenseEnabled } from "@/lib/config";
import { getHtmlLang, normalizeLocale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerLocale = headers().get("x-locale") || "";
  const locale = normalizeLocale(headerLocale);
  return (
    <html lang={getHtmlLang(locale)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        {children}
        <Analytics />
        {adsenseEnabled ? <AdSlot className="mt-4" /> : null}
      </body>
    </html>
  );
}
