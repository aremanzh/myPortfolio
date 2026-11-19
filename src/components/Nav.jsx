import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { gsap, useGSAP } from "../lib/gsap";
import { finePointer, normalizePath, reducedMotion, useHydrated } from "../lib/env";
import { lockScroll } from "../lib/scroll";
import { snapMark } from "../lib/snap";
import { toggleSound, useSoundState } from "../lib/sound";
import { useContent } from "../data/site";
import { LOCALE_SHORT, stripLocale, useLocale, useT } from "../i18n";
import { TLink } from "./Transition";
import { OPEN_PALETTE } from "./CommandPalette";
import Mark from "./Mark";

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

const LINKS = [
  { to: "/works", key: "nav.work" },
  { to: "/#about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

/** Same page in the other language. */
function LanguageSwitch({ className = "", tabIndex }) {
  const t = useT();
  const locale = useLocale();
  const { pathname, hash } = useLocation();
  const other = locale === "ms" ? "en" : "ms";

  return (
    <TLink
      to={`${stripLocale(normalizePath(pathname))}${hash}`}
      locale={other}
      name={LOCALE_SHORT[other]}
      className={className}
      lang={other}
      aria-label={t("lang.switchTo")}
      tabIndex={tabIndex}
    >
      <span aria-hidden="true">
        <span className={locale === "en" ? "nav__lang-on" : "nav__lang-off"}>EN</span>
        <span className="nav__lang-sep">/</span>
        <span className={locale === "ms" ? "nav__lang-on" : "nav__lang-off"}>BM</span>
      </span>
    </TLink>
  );
}

function SoundToggle({ className = "", tabIndex }) {
  const t = useT();
  // "waiting": on, but the browser has not let anything play yet this visit.
  // Pressing it then starts sound instead of turning it off.
  const state = useSoundState();
  const on = state !== "off";
  const label = { off: t("sound.turnOn"), on: t("sound.turnOff"), waiting: t("sound.start") }[state];
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={label}
      title={state === "waiting" ? label : undefined}
      onClick={toggleSound}
      tabIndex={tabIndex}
    >
      <span className={`nav__sound ${state === "on" ? "is-on" : ""} ${state === "waiting" ? "is-waiting" : ""}`} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="nav__sound-label">{on ? t("sound.on") : t("sound.off")}</span>
    </button>
  );
}

export default function Nav() {
  const t = useT();
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const [hidden, setHidden] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  const mark = useRef(null);
  const snapping = useRef(null);
  const pathname = stripLocale(normalizePath(useLocation().pathname));

  // Any navigation closes the menu and brings the bar back.
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  // Hide on the way down, show on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      const el = menu.current;
      const duration = reducedMotion ? 0 : 0.8;

      if (open) {
        gsap.set(el, { visibility: "visible" });
        gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration, ease: "power4.inOut" });
        if (!reducedMotion) {
          gsap.from(".menu__in", {
            yPercent: 110,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.07,
            delay: 0.3,
          });
        }
      } else {
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: duration * 0.75,
          ease: "power4.inOut",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open], scope: menu }
  );

  // Pointing at the brand pulls the two halves of the mark apart and snaps
  // them back. One at a time, so sweeping across it doesn't stutter.
  const snapBrand = () => {
    if (!finePointer || (snapping.current && snapping.current.isActive())) return;
    snapping.current = snapMark(mark.current, { gap: 40, duration: 0.36 });
  };

  const isCurrent = (to) => to === pathname || (to !== "/" && pathname.startsWith(to));

  return (
    <>
      <header className={`nav ${hidden && !open ? "is-hidden" : ""}`}>
        <TLink
          to="/"
          name={t("nav.home")}
          className="nav__brand"
          aria-label={t("nav.homeLabel", { name: site.name })}
          onMouseEnter={snapBrand}
        >
          <Mark ref={mark} className="nav__mark" />
          <span>{site.shortName}.</span>
        </TLink>

        <nav aria-label={t("nav.primary")} className="hidden md:block">
          <ul className="t-mono flex items-center gap-9">
            {LINKS.map((link) => (
              <li key={link.to}>
                <TLink
                  to={link.to}
                  name={t(link.key)}
                  className={`link ${isCurrent(link.to) ? "link--on" : ""}`}
                  aria-current={isCurrent(link.to) ? "page" : undefined}
                >
                  {t(link.key)}
                </TLink>
              </li>
            ))}
            <li>
              <LanguageSwitch className="nav__lang" />
            </li>
            <li>
              <SoundToggle className="nav__toggle" />
            </li>
            <li>
              <button
                type="button"
                className="nav__kbd"
                aria-label={t("nav.palette")}
                onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
              >
                {hydrated && isMac() ? "⌘K" : "Ctrl K"}
              </button>
            </li>
          </ul>
        </nav>

        <div className="t-mono flex items-center gap-5 md:hidden">
          <LanguageSwitch className="nav__lang" />
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </header>

      <div ref={menu} id="menu" className="menu theme-paper md:hidden" aria-hidden={!open} data-lenis-prevent>
        <nav aria-label={t("nav.mobile")}>
          <ul className="grid gap-1">
            {[{ to: "/", key: "nav.home" }, ...LINKS].map((link) => (
              <li key={link.to} className="line">
                <TLink
                  to={link.to}
                  name={t(link.key)}
                  className="menu__in t-display block"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {t(link.key)}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="t-mono mt-10 grid gap-6">
          <SoundToggle className="nav__toggle justify-self-start" tabIndex={open ? 0 : -1} />
          <a href={`mailto:${site.email}`} className="break-all" tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
