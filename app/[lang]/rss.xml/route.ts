import { buildRssFeed } from "@/lib/rss";
import { normalizeLocale, type Locale } from "@/lib/i18n";

export const revalidate = 3600;

type Props = {
  params: { lang: Locale };
};

export async function GET(request: Request, { params }: Props) {
  const locale = normalizeLocale(params.lang);
  const xml = await buildRssFeed(locale);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
