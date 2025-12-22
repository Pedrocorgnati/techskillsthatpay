import { headers } from "next/headers";

import { getLocaleFromHost } from "@/lib/domainRouting";
import { buildLocaleSitemap } from "@/lib/sitemap";

export async function GET() {
  const host = headers().get("host") || "";
  const locale = getLocaleFromHost(host);
  const xml = await buildLocaleSitemap(locale);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
