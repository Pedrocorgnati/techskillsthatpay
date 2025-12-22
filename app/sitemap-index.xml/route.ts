import { buildSitemapIndex } from "@/lib/sitemap";

export async function GET() {
  const xml = await buildSitemapIndex();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
