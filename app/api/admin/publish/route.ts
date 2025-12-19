import { NextResponse } from "next/server";

import { locales, type Locale } from "@/lib/i18n";
import { createRequestLogger } from "@/lib/logger";
import { resetPostCache } from "@/lib/posts";
import { getContentStore } from "@/lib/storage/contentStore";
import { adminEnabled } from "@/lib/config";

type GlobalPostInput = {
  translationKey: string;
  author: string;
  affiliateDisclosure: boolean;
  date: string;
  updated?: string;
};

type LocalizedPostInput = {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string;
  content: string;
};

type Payload = {
  global: GlobalPostInput;
  localized: Record<Locale, LocalizedPostInput>;
};

function buildFrontmatter(global: GlobalPostInput, local: LocalizedPostInput) {
  const tagsArray = local.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return `---
title: "${local.title}"
description: "${local.description}"
date: "${global.date}"
updated: "${global.updated || global.date}"
tags: [${tagsArray.map((t) => `"${t}"`).join(", ")}]
category: "${local.category}"
slug: "${local.slug}"
author: "${global.author}"
translationKey: "${global.translationKey}"
affiliateDisclosure: ${global.affiliateDisclosure}
---`;
}

export async function POST(request: Request) {
  if (!adminEnabled) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const logger = createRequestLogger();
  const body = (await request.json()) as Payload;
  const { global, localized } = body;

  if (!global?.translationKey) {
    return NextResponse.json({ message: "translationKey is required" }, { status: 400 });
  }
  if (!localized?.en?.title) {
    return NextResponse.json({ message: "English content is required" }, { status: 400 });
  }

  const store = getContentStore();
  if (!store.isWritable()) {
    logger.error("Content store is not writable", { provider: store.provider });
    return NextResponse.json({ message: "Content store is not writable" }, { status: 500 });
  }

  for (const locale of locales) {
    const data = localized[locale];
    if (!data || !data.title || !data.slug) continue;

    const fm = buildFrontmatter(global, data);
    const mdx = `${fm}\n\n${data.content || ""}\n`;
    await store.writePost(locale, data.slug, mdx);
  }

  resetPostCache();
  logger.info("Published post set", {
    translationKey: global.translationKey,
    provider: store.provider
  });
  return NextResponse.json({ message: "Published" });
}
