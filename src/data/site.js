// Site-wide content. The text itself lives in src/content/*.json, which the
// CMS at /admin edits; Malay overlays live in src/content/ms/. This module
// only hands it to the components, in the page's language.

import siteContent from "../content/site.json";
import aboutContent from "../content/about.json";
import capabilities from "../content/capabilities.json";
import { image } from "./images";
import { useLocale } from "../i18n";
import { overlay } from "../i18n/overlay";

const translations = import.meta.glob("../content/ms/*.json", { eager: true, import: "default" });
const ms = (name) => translations[`../content/ms/${name}.json`];

function build(locale) {
  const localized = (base, name) => (locale === "ms" ? overlay(base, ms(name)) : base);
  const siteData = localized(siteContent, "site");
  const aboutData = localized(aboutContent, "about");
  const capabilityData = localized(capabilities, "capabilities");

  return {
    site: siteData,
    about: {
      statement: aboutData.statement,
      facts: aboutData.facts || [],
      portrait: image(aboutData.portrait, aboutData.portraitAlt),
    },
    // The three stages mirror the hero line: build it, ship it, keep it up.
    // Ids come from the English names so they stay the same in both languages.
    pipeline: (capabilityData.stages || []).map((stage, i) => ({
      ...stage,
      id: (capabilities.stages[i] || stage).name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tools: stage.tools || [],
      log: stage.log || [],
    })),
    marquee: capabilityData.marquee || [],
  };
}

const byLocale = { en: build("en"), ms: build("ms") };

export const contentFor = (locale) => byLocale[locale] || byLocale.en;

/** Site content in the current page's language. */
export const useContent = () => contentFor(useLocale());

// English, for code that runs outside a page (document head defaults, scripts).
export const { site, about, pipeline, marquee } = byLocale.en;
