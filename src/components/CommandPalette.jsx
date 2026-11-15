import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { lockScroll, scrollToTarget } from "../lib/scroll";
import { reducedMotion } from "../lib/env";
import { site } from "../data/site";
import { projects } from "../data/projects";
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
  const { go } = usePageTransition();
  const { pathname } = useLocation();

  const commands = useMemo(() => {
    const nav = [
      { label: "Home", to: "/" },
      { label: "Work", to: "/works" },
      { label: "About", to: "/#about" },
      { label: "Contact", to: "/contact" },
    ].map((item) => ({
      id: `go:${item.to}`,
      group: "Go to",
      label: item.label,
      run: () => go(item.to, item.label),
    }));

    const work = projects.map((project) => ({
      id: `project:${project.slug}`,
      group: "Project",
      label: project.title,
      keywords: `${project.type} ${project.stack.join(" ")}`,
      run: () => go(`/works/${project.slug}`, project.title),
    }));

    const actions = [
      pathname === "/" &&
        !reducedMotion && {
          id: "chaos",
          group: "Action",
          label: "Run chaos test",
          keywords: "kill pods cluster break",
          run: () => {
            scrollToTarget(0);
            window.dispatchEvent(new Event(RUN_CHAOS));
          },
        },
      {
        id: "copy-email",
        group: "Action",
        label: "Copy email address",
        keywords: site.email,
        run: () => navigator.clipboard && navigator.clipboard.writeText(site.email).catch(() => {}),
      },
      {
        id: "top",
        group: "Action",
        label: "Back to top",
        run: () => scrollToTarget(0),
      },
      ...site.socials.map((social) => ({
        id: `open:${social.label}`,
        group: "Open",
        label: social.label,
        run: () => window.open(social.href, "_blank", "noopener,noreferrer"),
      })),
    ].filter(Boolean);

    return [...nav, ...work, ...actions];
  }, [go, pathname]);

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
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <label className="palette__input t-mono">
          <span aria-hidden="true" className="accent">
            $
          </span>
          <span className="sr-only">Search pages, projects and actions</span>
          <input
            ref={input}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Where to? Try “ringmaster” or “chaos”"
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
            <li className="palette__empty t-mono">Nothing matches “{query}”.</li>
          )}
        </ul>

        <p className="palette__hint t-mono" aria-hidden="true">
          <span>↑↓ move</span>
          <span>↵ run</span>
          <span>esc close</span>
        </p>
      </div>
    </div>
  );
}
