/*
 * Translations are written as overlays: a file in src/content/ms holds only
 * the fields that change, and it is laid over the English file.
 *
 *   objects        merged key by key
 *   object lists   merged item by item (gallery[2].caption, stages[0].summary)
 *   other values   replaced
 *
 * So a translated project can leave out its stack, links and images and still
 * get them from the English file.
 */
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export function overlay(base, extra) {
  if (extra === undefined || extra === null) return base;

  if (Array.isArray(base) && Array.isArray(extra)) {
    if (base.length && base.every(isObject)) {
      const merged = base.map((item, i) => (i < extra.length ? overlay(item, extra[i]) : item));
      return merged.concat(extra.slice(base.length));
    }
    return extra;
  }

  if (isObject(base) && isObject(extra)) {
    const out = { ...base };
    Object.keys(extra).forEach((key) => {
      out[key] = overlay(base[key], extra[key]);
    });
    return out;
  }

  return extra;
}
