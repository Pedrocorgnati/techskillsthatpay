import type { Metadata } from "next";
import "./globals.css";

import Analytics from "@/components/Analytics";
import AdSlot from "@/components/AdSlot";
import { adsenseEnabled } from "@/lib/config";
import { getBaseUrlForLocale } from "@/lib/domainRouting";

const siteUrl = getBaseUrlForLocale("en");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechSkillsThatPay | Evidence-based career skills",
    template: "%s | TechSkillsThatPay"
  },
  description:
    "Playbooks, roadmaps, and curated courses that teach tech skills with the best ROI. Built for career switchers and ambitious technologists.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TechSkillsThatPay",
    title: "TechSkillsThatPay",
    description:
      "Practical guidance for tech careers that actually pay — roadmaps, course picks, and playbooks."
  },
  twitter: {
    card: "summary_large_image",
    creator: "@techskillsthatpay",
    title: "TechSkillsThatPay",
    description:
      "Practical guidance for tech careers that actually pay — roadmaps, course picks, and playbooks."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        {children}
        <Analytics />
        {adsenseEnabled ? <AdSlot className="mt-4" /> : null}
      </body>
    </html>
  );
}
