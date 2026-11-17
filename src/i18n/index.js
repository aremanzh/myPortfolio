import { useCallback } from "react";
import { useLocation } from "react-router";
import { ui } from "./ui";

/*
 * Two languages: English at the root, Malay under /ms. The language is read
 * from the URL, so every prerendered page is in one language from the first
 * byte and can be linked and indexed on its own.
 *
 *   /works/ringmaster      English
 *   /ms/works/ringmaster   Malay
 *
 * Links inside the app are written without the prefix (`/works`); TLink and
 * the page transition add it for the current language.
 */
export const LOCALES = ["en", "ms"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_NAMES = { en: "English", ms: "Bahasa Melayu" };
export const LOCALE_SHORT = { en: "EN", ms: "BM" };
export const HTML_LANG = { en: "en", ms: "ms" };

const PREFIX = /^\/ms(?=\/|#|$)/;

export const localeOf = (pathname = "/") => (PREFIX.test(pathname) ? "ms" : "en");

/** "/ms/works" -> "/works", "/ms" -> "/", "/ms#about" -> "/#about". */
export function stripLocale(path = "/") {
  const bare = path.replace(PREFIX, "");
  if (!bare) return "/";
  return bare.startsWith("#") ? `/${bare}` : bare;
}

/** An app path in the given language. External links and hashes pass through. */
export function localize(to, locale) {
  if (typeof to !== "string" || !to.startsWith("/")) return to;
  const bare = stripLocale(to);
  if (locale === DEFAULT_LOCALE) return bare;
  if (bare === "/") return "/ms";
  if (bare.startsWith("/#")) return `/ms${bare.slice(1)}`;
  return `/ms${bare}`;
}

export function useLocale() {
  return localeOf(useLocation().pathname);
}

/** Fill "{name}" placeholders. */
const fill = (text, vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match)) : text;

/** A UI string in a given language, falling back to English. */
export function translate(locale, key, vars) {
  const text = (ui[locale] && ui[locale][key]) ?? ui.en[key];
  if (text === undefined) {
    if (import.meta.env.DEV) console.warn(`i18n: missing key "${key}"`);
    return key;
  }
  return fill(text, vars);
}

/** `t("key", { vars })` for the current page's language. */
export function useT() {
  const locale = useLocale();
  return useCallback((key, vars) => translate(locale, key, vars), [locale]);
}
