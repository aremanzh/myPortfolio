import React from "react";
import { Links, Meta, Scripts, useLocation } from "react-router";

import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "lenis/dist/lenis.css";
import "./styles/index.css";

import App from "./App";
import NotFound from "./pages/NotFound";
import { site } from "./data/site";
import { pageMeta } from "./lib/meta";
import { HTML_LANG, localeOf } from "./i18n";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: `${site.url}/`,
  image: `${site.url}/og.jpg`,
  jobTitle: "Full-stack Laravel developer and DevOps engineer",
  address: { "@type": "PostalAddress", addressLocality: "Putrajaya", addressCountry: "MY" },
  knowsAbout: ["Laravel", "PHP", "Vue", "React", "Docker", "Kubernetes", "CI/CD"],
  sameAs: site.socials.map((social) => social.href),
};

// Only the SPA fallback page uses this (every route has its own meta). It is
// served for paths that were not prerendered: redirects and unknown URLs,
// none of which should be indexed or canonicalised to the home page.
export const meta = () => pageMeta({ noindex: true });

/** The HTML document around every page, prerendered or not. */
export function Layout({ children }) {
  // English at the root, Malay under /ms: the prerendered page says which.
  const lang = HTML_LANG[localeOf(useLocation().pathname)];
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0B0A" />
        <meta name="color-scheme" content="dark" />
        <meta name="author" content={site.name} />
        <meta name="geo.region" content="MY" />
        <meta name="geo.placename" content={site.location} />
        <Meta />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <Links />
        <script
          type="application/ld+json"
          // Static data from site.json, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        {/* Without JS the preloader would cover the prerendered page forever. */}
        <noscript>
          <style>{".preloader,.cursor{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <App />;
}

/** Thrown errors and unknown routes get the 404 page inside the normal chrome. */
export function ErrorBoundary({ error }) {
  if (import.meta.env.DEV && error) console.error(error);
  return (
    <App>
      <NotFound />
    </App>
  );
}

/** Shown by the SPA fallback page until the app takes over: the page colour, nothing else. */
export function HydrateFallback() {
  return null;
}
