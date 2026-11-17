/*
 * Entry for the preview build only (npm run build:preview). It is the same
 * site as a client-only bundle with relative paths, for review somewhere that
 * is not a real host, such as a sandboxed frame with no address bar.
 *
 * Such a frame only passes a plain "#name" to the page, so the router lives in
 * memory and mirrors the current page into a hash (#works, #work-ringmaster).
 * A refresh or a shared link stays on the same page. Malay pages use an
 * "ms-" prefix (#ms-works, #ms-work-ringmaster, #ms for the home page).
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "lenis/dist/lenis.css";
import "./styles/index.css";

import App from "./App";
import Home from "./pages/Home";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: (
      <App>
        <NotFound />
      </App>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "works", element: <Works /> },
      { path: "works/:slug", element: <WorkDetail /> },
      { path: "contact", element: <Contact /> },
      { path: "ms", element: <Home /> },
      { path: "ms/works", element: <Works /> },
      { path: "ms/works/:slug", element: <WorkDetail /> },
      { path: "ms/contact", element: <Contact /> },
      { path: "contacts", element: <Navigate to="/contact" replace /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const hashToPath = () => {
  let name = window.location.hash.slice(1);
  let prefix = "";
  if (name === "ms") return "/ms";
  if (name.startsWith("ms-")) {
    prefix = "/ms";
    name = name.slice(3);
  }
  if (name === "works" || name === "contact") return `${prefix}/${name}`;
  if (name.startsWith("work-")) return `${prefix}/works/${name.slice(5)}`;
  return prefix || "/";
};
const pathToHash = (fullPath) => {
  const malay = fullPath === "/ms" || fullPath.startsWith("/ms/");
  const pathname = malay ? fullPath.slice(3) || "/" : fullPath;
  const prefix = malay ? "ms-" : "";
  if (pathname === "/works" || pathname === "/contact") return `${prefix}${pathname.slice(1)}`;
  if (pathname.startsWith("/works/")) return `${prefix}work-${pathname.slice(7)}`;
  return malay ? "ms" : "home";
};

const router = createMemoryRouter(routes, { initialEntries: [hashToPath()] });
router.subscribe((state) => {
  const name = pathToHash(state.location.pathname);
  if (window.location.hash.slice(1) !== name) window.location.hash = name;
});
window.addEventListener("hashchange", () => {
  const path = hashToPath();
  if (path !== router.state.location.pathname) router.navigate(path);
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
