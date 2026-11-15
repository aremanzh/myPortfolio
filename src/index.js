import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

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

function AdminRedirect() {
  React.useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);
  return null;
}

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
