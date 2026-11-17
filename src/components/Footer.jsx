import React, { useState } from "react";
import { useLocalTime } from "../lib/hooks";
import { scrollToTarget } from "../lib/scroll";
import { reducedMotion, setReducedMotion, useHydrated } from "../lib/env";
import { useContent } from "../data/site";
import { useT } from "../i18n";
import { TLink } from "./Transition";
import { SplitReveal } from "./Reveal";
import Magnetic from "./Magnetic";
import { ArrowUpRight } from "./Icons";

function LocalTime() {
  const { site } = useContent();
  const time = useLocalTime();
  return (
    <span className="tabular-nums">
      {time} {site.timeZoneLabel}
    </span>
  );
}

function CopyEmail() {
  const t = useT();
  const { site } = useContent();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure origin, permissions): open the mail client.
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <button type="button" onClick={copy} className="text-left" data-cursor={copied ? t("footer.copiedCursor") : t("footer.copyCursor")}>
      <span className="t-mono block text-[color:var(--muted)]" aria-live="polite">
        {copied ? t("footer.copied") : t("footer.copyHint")}
      </span>
      <span className="link mt-2 inline-block break-all text-[clamp(1.15rem,2.4vw,2.2rem)] font-medium tracking-tight">
        {site.email}
      </span>
    </button>
  );
}

/**
 * Motion is on by default; this is where a visitor turns it down (and back
 * up). The page reloads so every effect starts in the chosen mode.
 */
function MotionToggle() {
  const t = useT();
  // The prerendered page cannot know the stored choice: show it after hydration.
  const reduced = useHydrated() && reducedMotion;
  return (
    <button
      type="button"
      className="link uppercase tracking-[inherit]"
      aria-pressed={reduced}
      aria-label={reduced ? t("motion.restore") : t("motion.reduce")}
      onClick={() => setReducedMotion(!reduced)}
    >
      {reduced ? t("motion.reduced") : t("motion.full")}
    </button>
  );
}

function FooterBar() {
  const t = useT();
  const { site } = useContent();
  return (
    <div className="t-mono grid gap-6 border-t border-[color:var(--line)] pt-6 md:grid-cols-[1fr_auto_1fr] md:items-baseline">
      {/* The prerendered year is the build's; the browser may be in a newer one. */}
      <p suppressHydrationWarning>
        © {new Date().getFullYear()} {site.name}
      </p>

      <ul className="flex flex-wrap gap-x-7 gap-y-2">
        {site.socials.map((social) => (
          <li key={social.label}>
            <a href={social.href} target="_blank" rel="noreferrer" className="link">
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 md:justify-self-end">
        <span>
          {site.location} <LocalTime />
        </span>
        <MotionToggle />
        <button
          type="button"
          className="link uppercase tracking-[inherit]"
          onClick={() => scrollToTarget(0)}
        >
          {t("footer.top")}
        </button>
      </div>
    </div>
  );
}

/**
 * `cta={false}` drops the big call to action and keeps the bar, for pages
 * (contact) that already are the call to action.
 */
export default function Footer({ cta = true }) {
  const t = useT();
  if (!cta) {
    return (
      <footer className="theme-ink wrap pb-8">
        <FooterBar />
      </footer>
    );
  }

  return (
    <footer className="theme-paper lip relative z-10">
      <div className="wrap pb-8 pt-[clamp(4.5rem,10vw,10rem)]">
        <p className="t-mono eyebrow">{t("footer.eyebrow")}</p>

        <SplitReveal as="h2" className="t-display mt-8">
          {t("footer.titlePre")}
          <span className="serif accent">{t("footer.titleAccent")}</span>
        </SplitReveal>

        <div className="mb-[clamp(4rem,8vw,8rem)] mt-[clamp(3rem,6vw,6rem)] grid gap-10 md:grid-cols-2 md:items-end">
          <CopyEmail />
          <div className="md:justify-self-end">
            <Magnetic>
              <TLink to="/contact" name={t("nav.contact")} className="btn btn--solid t-mono">
                {t("footer.start")} <ArrowUpRight />
              </TLink>
            </Magnetic>
          </div>
        </div>

        <FooterBar />
      </div>
    </footer>
  );
}
