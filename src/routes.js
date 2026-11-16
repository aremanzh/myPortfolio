import { index, route } from "@react-router/dev/routes";

export default [
  index("pages/Home.jsx"),
  route("works", "pages/Works.jsx"),
  route("works/:slug", "pages/WorkDetail.jsx"),
  route("contact", "pages/Contact.jsx"),
  // The old site linked to /contacts.
  route("contacts", "pages/redirects/Contacts.jsx"),
  // The CMS is a static page outside the app. In production the host serves
  // /admin/ directly; this only catches it when something hands it to the app.
  route("admin", "pages/redirects/Admin.jsx"),
  route("*", "pages/NotFound.jsx"),
];
