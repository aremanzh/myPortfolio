import { contentFor, site } from "../data/site";
import { DEFAULT_LOCALE, LOCALES, localize, translate } from "../i18n";

/*
 * Per-page <head> tags, used by each route's `meta` export. React Router does
 * not merge meta between parent and child routes, so every page returns the
 * full set from here. Titles match useDocumentTitle, which keeps the preview
 * build (no framework <Meta/>) in step.
 *
 * Every page exists in English and Malay; each version names the other with
 * hreflang so search engines show the right one.
 */
export function pageTitle(title, locale = DEFAULT_LOCALE) {
  const local = contentFor(locale).site;
  return title ? `${title} · ${local.name}` : `${local.name} · ${local.role}`;
}

const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${site.url}${path}`);

const OG_LOCALE = { en: "en_MY", ms: "ms_MY" };

export function pageMeta({
  title,
  description,
  path = "/",
  image = "/og.jpg",
  imageAlt,
  noindex = false,
  locale = DEFAULT_LOCALE,
} = {}) {
  const local = contentFor(locale).site;
  const fullTitle = pageTitle(title, locale);
  const text =
    description || translate(locale, "meta.description", { name: local.name, location: local.location });
  const url = absolute(localize(path, locale));
  const img = absolute(image);

  const alternates = noindex
    ? []
    : [
        ...LOCALES.map((code) => ({
          tagName: "link",
          rel: "alternate",
          hrefLang: code,
          href: absolute(localize(path, code)),
        })),
        { tagName: "link", rel: "alternate", hrefLang: "x-default", href: absolute(localize(path, DEFAULT_LOCALE)) },
      ];

  return [
    { title: fullTitle },
    { name: "description", content: text },
    noindex && { name: "robots", content: "noindex" },
    !noindex && { tagName: "link", rel: "canonical", href: url },
    ...alternates,
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: local.name },
    { property: "og:locale", content: OG_LOCALE[locale] },
    { property: "og:url", content: url },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: text },
    { property: "og:image", content: img },
    { property: "og:image:alt", content: imageAlt || `${local.name}, ${local.role}.` },
    image === "/og.jpg" && { property: "og:image:width", content: "1200" },
    image === "/og.jpg" && { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: text },
    { name: "twitter:image", content: img },
  ].filter(Boolean);
}
