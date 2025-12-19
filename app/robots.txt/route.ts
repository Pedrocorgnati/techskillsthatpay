const baseUrl = "https://techskillsthatpay.com";

export function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
Host: techskillsthatpay.com
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
