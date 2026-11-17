import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { initScroll } from "./lib/scroll";
import { normalizePath } from "./lib/env";
import { stripLocale, useT } from "./i18n";
import { TransitionProvider } from "./components/Transition";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import CommandPalette from "./components/CommandPalette";
import SoundEffects from "./components/SoundEffects";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

/**
 * Page shell: everything that persists across routes. `children` lets the
 * router's error boundary reuse the same chrome around the 404 page.
 */
export default function App({ children }) {
  const t = useT();
  const pathname = stripLocale(normalizePath(useLocation().pathname));

  useEffect(() => initScroll(), []);

  return (
    <TransitionProvider>
      <a href="#main" className="skip-link t-mono">
        {t("skip")}
      </a>
      <Preloader />
      <Cursor />
      <SoundEffects />
      <Nav />
      <CommandPalette />
      {/* tabIndex lets the skip link move focus here, not just the scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {children || <Outlet />}
      </main>
      {/* The contact page already is the call to action. */}
      <Footer cta={pathname !== "/contact"} />
    </TransitionProvider>
  );
}
