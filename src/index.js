import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

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
import { preview } from "./lib/env";

function AdminRedirect() {
  React.useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);
  return null;
}

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
      // The old site linked to /contacts.
      { path: "contacts", element: <Navigate to="/contact" replace /> },
      // The CMS is a static page outside the app. If the host's SPA fallback
      // hands /admin to the router, send the browser to the real file.
      { path: "admin", element: <AdminRedirect /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

/*
 * A preview build may run inside a frame that has no address bar of its own
 * and only passes a plain "#name" to the page. So it routes in memory and
 * mirrors the current page into a simple hash (#works, #work-ringmaster),
 * which keeps a refresh or a shared link on the same page.
 */
const hashToPath = () => {
  const name = window.location.hash.slice(1);
  if (name === "works" || name === "contact") return `/${name}`;
  if (name.startsWith("work-")) return `/works/${name.slice(5)}`;
  return "/";
};
const pathToHash = (pathname) => {
  if (pathname === "/works" || pathname === "/contact") return pathname.slice(1);
  if (pathname.startsWith("/works/")) return `work-${pathname.slice(7)}`;
  return "home";
};

function createPreviewRouter() {
  const memory = createMemoryRouter(routes, { initialEntries: [hashToPath()] });
  memory.subscribe((state) => {
    const name = pathToHash(state.location.pathname);
    if (window.location.hash.slice(1) !== name) window.location.hash = name;
  });
  window.addEventListener("hashchange", () => {
    const path = hashToPath();
    if (path !== memory.state.location.pathname) memory.navigate(path);
  });
  return memory;
}

const router = preview ? createPreviewRouter() : createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
