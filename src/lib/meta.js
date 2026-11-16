import { site } from "../data/site";

/*
 * Per-page <head> tags, used by each route's `meta` export. React Router does
 * not merge meta between parent and child routes, so every page returns the
 * full set from here. Titles match useDocumentTitle, which keeps the preview
 * build (no framework <Meta/>) in step.
 */
export const pageTitle = (title) => (title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`);

const DEFAULT_DESCRIPTION = `${site.name} is a full-stack Laravel developer and DevOps engineer in ${site.location}. He builds the product, ships the pipeline and runs the cluster it lives on.`;

const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${site.url}${path}`);

export function pageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og.jpg",
  imageAlt = `${site.name}, ${site.role}.`,
  noindex = false,
} = {}) {
  const fullTitle = pageTitle(title);
  const url = absolute(path);
  const img = absolute(image);
  return [
    { title: fullTitle },
    { name: "description", content: description },
    noindex && { name: "robots", content: "noindex" },
    !noindex && { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: site.name },
    { property: "og:url", content: url },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: img },
    { property: "og:image:alt", content: imageAlt },
    image === "/og.jpg" && { property: "og:image:width", content: "1200" },
    image === "/og.jpg" && { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ].filter(Boolean);
}
