import type { Post } from "./types.ts";
import { getBaseUrlForLocale } from "./domainRouting.ts";
import { getHtmlLang, getOgLocale, type Locale } from "./i18n.ts";

export const SITE_NAME = "TechSkillsThatPay";
export const SITE_TWITTER = "@techskillsthatpay";
export const SITE_LOGO_PATH = "/logo.svg";

const SITE_DESCRIPTIONS: Record<Locale, string> = {
  en: "Practical guidance for tech careers that actually pay — roadmaps, course picks, and playbooks.",
  pt: "Guias praticos para carreiras de tecnologia com bom retorno — roadmaps, cursos e playbooks.",
  es: "Guias practicas para carreras tech con buen ROI — roadmaps, cursos y playbooks.",
  it: "Guide pratiche per carriere tech ad alto ROI — roadmap, corsi e playbook."
};

const SITE_TITLES: Record<Locale, string> = {
  en: "TechSkillsThatPay | Evidence-based career skills",
  pt: "TechSkillsThatPay | Habilidades com ROI comprovado",
  es: "TechSkillsThatPay | Habilidades con ROI comprobado",
  it: "TechSkillsThatPay | Competenze con ROI comprovato"
};

export const MIN_POSTS_FOR_INDEX = 3;

export function getSiteTitle(locale: Locale) {
  return SITE_TITLES[locale] ?? SITE_TITLES.en;
}

export function getSiteDescription(locale: Locale) {
  return SITE_DESCRIPTIONS[locale] ?? SITE_DESCRIPTIONS.en;
}

export function getDefaultOgImage(locale: Locale) {
  return `${getBaseUrlForLocale(locale)}/og/default/${locale}`;
}

export function getPostSeoTitle(post: Post) {
  return post.seoTitle?.trim() || post.title;
}

export function getPostSeoDescription(post: Post) {
  return post.seoDescription?.trim() || post.description;
}

export function getPostOgImage(post: Post, locale: Locale) {
  return post.ogImage?.trim() || post.coverImage || getDefaultOgImage(locale);
}

export function getPostKeywords(post: Post) {
  const list: string[] = [];
  if (post.primaryKeyword) list.push(post.primaryKeyword);
  if (Array.isArray(post.secondaryKeywords)) list.push(...post.secondaryKeywords);
  if (Array.isArray(post.keywords)) list.push(...post.keywords);
  return Array.from(new Set(list.filter(Boolean)));
}

export function buildPostJsonLd(post: Post, locale: Locale) {
  const baseUrl = getBaseUrlForLocale(locale);
  const url = `${baseUrl}/posts/${post.slug}`;
  const image = getPostOgImage(post, locale);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: getPostSeoTitle(post),
    description: getPostSeoDescription(post),
    datePublished: post.date,
    dateModified: post.updated,
    image: image ? [image] : undefined,
    url,
    inLanguage: getHtmlLang(locale),
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: post.author,
      description: post.authorBio || undefined
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
      logo: `${baseUrl}${SITE_LOGO_PATH}`
    },
    keywords: getPostKeywords(post).join(", ")
  };
}

export function buildBreadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildSiteJsonLd(locale: Locale) {
  const baseUrl = getBaseUrlForLocale(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: SITE_NAME,
        url: baseUrl,
        logo: `${baseUrl}${SITE_LOGO_PATH}`
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        url: baseUrl,
        name: SITE_NAME,
        description: getSiteDescription(locale),
        inLanguage: getHtmlLang(locale),
        publisher: {
          "@id": `${baseUrl}#organization`
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };
}

export function shouldIndexCollection(count: number) {
  return count >= MIN_POSTS_FOR_INDEX;
}

export function getPreviewRobots() {
  const isPreview = process.env.VERCEL_ENV === "preview";
  return isPreview
    ? { index: false, follow: false, nocache: true, noarchive: true }
    : undefined;
}

export function getOgLocaleValue(locale: Locale) {
  return getOgLocale(locale);
}
