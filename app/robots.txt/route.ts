import { headers } from "next/headers";

import { getBaseUrlForLocale, getLocaleFromHost } from "@/lib/domainRouting";

export const dynamic = "force-dynamic";

export function GET() {
  const host = headers().get("host") || "";
  const locale = getLocaleFromHost(host);
  const baseUrl = getBaseUrlForLocale(locale);
  const body = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl.replace("https://", "")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
