#!/usr/bin/env node
/*
 * Content pipeline. Runs before `npm start` and `npm run build`.
 *
 *   1. Validates src/content (what the CMS writes). Any problem stops the
 *      build with a list of what to fix, so a bad edit never ships.
 *   2. Resizes every image in public/uploads to 800px and 1600px WebP and
 *      writes src/content/_images.json for the app to look them up.
 *   3. Writes public/sitemap.xml from the published projects.
 *
 * `--check` runs step 1 only (for CI or a pre-commit hook).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "src/content");
const uploadsDir = join(root, "public/uploads");
const derivedDir = join(uploadsDir, "_r");
const checkOnly = process.argv.includes("--check");

const TONES = ["signal", "paper", "ink"];
const WIDTHS = { sm: 800, lg: 1600 };
const RASTER = /\.(png|jpe?g|webp|avif)$/i;

/* ------------------------------------------------------------------ read */

const errors = [];
const fail = (file, message) => errors.push(`  ${file}: ${message}`);

function readJson(relative) {
  const path = join(contentDir, relative);
  if (!existsSync(path)) {
    fail(relative, "file is missing");
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(relative, `not valid JSON (${error.message})`);
    return null;
  }
}

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isUrl = (value) => {
  try {
    return ["https:", "http:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

function requireText(file, data, keys) {
  keys.forEach((key) => {
    if (!isText(data[key])) fail(file, `"${key}" is required`);
  });
}

function checkImage(file, key, path, alt) {
  if (!path) return;
  if (!path.startsWith("/uploads/")) {
    fail(file, `"${key}" must be a file in the media folder (got ${path})`);
    return;
  }
  if (!existsSync(join(root, "public", path))) fail(file, `"${key}" points to ${path}, which does not exist`);
  if (!isText(alt)) fail(file, `"${key}" needs alt text describing the image`);
}

function checkLinks(file, key, links = []) {
  links.forEach((link, i) => {
    if (!isText(link.label)) fail(file, `${key}[${i}] needs a label`);
    if (!isUrl(link.href)) fail(file, `${key}[${i}] has an invalid URL (${link.href})`);
  });
}

/* -------------------------------------------------------------- validate */

const site = readJson("site.json");
if (site) {
  requireText("site.json", site, ["name", "shortName", "role", "location", "timeZone", "url", "email"]);
  if (isText(site.url) && !isUrl(site.url)) fail("site.json", `"url" is not a valid URL`);
  if (isText(site.formEndpoint) && !isUrl(site.formEndpoint)) fail("site.json", `"formEndpoint" is not a valid URL`);
  if (isText(site.timeZone)) {
    try {
      new Intl.DateTimeFormat("en", { timeZone: site.timeZone });
    } catch {
      fail("site.json", `"timeZone" is not an IANA time zone (${site.timeZone})`);
    }
  }
  checkLinks("site.json", "socials", (site.socials || []).map((s) => ({ label: s.label, href: s.href })));
}

const about = readJson("about.json");
if (about) {
  requireText("about.json", about, ["statement"]);
  checkImage("about.json", "portrait", about.portrait, about.portraitAlt);
  (about.facts || []).forEach((fact, i) => {
    if (!isText(fact.label) || !isText(fact.value)) fail("about.json", `facts[${i}] needs a label and a value`);
  });
}

const capabilities = readJson("capabilities.json");
if (capabilities) {
  if (!Array.isArray(capabilities.stages) || capabilities.stages.length === 0) {
    fail("capabilities.json", "at least one stage is required");
  }
  (capabilities.stages || []).forEach((stage, i) => {
    if (!isText(stage.name) || !isText(stage.summary)) fail("capabilities.json", `stages[${i}] needs a name and a summary`);
  });
}

const projectsDir = join(contentDir, "projects");
const projectFiles = existsSync(projectsDir) ? readdirSync(projectsDir).filter((f) => f.endsWith(".json")) : [];
if (projectFiles.length === 0) fail("projects/", "no projects found");

const projects = projectFiles
  .map((name) => {
    const file = `projects/${name}`;
    const slug = basename(name, ".json");
    const data = readJson(file);
    if (!data) return null;

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      fail(file, "file name becomes the URL, so use lowercase letters, digits and hyphens only");
    }
    requireText(file, data, ["title", "type", "summary", "body"]);
    if (data.tone && !TONES.includes(data.tone)) fail(file, `"tone" must be one of ${TONES.join(", ")}`);
    if (data.mark && !/^[A-Za-z0-9]{1,6}$/.test(data.mark)) {
      fail(file, `"mark" is drawn in pods, so keep it to 1-6 letters or digits (got "${data.mark}")`);
    }
    if (!data.cover && !data.mark) fail(file, `needs either a cover image or a "mark" for the generated cover`);
    if (data.order !== undefined && !Number.isFinite(Number(data.order))) fail(file, `"order" must be a number`);
    checkImage(file, "cover", data.cover, data.coverAlt);
    checkLinks(file, "links", data.links);
    (data.highlights || []).forEach((item, i) => {
      if (!isText(item.title) || !isText(item.text)) fail(file, `highlights[${i}] needs a title and text`);
    });
    return { slug, published: data.published !== false, order: Number(data.order) || 0 };
  })
  .filter(Boolean);

if (projects.length && !projects.some((p) => p.published)) fail("projects/", "every project is unpublished");

if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n${errors.join("\n")}\n`);
  process.exit(1);
}
console.log(`content: ${projects.length} projects, ${projects.filter((p) => p.published).length} published, all valid`);
if (checkOnly) process.exit(0);

/* ---------------------------------------------------------------- images */

const { default: sharp } = await import("sharp");
mkdirSync(derivedDir, { recursive: true });

const manifest = {};
let resized = 0;
const sources = existsSync(uploadsDir)
  ? readdirSync(uploadsDir).filter((name) => RASTER.test(name) && statSync(join(uploadsDir, name)).isFile())
  : [];

for (const name of sources) {
  const source = join(uploadsDir, name);
  // Uploaded names can hold spaces or capitals, which break srcset. Variants
  // get a URL-safe name; the short hash keeps "a b.png" and "a-b.png" apart.
  const safe = basename(name, extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  const stem = `${safe}-${createHash("sha1").update(name).digest("hex").slice(0, 6)}`;
  const meta = await sharp(source).rotate().metadata();
  // EXIF-rotated photos report swapped dimensions.
  const [srcW, srcH] = meta.orientation >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const entry = {};

  for (const [key, target] of Object.entries(WIDTHS)) {
    const width = Math.min(target, srcW);
    const out = join(derivedDir, `${stem}-${target}.webp`);
    // Rebuild only when the source is newer than the variant.
    if (!existsSync(out) || statSync(out).mtimeMs < statSync(source).mtimeMs) {
      await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out);
      resized += 1;
    }
    entry[key] = `/uploads/_r/${stem}-${target}.webp`;
    entry[`${key}Width`] = width;
    entry[`${key}Height`] = Math.round((srcH / srcW) * width);
  }
  manifest[`/uploads/${name}`] = entry;
}

writeFileSync(join(contentDir, "_images.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`images: ${sources.length} sources, ${resized} variants written`);

/* --------------------------------------------------------------- sitemap */

const base = site.url.replace(/\/$/, "");
const paths = [
  "/",
  "/works",
  "/contact",
  ...projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order)
    .map((p) => `/works/${p.slug}`),
];
writeFileSync(
  join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((path) => `  <url><loc>${base}${path}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
console.log(`sitemap: ${paths.length} urls`);
