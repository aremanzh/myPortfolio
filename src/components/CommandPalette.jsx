import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { lockScroll, scrollToTarget } from "../lib/scroll";
import { normalizePath, reducedMotion, setReducedMotion } from "../lib/env";
import { useContent } from "../data/site";
import { useProjects } from "../data/projects";
import { stripLocale, useLocale, useT } from "../i18n";
import { toggleSound, useSoundState } from "../lib/sound";
import { usePageTransition } from "./Transition";

export const OPEN_PALETTE = "palette:open";
export const RUN_CHAOS = "pods:chaos";

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Keyboard launcher: Cmd/Ctrl+K or "/" opens it, type to filter, arrows and
 * Enter to run. Everything in it is reachable elsewhere on the site; this is
 * the fast path.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const list = useRef(null);
  const returnFocus = useRef(null);
  const t = useT();
  const locale = useLocale();
  const sound = useSoundState();
  const { site } = useContent();
  const { projects } = useProjects();
  const { go } = usePageTransition();
  const { pathname: rawPath, hash } = useLocation();
  const pathname = stripLocale(normalizePath(rawPath));

  const commands = useMemo(() => {
    const nav = [
      { label: t("nav.home"), to: "/" },
      { label: t("nav.work"), to: "/works" },
      { label: t("nav.about"), to: "/#about" },
      { label: t("nav.contact"), to: "/contact" },
    ].map((item) => ({
      id: `go:${item.to}`,
      group: t("palette.goTo"),
      label: item.label,
      run: () => go(item.to, item.label),
    }));

    const work = projects.map((project) => ({
      id: `project:${project.slug}`,
      group: t("palette.project"),
      label: project.title,
      keywords: `${project.type} ${project.stack.join(" ")}`,
      run: () => go(`/works/${project.slug}`, project.title),
    }));

    const actions = [
      pathname === "/" && {
          id: "chaos",
          group: t("palette.action"),
          label: t("hero.chaos"),
          keywords: "kill pods cluster break",
          run: () => {
            scrollToTarget(0);
            window.dispatchEvent(new Event(RUN_CHAOS));
          },
        },
      {
        id: "language",
        group: t("palette.action"),
        label: t("palette.language"),
        keywords: "english malay bahasa melayu bm en language",
        run: () => go(`${pathname}${hash}`, locale === "ms" ? "EN" : "BM", { locale: locale === "ms" ? "en" : "ms" }),
      },
      {
        id: "sound",
        group: t("palette.action"),
        label: { off: t("sound.turnOn"), on: t("sound.turnOff"), waiting: t("sound.start") }[sound],
        keywords: "sound audio bunyi mute",
        run: toggleSound,
      },
      {
        id: "motion",
        group: t("palette.action"),
        label: reducedMotion ? t("motion.restore") : t("motion.reduce"),
        keywords: "motion animation reduce gerakan animasi kurang",
        run: () => setReducedMotion(!reducedMotion),
      },
      {
        id: "copy-email",
        group: t("palette.action"),
        label: t("palette.copyEmail"),
        keywords: site.email,
        run: () => navigator.clipboard && navigator.clipboard.writeText(site.email).catch(() => {}),
      },
      {
        id: "top",
        group: t("palette.action"),
        label: t("palette.top"),
        run: () => scrollToTarget(0),
      },
      ...site.socials.map((social) => ({
        id: `open:${social.label}`,
        group: t("palette.open"),
        label: social.label,
        run: () => window.open(social.href, "_blank", "noopener,noreferrer"),
      })),
    ].filter(Boolean);

    return [...nav, ...work, ...actions];
  }, [go, pathname, hash, locale, sound, site, projects, t]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    const score = (command) => {
      const label = command.label.toLowerCase();
      if (label.startsWith(q)) return 0;
      if (label.includes(q)) return 1;
      if (`${command.group} ${command.keywords || ""}`.toLowerCase().includes(q)) return 2;
      return -1;
    };
    return commands
      .map((command) => ({ command, rank: score(command) }))
      .filter((entry) => entry.rank >= 0)
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => entry.command);
  }, [commands, query]);

  // Global shortcuts.
  useEffect(() => {
    const onKey = (event) => {
      const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !isTyping(event.target);
      if (combo || slash) {
        event.preventDefault();
        setOpen((value) => (combo ? !value : true));
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  // Focus management and scroll lock.
  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;
    setQuery("");
    setActive(0);
    lockScroll(true);
    input.current.focus();
    return () => {
      lockScroll(false);
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus();
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open || !list.current) return;
    const row = list.current.children[active];
    if (row) row.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  const run = (command) => {
    setOpen(false);
    // Let the close (and focus restore) settle before navigating.
    requestAnimationFrame(() => command.run());
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      run(results[active]);
    } else if (event.key === "Tab") {
      // The dialog has one focusable control; keep focus on it.
      event.preventDefault();
    }
  };

  return (
    <div className="palette" onMouseDown={() => setOpen(false)}>
      <div
        className="palette__panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("palette.label")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <label className="palette__input t-mono">
          <span aria-hidden="true" className="accent">
            $
          </span>
          <span className="sr-only">{t("palette.search")}</span>
          <input
            ref={input}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("palette.placeholder")}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
        </label>

        <ul ref={list} id="palette-list" role="listbox" className="palette__list" data-lenis-prevent>
          {results.map((command, i) => (
            <li
              key={command.id}
              id={`palette-${command.id}`}
              role="option"
              aria-selected={i === active}
              className={`palette__item ${i === active ? "is-active" : ""}`}
              onMouseMove={() => setActive(i)}
              onClick={() => run(command)}
            >
              <span>{command.label}</span>
              <span className="t-mono palette__group">{command.group}</span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="palette__empty t-mono">{t("palette.empty", { q: query })}</li>
          )}
        </ul>

        <p className="palette__hint t-mono" aria-hidden="true">
          <span>{t("palette.move")}</span>
          <span>{t("palette.run")}</span>
          <span>{t("palette.close")}</span>
        </p>
      </div>
    </div>
  );
}
