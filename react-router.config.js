import { readdirSync, readFileSync } from "node:fs";

/*
 * Static site: no server at runtime. Every page listed here is rendered to its
 * own HTML file at build time, so crawlers and link previews get real content
 * and per-page meta tags. Any other path gets the SPA fallback page.
 */
const projectDir = new URL("./src/content/projects/", import.meta.url);

function caseStudyPaths() {
  return readdirSync(projectDir)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => {
      const data = JSON.parse(readFileSync(new URL(file, projectDir), "utf8"));
      return data.published !== false && !data.archived;
    })
    .map((file) => `/works/${file.replace(/\.json$/, "")}`);
}

/** @type {import("@react-router/dev/config").Config} */
export default {
  appDirectory: "src",
  ssr: false,
  // Every page twice: English at the root, Malay under /ms.
  prerender: () => {
    const english = ["/", "/works", "/contact", ...caseStudyPaths()];
    const malay = english.map((path) => (path === "/" ? "/ms" : `/ms${path}`));
    return [...english, ...malay];
  },
};
