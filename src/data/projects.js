import { image } from "./images";
import { useLocale } from "../i18n";
import { overlay } from "../i18n/overlay";

/*
 * Projects are one JSON file each in src/content/projects/, edited through
 * the CMS at /admin. The file name is the URL slug: ringmaster.json is served
 * at /works/ringmaster (and /ms/works/ringmaster), and renaming a title never
 * changes the URL.
 *
 * A Malay translation is a file with the same name in
 * src/content/ms/projects/, holding only the fields that change.
 *
 * scripts/content.mjs validates every file before a build, so a bad edit
 * fails the build instead of reaching the live site. The defaults below are a
 * second line of defence, not the validation.
 */
const files = import.meta.glob("../content/projects/*.json", { eager: true, import: "default" });
const translations = import.meta.glob("../content/ms/projects/*.json", { eager: true, import: "default" });

const paragraphs = (text = "") =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

function build(locale) {
  const all = Object.entries(files)
    .map(([path, source]) => {
      const slug = path.split("/").pop().replace(/\.json$/, "");
      const data = locale === "ms" ? overlay(source, translations[`../content/ms/projects/${slug}.json`]) : source;
      const cover = image(data.cover, data.coverAlt);
      return {
        slug,
        title: data.title,
        order: Number(data.order) || 0,
        published: data.published !== false,
        featured: Boolean(data.featured),
        archived: Boolean(data.archived),
        type: data.type || "",
        year: data.year || "",
        role: data.role || "",
        summary: data.summary || "",
        body: paragraphs(data.body),
        highlights: data.highlights || [],
        stack: data.stack || [],
        links: data.links || [],
        cover: cover && { ...cover, caption: data.coverCaption || "" },
        // The original upload, for link previews (og:image wants JPEG or PNG).
        coverSrc: data.cover || "",
        // More screens, shown under the case study.
        gallery: (data.gallery || [])
          .map((item) => {
            const picture = image(item.image, item.alt);
            return picture && { ...picture, caption: item.caption || "" };
          })
          .filter(Boolean),
        // Word set in pods when there is no cover image. Same in both languages.
        mark: (source.mark || source.title).toUpperCase(),
        tone: data.tone || "ink",
      };
    })
    .filter((project) => project.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  // Case studies: the work the site is judged on, each with its own page.
  const projects = all.filter((project) => !project.archived);

  // Older or smaller work: one line each at the bottom of /works, no page.
  // A short, strong list of case studies reads better than a long, uneven one.
  const archive = all.filter((project) => project.archived);

  // Home page shows up to four featured projects; with none flagged, the first four.
  const flagged = projects.filter((project) => project.featured);
  const featured = (flagged.length ? flagged : projects).slice(0, 4);

  function findProject(slug) {
    const index = projects.findIndex((p) => p.slug === slug);
    if (index === -1) return null;
    return {
      project: projects[index],
      index,
      next: projects[(index + 1) % projects.length],
    };
  }

  return { projects, archive, featured, findProject };
}

const byLocale = { en: build("en"), ms: build("ms") };

export const projectsFor = (locale) => byLocale[locale] || byLocale.en;

/** Projects in the current page's language. */
export const useProjects = () => projectsFor(useLocale());

// English, for code that runs outside a page (build config, scripts).
export const { projects, archive, featured, findProject } = byLocale.en;
