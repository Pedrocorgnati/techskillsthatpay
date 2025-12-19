"use client";

import { useState } from "react";

import { locales, type Locale } from "@/lib/i18n";
import { normalizeLocale } from "@/lib/i18n";

const provider = process.env.NEXT_PUBLIC_CONTENT_STORE_PROVIDER || "fs";

type GlobalPostInput = {
  translationKey: string;
  author: string;
  affiliateDisclosure: boolean;
  date: string;
};

type LocalizedPostInput = {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string;
  content: string;
};

const emptyLocalized: LocalizedPostInput = {
  title: "",
  description: "",
  slug: "",
  category: "",
  tags: "",
  content: ""
};

export default function PublishPage() {
  const [globalData, setGlobalData] = useState<GlobalPostInput>({
    translationKey: "",
    author: "",
    affiliateDisclosure: false,
    date: ""
  });
  const [localizedData, setLocalizedData] = useState<Record<Locale, LocalizedPostInput>>(
    locales.reduce(
      (acc, loc) => ({
        ...acc,
        [loc]: { ...emptyLocalized }
      }),
      {} as Record<Locale, LocalizedPostInput>
    )
  );
  const [status, setStatus] = useState<string>("");
  const [publishUrl, setPublishUrl] = useState<string>("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [publishing, setPublishing] = useState(false);
  const [helperLang, setHelperLang] = useState<Locale>("en");
  const [helperOutput, setHelperOutput] = useState<string>("");
  const [helperStatus, setHelperStatus] = useState<string>("");

  const handleLocalizedChange = (loc: Locale, field: keyof LocalizedPostInput, value: string) => {
    setLocalizedData((prev) => ({ ...prev, [loc]: { ...prev[loc], [field]: value } }));
  };

  const handleSubmit = async () => {
    setStatus("");
    setPublishUrl("");
    setWarnings([]);
    setError("");

    if (!globalData.translationKey.trim()) {
      setError("translationKey is required.");
      return;
    }
    if (!localizedData.en.title.trim()) {
      setError("English content is required.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ global: globalData, localized: localizedData })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to publish");
      }
      const resultUrl = data?.result?.prUrl || data?.result?.commitUrl;
      setPublishUrl(resultUrl || "");
      if (Array.isArray(data?.warnings)) {
        setWarnings(data.warnings);
      }
      setStatus("Published successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const handleImportJson = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      const nextGlobal = parsed.global ?? {};
      const nextLocalized = parsed.localized ?? {};
      if (!nextGlobal.translationKey) throw new Error("Missing global.translationKey");
      setGlobalData({
        translationKey: String(nextGlobal.translationKey || ""),
        author: String(nextGlobal.author || ""),
        affiliateDisclosure: Boolean(nextGlobal.affiliateDisclosure),
        date: String(nextGlobal.date || "")
      });
      const merged = { ...localizedData };
      locales.forEach((loc) => {
        const localeData = nextLocalized[loc] ?? {};
        merged[loc] = {
          title: String(localeData.title || ""),
          description: String(localeData.description || ""),
          slug: String(localeData.slug || ""),
          category: String(localeData.category || ""),
          tags: Array.isArray(localeData.tags) ? localeData.tags.join(", ") : String(localeData.tags || ""),
          content: String(localeData.content || "")
        };
      });
      setLocalizedData(merged);
      setStatus("Imported JSON successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to import JSON");
    }
  };

  const fetchContentIndex = async (type: "posts" | "categories") => {
    setHelperStatus("Loading...");
    setError("");
    try {
      const res = await fetch(
        `/api/admin/content-index?lang=${helperLang}&type=${type}`,
        { method: "GET" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch content index");
      }
      const data = await res.json();
      const items: any[] = data.items || [];
      const lines =
        type === "posts"
          ? items.map((item) => `${item.title} — ${item.url}`)
          : items.map((item) => `${item.name} — ${item.url}`);
      setHelperOutput(lines.join("\n"));
      setHelperStatus(`Loaded ${items.length} ${type}.`);
    } catch (err: any) {
      setHelperStatus("");
      setError(err.message || "Failed to load content index");
    }
  };

  const copyHelperOutput = async () => {
    try {
      await navigator.clipboard.writeText(helperOutput);
      setHelperStatus("Copied to clipboard.");
    } catch (err: any) {
      setError("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publicar</h1>
          <p className="text-text-secondary">Create multilingual posts in one go.</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={publishing}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow hover:bg-accent/90 disabled:opacity-50"
        >
          {publishing ? "Publishing..." : "Publish (all languages)"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
        <p className="text-text-secondary">
          Import a Content Package JSON to prefill all 4 languages.
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-primary shadow-sm">
          Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              handleImportJson(text);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <div className="rounded-xl border border-border bg-muted px-4 py-2 text-xs text-text-secondary">
        <p>
          Content store provider: <span className="font-semibold">{provider}</span>{" "}
          {provider === "mock"
            ? "(in-memory only; changes are NOT persisted)"
            : "(writes to file system)"}
        </p>
        <p className="mt-1">
          Publishing requires all 4 languages and sets <span className="font-semibold">updated</span> automatically.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">Campos gerais</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-text-primary">
            translationKey
            <input
              value={globalData.translationKey}
              onChange={(e) => setGlobalData({ ...globalData, translationKey: e.target.value })}
              className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-sm font-semibold text-text-primary">
            Author
            <input
              value={globalData.author}
              onChange={(e) => setGlobalData({ ...globalData, author: e.target.value })}
              className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-text-primary">
            Date
            <input
              type="date"
              value={globalData.date}
              onChange={(e) => setGlobalData({ ...globalData, date: e.target.value })}
              className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <input
              type="checkbox"
              checked={globalData.affiliateDisclosure}
              onChange={(e) =>
                setGlobalData({ ...globalData, affiliateDisclosure: e.target.checked })
              }
            />
            Affiliate disclosure
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-dashed border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">Internal Link Opportunities</h2>
          <span className="text-xs text-text-secondary">
            Use these lists to paste into python-blogger V3.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-text-primary">
            Language
            <select
              value={helperLang}
              onChange={(e) => setHelperLang(normalizeLocale(e.target.value))}
              className="ml-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm"
            >
              {locales.map((loc) => (
                <option key={loc} value={loc}>
                  {loc.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetchContentIndex("posts")}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
            >
              List existing posts
            </button>
            <button
              type="button"
              onClick={() => fetchContentIndex("categories")}
              className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow hover:bg-accent/90"
            >
              List existing categories
            </button>
            <button
              type="button"
              onClick={copyHelperOutput}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-primary shadow-sm"
              disabled={!helperOutput}
            >
              Copy to clipboard
            </button>
          </div>
        </div>
        <textarea
          value={helperOutput}
          readOnly
          rows={8}
          className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary"
          placeholder="Click a button to list posts or categories for the selected language."
        />
        {helperStatus ? <p className="text-xs text-green-600">{helperStatus}</p> : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Conteúdo por idioma</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          {locales.map((loc) => {
            const data = localizedData[loc];
            return (
              <div
                key={loc}
                className="space-y-3 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  {loc.toUpperCase()}
                </p>
                <label className="block font-semibold text-text-primary">
                  Title
                  <input
                    value={data.title}
                    onChange={(e) => handleLocalizedChange(loc, "title", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                  />
                </label>
                <label className="block font-semibold text-text-primary">
                  Description
                  <textarea
                    value={data.description}
                    onChange={(e) => handleLocalizedChange(loc, "description", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                    rows={2}
                  />
                </label>
                <label className="block font-semibold text-text-primary">
                  Slug
                  <input
                    value={data.slug}
                    onChange={(e) => handleLocalizedChange(loc, "slug", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                  />
                </label>
                <label className="block font-semibold text-text-primary">
                  Category
                  <input
                    value={data.category}
                    onChange={(e) => handleLocalizedChange(loc, "category", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                  />
                </label>
                <label className="block font-semibold text-text-primary">
                  Tags (comma separated)
                  <input
                    value={data.tags}
                    onChange={(e) => handleLocalizedChange(loc, "tags", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                  />
                </label>
                <label className="block font-semibold text-text-primary">
                  Content (MDX)
                  <textarea
                    value={data.content}
                    onChange={(e) => handleLocalizedChange(loc, "content", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-muted px-3 py-2"
                    rows={10}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {status ? <p className="text-sm text-green-600">{status}</p> : null}
      {publishUrl ? (
        <p className="text-sm text-text-secondary">
          Result:{" "}
          <a className="text-blue-700 dark:text-blue-300" href={publishUrl} target="_blank" rel="noreferrer">
            {publishUrl}
          </a>
        </p>
      ) : null}
      {warnings.length ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text-primary">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
