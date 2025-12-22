import { NextResponse } from "next/server";

import { adminEnabled, blogAdminApiToken, contentPublishProvider, githubBranch, githubOwner, githubRepo, githubToken, isProduction, publishMode } from "@/lib/config";
import { locales, type Locale } from "@/lib/i18n";
import { createRequestLogger } from "@/lib/logger";
import { getPostBySlug, resetPostCache } from "@/lib/posts";
import { publishAllViaGithub } from "@/lib/publish/githubPublisher";
import { getContentStore } from "@/lib/storage/contentStore";

type GlobalPostInput = {
  translationKey: string;
  author: string;
  coverImage: string;
  affiliateDisclosure: boolean;
  date: string;
};

type LocalizedPostInput = {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string | string[];
  keywords?: string | string[];
  content: string;
};

type Payload = {
  global: GlobalPostInput;
  localized: Record<Locale, LocalizedPostInput>;
};

type ValidationResult = {
  errors: string[];
  warnings: string[];
};

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const accentRegex = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/gi;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 3;
const WINDOW_MS = 1000 * 60; // 1 minute

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

function normalizeTags(tags: string | string[]) {
  const list = Array.isArray(tags)
    ? tags.map((t) => String(t))
    : String(tags)
        .split(",")
        .map((t) => t.trim());
  return list.filter(Boolean);
}

function normalizeKeywords(keywords: string | string[] | undefined) {
  if (!keywords) return [];
  const list = Array.isArray(keywords)
    ? keywords.map((k) => String(k))
    : String(keywords)
        .split(",")
        .map((k) => k.trim());
  return list.filter(Boolean);
}

function buildFrontmatter(global: GlobalPostInput, local: LocalizedPostInput, updated: string) {
  const tagsArray = normalizeTags(local.tags);
  const keywordArray = normalizeKeywords(local.keywords);
  const keywordLine = keywordArray.length
    ? `keywords: [${keywordArray.map((k) => `"${k}"`).join(", ")}]\n`
    : "";

  return `---
title: "${local.title}"
description: "${local.description}"
date: "${global.date}"
updated: "${updated}"
tags: [${tagsArray.map((t) => `"${t}"`).join(", ")}]
${keywordLine}coverImage: "${global.coverImage}"
category: "${local.category}"
slug: "${local.slug}"
author: "${global.author}"
translationKey: "${global.translationKey}"
affiliateDisclosure: ${global.affiliateDisclosure}
---`;
}

function validatePayload(payload: Payload): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload?.global?.translationKey?.trim()) {
    errors.push("translationKey is required.");
  }
  if (!payload?.global?.author?.trim()) {
    errors.push("author is required.");
  }
  if (!payload?.global?.coverImage?.trim()) {
    errors.push("coverImage is required.");
  } else {
    try {
      const url = new URL(payload.global.coverImage);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push("coverImage must be a valid http(s) URL.");
      }
    } catch {
      errors.push("coverImage must be a valid URL.");
    }
  }
  if (!payload?.global?.date?.trim()) {
    errors.push("date is required.");
  }

  for (const locale of locales) {
    const data = payload.localized?.[locale];
    if (!data) {
      errors.push(`Missing data for ${locale}.`);
      continue;
    }
    if (!data.title?.trim()) errors.push(`${locale}: title is required.`);
    if (!data.description?.trim()) errors.push(`${locale}: description is required.`);
    if (!data.slug?.trim()) errors.push(`${locale}: slug is required.`);
    if (!data.category?.trim()) errors.push(`${locale}: category is required.`);
    if (!data.content?.trim()) errors.push(`${locale}: content is required.`);

    if (data.slug && !slugRegex.test(data.slug)) {
      errors.push(`${locale}: slug must be kebab-case.`);
    }

    const tagsArray = normalizeTags(data.tags);
    if (!tagsArray.length) errors.push(`${locale}: tags are required.`);

    if (locale === "en") {
      const accents = (data.content.match(accentRegex) || []).length;
      const ratio = data.content.length ? accents / data.content.length : 0;
      if (ratio > 0.02) {
        warnings.push("English column appears to contain accented characters. Double-check language.");
      }
    }
  }

  return { errors, warnings };
}

function getUpdatedDate() {
  return new Date().toISOString().slice(0, 10);
}

function isBrowserRequest(request: Request) {
  return Boolean(request.headers.get("sec-fetch-mode"));
}

function extractBearerToken(authHeader: string | null) {
  if (!authHeader) return "";
  if (!authHeader.startsWith("Bearer ")) return "";
  return authHeader.slice("Bearer ".length).trim();
}

export async function POST(request: Request) {
  if (!adminEnabled) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (blogAdminApiToken) {
    const authHeader = request.headers.get("authorization");
    const isBasic = authHeader?.startsWith("Basic ");
    const bearer = extractBearerToken(authHeader);
    const headerToken = request.headers.get("x-admin-token") || "";
    const hasValidToken = headerToken === blogAdminApiToken || bearer === blogAdminApiToken;
    if (!isBasic && !isBrowserRequest(request) && !hasValidToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }
  const logger = createRequestLogger();
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (rateLimited(ip)) {
    logger.warn("Publish rate limit hit", { ip });
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  const body = (await request.json()) as Payload;
  const { errors, warnings } = validatePayload(body);
  if (errors.length) {
    return NextResponse.json({ message: errors.join(" "), errors }, { status: 400 });
  }

  const { global, localized } = body;
  const updated = getUpdatedDate();

  const conflictErrors: string[] = [];
  for (const locale of locales) {
    const slug = localized[locale].slug;
    const existing = await getPostBySlug(locale, slug);
    if (existing && existing.translationKey !== global.translationKey) {
      conflictErrors.push(`${locale}: slug already used by ${existing.translationKey}.`);
    }
  }
  if (conflictErrors.length) {
    return NextResponse.json(
      { message: conflictErrors.join(" "), errors: conflictErrors },
      { status: 400 }
    );
  }

  const files = locales.map((locale) => {
    const data = localized[locale];
    const fm = buildFrontmatter(global, data, updated);
    const mdx = `${fm}\n\n${data.content || ""}\n`;
    const path = `content/posts/${locale}/${data.slug}.mdx`;
    return { path, content: mdx };
  });

  if (contentPublishProvider === "github") {
    if (!githubOwner || !githubRepo || !githubToken) {
      logger.error("GitHub publish config missing", { owner: githubOwner, repo: githubRepo });
      const status = isProduction ? 500 : 400;
      return NextResponse.json(
        { message: "GitHub publishing not configured", errors: ["Missing GitHub envs."] },
        { status }
      );
    }

    const result = await publishAllViaGithub(
      {
        owner: githubOwner,
        repo: githubRepo,
        token: githubToken,
        branch: githubBranch,
        mode: publishMode
      },
      files,
      `Publish post ${global.translationKey} (en/pt/es/it)`
    );
    resetPostCache();
    return NextResponse.json({
      message: "Published",
      warnings,
      result
    });
  }

  const store = getContentStore();
  if (!store.isWritable()) {
    logger.error("Content store is not writable", { provider: store.provider });
    return NextResponse.json({ message: "Content store is not writable" }, { status: 500 });
  }

  for (const file of files) {
    const [, , locale, slugWithExt] = file.path.split("/");
    const slug = slugWithExt.replace(/\.mdx$/, "");
    await store.writePost(locale, slug, file.content);
  }

  resetPostCache();
  logger.info("Published post set (fs)", {
    translationKey: global.translationKey,
    provider: store.provider,
    updated
  });
  return NextResponse.json({ message: "Published", warnings });
}
