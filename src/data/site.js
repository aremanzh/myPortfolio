// Site-wide content. The text itself lives in src/content/*.json, which the
// CMS at /admin edits. This module only hands it to the components.

import siteContent from "../content/site.json";
import aboutContent from "../content/about.json";
import capabilities from "../content/capabilities.json";
import { image } from "./images";

export const site = siteContent;

export const about = {
  statement: aboutContent.statement,
  facts: aboutContent.facts || [],
  portrait: image(aboutContent.portrait, aboutContent.portraitAlt),
};

// The three stages mirror the hero line: build it, ship it, keep it up.
export const pipeline = (capabilities.stages || []).map((stage) => ({
  ...stage,
  id: stage.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  tools: stage.tools || [],
  log: stage.log || [],
}));

export const marquee = capabilities.marquee || [];
