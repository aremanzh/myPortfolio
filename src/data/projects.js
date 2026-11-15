import gobosku800 from "../assets/work/gobosku-800.webp";
import gobosku1600 from "../assets/work/gobosku-1600.webp";
import blog800 from "../assets/work/anonymous-blog-800.webp";
import blog1600 from "../assets/work/anonymous-blog-1600.webp";
import weather800 from "../assets/work/weather-800.webp";
import weather1600 from "../assets/work/weather-1600.webp";

/**
 * Project list, in display order. The first four show on the home page.
 *
 * Fields
 *   slug      URL segment under /works/
 *   title     Display name
 *   mark      Short mark drawn on the generated cover when there is no image
 *   type      One or two words, shown as the category
 *   summary   One line for lists
 *   body      Paragraphs for the case page
 *   stack     Tools, shown as tags. Leave empty to hide the row
 *   links     { label, href }. Leave empty to hide the row
 *   cover     { sm, lg, alt } or null. With null a typographic cover is drawn
 *   tone      Background of the generated cover: "signal" | "paper" | "ink"
 *
 * Optional, shown on the case page when present: year, role.
 */
export const projects = [
  {
    slug: "sistem-pengurusan-program",
    title: "Sistem Pengurusan Program",
    mark: "SPP",
    type: "Web application",
    summary: "A programme management system built on Laravel.",
    body: [
      "A programme management system: a Laravel application with a Tailwind CSS interface.",
    ],
    stack: ["Laravel", "Tailwind CSS"],
    links: [],
    cover: null,
    tone: "signal",
  },
  {
    slug: "sistem-perkongsian-fail-multimedia",
    title: "Sistem Perkongsian Fail Multimedia",
    mark: "SPFM",
    type: "Web application",
    summary: "A multimedia file sharing system with a Laravel backend and a React front end.",
    body: [
      "A system for sharing multimedia files, with Laravel on the server and React in the browser.",
    ],
    stack: ["Laravel", "React"],
    links: [],
    cover: null,
    tone: "paper",
  },
  {
    slug: "ringmaster",
    title: "Ringmaster",
    mark: "RM",
    type: "Open-source tool",
    summary: "Run many local Laravel and PHP projects at once on Windows, from one place.",
    body: [
      "Run many local Laravel and PHP projects at once on Windows, from one place, with the PHP and Node you already have.",
    ],
    stack: ["Go"],
    links: [{ label: "Source on GitHub", href: "https://github.com/aremanzh/ringmaster" }],
    cover: null,
    tone: "ink",
  },
  {
    slug: "gobosku",
    title: "Gobosku",
    mark: "GB",
    type: "E-commerce",
    summary: "An online store for polarized sunglasses, built on WordPress and WooCommerce.",
    body: [
      "An online store selling polarized sunglasses across Malaysia, built on WordPress and WooCommerce.",
    ],
    stack: ["WordPress", "WooCommerce"],
    links: [],
    cover: {
      sm: gobosku800,
      lg: gobosku1600,
      alt: "Gobosku store home page showing a stack of clip-on sunglasses",
    },
    tone: "paper",
  },
  {
    slug: "anonymous-blog",
    title: "Anonymous Blog",
    mark: "AB",
    type: "Web app",
    summary: "A blog where anyone can write without revealing who they are.",
    body: [
      "A concept blog where people write anything meaningful, or just for fun, without revealing their identity.",
    ],
    stack: [],
    links: [],
    cover: {
      sm: blog800,
      lg: blog1600,
      alt: "Anonymous Blog landing page with a Write Now button",
    },
    tone: "ink",
  },
  {
    slug: "weather-status",
    title: "Weather Status",
    mark: "WS",
    type: "Web app",
    summary: "A small weather lookup that reads a public weather API.",
    body: [
      "A small weather lookup: search a location and get the current conditions, wind speed, pressure and humidity from a public weather API.",
    ],
    stack: [],
    links: [
      { label: "Source on GitHub", href: "https://github.com/aremanzh/SimpleWeatherStatus" },
    ],
    cover: {
      sm: weather800,
      lg: weather1600,
      alt: "Weather Status showing light rain in Kuala Lumpur",
    },
    tone: "ink",
  },
];

export const featured = projects.slice(0, 4);

export function findProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: projects[index],
    index,
    next: projects[(index + 1) % projects.length],
  };
}
