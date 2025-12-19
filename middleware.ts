import { NextRequest, NextResponse } from "next/server";

import { adminAuthEnabled, adminAuthPass, adminAuthUser, adminEnabled } from "@/lib/config";
import { defaultLocale, isLocale, normalizeLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const BOT_UA = /(googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|slurp|linkedinbot)/i;
const adminPaths = ["/admin", "/api/admin"];

function isAdminPath(pathname: string) {
  return adminPaths.some((prefix) => pathname.startsWith(prefix));
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' }
  });
}

function notFound() {
  return new NextResponse("Not found", { status: 404 });
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isBot = BOT_UA.test(request.headers.get("user-agent") || "");
  const hasNoLocaleFlag = searchParams.get("nolocale") === "1";

  const isAdmin = isAdminPath(pathname);
  if (isAdmin) {
    if (!adminEnabled) return notFound();
    if (adminAuthEnabled) {
      if (!adminAuthUser || !adminAuthPass) return unauthorized();
      const authHeader = request.headers.get("authorization") || "";
      const [scheme, token] = authHeader.split(" ");
      if (scheme !== "Basic" || !token) return unauthorized();
      const decoded = globalThis.atob ? globalThis.atob(token) : "";
      const [user, pass] = decoded.split(":");
      if (user !== adminAuthUser || pass !== adminAuthPass) return unauthorized();
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const hasLocale = segments.length > 0 && isLocale(segments[0]);

  if (hasNoLocaleFlag) {
    const res = NextResponse.next();
    res.cookies.set("locale", defaultLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  if (hasLocale) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get("locale")?.value;
  const headerLocale = request.headers.get("accept-language") ?? "";
  const detected =
    normalizeLocale(cookieLocale) ||
    normalizeLocale(headerLocale.split(",")[0]) ||
    defaultLocale;

  const targetLocale = isBot ? defaultLocale : detected;
  const redirectUrl = new URL(`/${targetLocale}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl, { status: 307 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
