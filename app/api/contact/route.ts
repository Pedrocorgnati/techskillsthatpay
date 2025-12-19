import { NextResponse } from "next/server";

import { contactProvider } from "@/lib/config";
import { getContactProvider } from "@/lib/contact";
import { createRequestLogger } from "@/lib/logger";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 1000 * 60 * 10; // 10 minutes

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.timestamp > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, timestamp: entry.timestamp });
  return false;
}

export async function POST(request: Request) {
  const logger = createRequestLogger();
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (rateLimited(ip)) {
    logger.warn("Contact rate limit hit", { ip });
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const { name, email, message, locale, nickname } = body;
  if (nickname) {
    logger.warn("Contact honeypot triggered", { ip });
    return NextResponse.json({ message: "ok" });
  }
  if (!name || !email || !message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const provider = getContactProvider();
  try {
    await provider.send({ name, email, message, locale: locale || "en" });
    logger.info("Contact sent", { provider: provider.name, ip, contactProvider });
    return NextResponse.json({ message: "Sent" });
  } catch (err: any) {
    logger.error("Contact send failed", { error: err?.message, provider: provider.name, ip });
    return NextResponse.json({ message: "Failed to send" }, { status: 500 });
  }
}
