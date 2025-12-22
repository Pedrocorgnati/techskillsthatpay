export type TranslationObject = {
  "meta.landing.title": string;
  "meta.landing.description": string;
  "meta.about.title": string;
  "meta.about.description": string;
  "meta.courses.title": string;
  "meta.courses.description": string;
  "meta.contact.title": string;
  "meta.contact.description": string;
  "meta.disclosure.title": string;
  "meta.disclosure.description": string;
  "meta.privacy.title": string;
  "meta.privacy.description": string;
  "meta.categories.title": string;
  "meta.categories.description": string;

  "landing.badge": string;
  "landing.hero.title": string;
  "landing.hero.subtitle": string;
  "landing.cta.primary": string;
  "landing.cta.secondary": string;
  "landing.stats.posts.label": string;
  "landing.stats.posts.value": string;
  "landing.stats.focus.label": string;
  "landing.stats.focus.value": string;
  "landing.stats.updated.label": string;
  "landing.latest.label": string;
  "landing.latest.heading": string;
  "landing.latest.searchLink": string;

  "categories.badge": string;
  "categories.heading": string;
  "categories.intro": string;
  "categories.postCount": string;

  "about.heading": string;
  "about.intro": string;
  "about.paragraph1": string;
  "about.paragraph2": string;
  "about.criteria.title": string;
  "about.criteria.item1": string;
  "about.criteria.item2": string;
  "about.criteria.item3": string;
  "about.criteria.item4": string;

  "courses.heading": string;
  "courses.intro": string;
  "courses.ctaLabel": string;
  "courses.item1.title": string;
  "courses.item1.description": string;
  "courses.item2.title": string;
  "courses.item2.description": string;
  "courses.item3.title": string;
  "courses.item3.description": string;

  "contact.heading": string;
  "contact.intro": string;

  "disclosure.heading": string;
  "disclosure.intro": string;
  "disclosure.section1.title": string;
  "disclosure.section1.body": string;
  "disclosure.section2.title": string;
  "disclosure.section2.item1": string;
  "disclosure.section2.item2": string;
  "disclosure.section2.item3": string;
  "disclosure.section3.title": string;
  "disclosure.section3.item1": string;
  "disclosure.section3.item2": string;
  "disclosure.section3.item3": string;
  "disclosure.section4.title": string;
  "disclosure.section4.body": string;
  "disclosure.section5.title": string;
  "disclosure.section5.body": string;

  "privacy.heading": string;
  "privacy.updatedLabel": string;
  "privacy.intro": string;
  "privacy.section1.title": string;
  "privacy.section1.item1": string;
  "privacy.section1.item2": string;
  "privacy.section1.item3": string;
  "privacy.section2.title": string;
  "privacy.section2.item1": string;
  "privacy.section2.item2": string;
  "privacy.section2.item3": string;
  "privacy.section3.title": string;
  "privacy.section3.body": string;
  "privacy.section4.title": string;
  "privacy.section4.body": string;
};

export type TranslationKey = keyof TranslationObject;
