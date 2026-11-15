import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { initScroll } from "./lib/scroll";
import { TransitionProvider } from "./components/Transition";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

/**
 * Page shell: everything that persists across routes. `children` lets the
 * router's error boundary reuse the same chrome around the 404 page.
 */
export default function App({ children }) {
  const { pathname } = useLocation();

  useEffect(() => initScroll(), []);

  return (
    <TransitionProvider>
      <a href="#main" className="skip-link t-mono">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <Nav />
      {/* tabIndex lets the skip link move focus here, not just the scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {children || <Outlet />}
      </main>
      {/* The contact page already is the call to action. */}
      <Footer cta={pathname !== "/contact"} />
    </TransitionProvider>
  );
}
