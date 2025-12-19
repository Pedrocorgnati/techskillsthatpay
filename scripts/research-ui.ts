import fs from "fs/promises";
import path from "path";

type Query = {
  id: string;
  prompt: string;
  reason: string;
};

// Perplexity API key (can also be set via env PPLX_API_KEY)
const API_URL = "https://api.perplexity.ai/chat/completions";
const API_KEY = process.env.PPLX_API_KEY;
if (!API_KEY) {
  throw new Error("Missing PPLX_API_KEY. Set it in your environment before running this script.");
}

const queries: Query[] = [
  {
    id: "color-system",
    prompt:
      "Return a concise JSON summary of best modern color palette scales for tech websites (light/dark mode, 2025, accessible, SaaS/blog). Include 2-3 candidate palettes with HEX, a recommended grayscale, feedback colors (success/warn/error), and WCAG AA/AAA notes. Include sources/URLs.",
    reason: "Color system and accessibility guidance."
  },
  {
    id: "tech-brand-palettes",
    prompt:
      "Return a JSON summary of color palettes that fit technology/developer tools/modern UI: trustworthy, premium, minimal. Include 2-3 candidate palettes with HEX, feedback colors, and any noted accessibility considerations. Include sources/URLs.",
    reason: "Tech brand palette inspiration."
  },
  {
    id: "blog-layout-trends",
    prompt:
      "Return a JSON summary of successful blog layout patterns 2024/2025: typography scale, spacing, cards, nav, reading experience, conversion. Include recommendations for layout, grid, CTA, TOC/sidebar, and accessibility (WCAG where possible). Include sources/URLs.",
    reason: "Layout/typography/UX patterns for blogs."
  }
];

const researchDir = path.join(process.cwd(), "research");
const perplexityDir = path.join(researchDir, "perplexity");
const sourcesFile = path.join(researchDir, "RESEARCH_SOURCES.md");

async function ensureDirs() {
  await fs.mkdir(perplexityDir, { recursive: true });
}

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s)"]+)/gi;
  const urls = new Set<string>();
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = urlRegex.exec(text)) !== null) {
    urls.add(match[1]);
  }
  return Array.from(urls);
}

async function callPerplexity(query: Query) {
  const body = {
    model: "sonar-pro",
    temperature: 0.3,
    max_tokens: 1200,
    return_citations: true,
    messages: [
      {
        role: "system",
        content:
          "You are a concise research assistant. Respond ONLY with valid JSON. Include citations/URLs in a `sources` array. Keep answers actionable."
      },
      {
        role: "user",
        content: query.prompt
      }
    ]
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Perplexity API failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  await fs.writeFile(path.join(perplexityDir, `${query.id}.json`), JSON.stringify(data, null, 2), {
    encoding: "utf-8"
  });

  const content: string = data?.choices?.[0]?.message?.content ?? "";
  let parsed: any = null;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    parsed = { raw: content };
  }

  const sourcesFromJson: string[] = Array.isArray(parsed?.sources) ? parsed.sources : [];
  const sourcesFromText = extractUrls(content);
  const uniqueSources = Array.from(new Set([...sourcesFromJson, ...sourcesFromText]));

  const summary = {
    id: query.id,
    prompt: query.prompt,
    parsed,
    sources: uniqueSources
  };

  await fs.writeFile(
    path.join(perplexityDir, `${query.id}-summary.json`),
    JSON.stringify(summary, null, 2),
    { encoding: "utf-8" }
  );

  return { summary, sources: uniqueSources };
}

async function writeSources(sourcesMap: Record<string, { urls: string[]; reason: string }>) {
  const lines: string[] = ["# Research Sources", ""];
  Object.entries(sourcesMap).forEach(([id, info]) => {
    info.urls.forEach((url) => {
      lines.push(`- ${url} — ${info.reason}`);
    });
  });
  await fs.writeFile(sourcesFile, lines.join("\n"), { encoding: "utf-8" });
}

async function main() {
  await ensureDirs();
  const sourcesMap: Record<string, { urls: string[]; reason: string }> = {};

  for (const query of queries) {
    try {
      const { sources } = await callPerplexity(query);
      sourcesMap[query.id] = { urls: sources, reason: query.reason };
      console.log(`Saved research for ${query.id} with ${sources.length} sources.`);
    } catch (err) {
      console.error(`Failed ${query.id}:`, err);
    }
  }

  await writeSources(sourcesMap);
  console.log("Research completed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
