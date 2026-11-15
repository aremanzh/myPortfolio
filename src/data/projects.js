import { image } from "./images";

/*
 * Projects are one JSON file each in src/content/projects/, edited through
 * the CMS at /admin. The file name is the URL slug: ringmaster.json is served
 * at /works/ringmaster, and renaming a title never changes the URL.
 *
 * scripts/content.mjs validates every file before a build, so a bad edit
 * fails the build instead of reaching the live site. The defaults below are a
 * second line of defence, not the validation.
 */
const files = require.context("../content/projects", false, /\.json$/);

const paragraphs = (text = "") =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

export const projects = files
  .keys()
  .map((key) => {
    const data = files(key);
    const cover = image(data.cover, data.coverAlt);
    return {
      slug: key.replace(/^\.\//, "").replace(/\.json$/, ""),
      title: data.title,
      order: Number(data.order) || 0,
      published: data.published !== false,
      featured: Boolean(data.featured),
      type: data.type || "",
      year: data.year || "",
      role: data.role || "",
      summary: data.summary || "",
      body: paragraphs(data.body),
      highlights: data.highlights || [],
      stack: data.stack || [],
      links: data.links || [],
      cover: cover && { ...cover, caption: data.coverCaption || "" },
      // Word set in pods when there is no cover image.
      mark: (data.mark || data.title).toUpperCase(),
      tone: data.tone || "ink",
    };
  })
  .filter((project) => project.published)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

// Home page shows up to four featured projects; with none flagged, the first four.
const flagged = projects.filter((project) => project.featured);
export const featured = (flagged.length ? flagged : projects).slice(0, 4);

export function findProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: projects[index],
    index,
    next: projects[(index + 1) % projects.length],
  };
}
