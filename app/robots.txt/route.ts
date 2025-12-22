import { headers } from "next/headers";

import { getBaseUrlForLocale, getLocaleFromHost } from "@/lib/domainRouting";

export const dynamic = "force-dynamic";

export function GET() {
  const host = headers().get("host") || "";
  const locale = getLocaleFromHost(host);
  const baseUrl = getBaseUrlForLocale(locale);
  const isPreview = process.env.VERCEL_ENV === "preview";
  const hostName = baseUrl.replace("https://", "");
  const body = isPreview
    ? `User-agent: *
Disallow: /
Host: ${hostName}
`
    : `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml
Host: ${hostName}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
