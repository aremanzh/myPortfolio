import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { lockScroll } from "../lib/scroll";
import { site } from "../data/site";
import { TLink } from "./Transition";
import { OPEN_PALETTE } from "./CommandPalette";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const LINKS = [
  { to: "/works", label: "Work" },
  { to: "/#about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  const { pathname } = useLocation();

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

  const isCurrent = (to) => to === pathname || (to !== "/" && pathname.startsWith(to));

  return (
    <>
      <header className={`nav ${hidden && !open ? "is-hidden" : ""}`}>
        <TLink to="/" name="Home" className="nav__brand" aria-label={`${site.name}, home`}>
          {site.shortName}.
        </TLink>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="t-mono flex items-center gap-9">
            {LINKS.map((link) => (
              <li key={link.to}>
                <TLink
                  to={link.to}
                  name={link.label}
                  className={`link ${isCurrent(link.to) ? "link--on" : ""}`}
                  aria-current={isCurrent(link.to) ? "page" : undefined}
                >
                  {link.label}
                </TLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="nav__kbd"
                aria-label="Open command palette"
                onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
              >
                {isMac ? "⌘K" : "Ctrl K"}
              </button>
            </li>
          </ul>
        </nav>

        <button
          ref={toggle}
          type="button"
          className="t-mono md:hidden"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div ref={menu} id="menu" className="menu theme-paper md:hidden" aria-hidden={!open} data-lenis-prevent>
        <nav aria-label="Mobile">
          <ul className="grid gap-1">
            {[{ to: "/", label: "Home" }, ...LINKS].map((link) => (
              <li key={link.to} className="line">
                <TLink
                  to={link.to}
                  name={link.label}
                  className="menu__in t-display block"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="t-mono mt-10 grid gap-6">
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
