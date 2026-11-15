import ringmaster800 from "../assets/work/ringmaster-800.webp";
import ringmaster1600 from "../assets/work/ringmaster-1600.webp";
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
 *   slug        URL segment under /works/
 *   title       Display name
 *   mark        Word set in pods on the generated cover (keep it short)
 *   type        One or two words, shown as the category
 *   summary     One line for lists
 *   body        Paragraphs for the case page; the first is set large
 *   highlights  [{ title, text }] shown as a numbered list. Optional
 *   stack       Tools. Leave empty to hide the row
 *   links       [{ label, href }]. Leave empty to hide the row
 *   cover       { sm, lg, alt, caption? } or null for a generated cover
 *   tone        Background of the generated cover: "signal" | "paper" | "ink"
 *
 * Optional, shown on the case page when present: year, role.
 */
export const projects = [
  {
    slug: "ringmaster",
    title: "Ringmaster",
    mark: "RING",
    type: "Open-source tool",
    year: "2026",
    summary: "Runs every local Laravel and PHP project from one place on Windows, each on its own PHP version.",
    body: [
      "Ringmaster runs all your local Laravel and PHP projects from one place on Windows, using the PHP and Node already installed on the machine.",
      "Local PHP work on Windows usually means one active PHP version at a time and a wall of terminals: artisan serve, Vite and a queue worker for every project. Ringmaster is a single daemon that supervises all of them, controlled from a web UI, a desktop app or the CLI.",
    ],
    highlights: [
      {
        title: "A PHP version per project",
        text: "Each project resolves to a real php.exe from the installs already on the machine. 8.2 and 8.4 run side by side and nothing global is switched.",
      },
      {
        title: "Stopped means stopped",
        text: "Every task runs inside a Windows Job Object, so stopping it takes the whole process tree with it and the port is freed.",
      },
      {
        title: "Ports that never collide",
        text: "The port is checked before a start. If something holds it, Ringmaster names the PID and the program. Projects without a fixed port get a unique one from a range.",
      },
      {
        title: "Phone testing that survives DHCP",
        text: "Binding to the LAN re-detects the machine's address on every start, so yesterday's config still works after the router restarts.",
      },
      {
        title: "Careful cleanup after a crash",
        text: "It cleans up the processes it started, and checks each PID's identity first so it never kills an unrelated program that reused the number.",
      },
    ],
    stack: ["Go", "Wails", "REST and WebSocket API"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/aremanzh/ringmaster" },
      { label: "Releases", href: "https://github.com/aremanzh/ringmaster/releases" },
    ],
    cover: {
      sm: ringmaster800,
      lg: ringmaster1600,
      alt: "Ringmaster web UI listing three projects, the tasks of one of them with their status, and a live log pane",
      caption: "The web UI running Ringmaster's bundled demo registry.",
    },
    tone: "ink",
  },
  {
    slug: "sistem-pengurusan-program",
    title: "Sistem Pengurusan Program",
    mark: "SPP",
    type: "Web application",
    summary: "Manages participants across multiple programmes, with self-registration.",
    body: [
      "A programme management system: one web application for managing participants across multiple programmes.",
      "Participants can register themselves.",
    ],
    highlights: [
      {
        title: "Many programmes, one system",
        text: "Participants are managed per programme from a single application.",
      },
      {
        title: "Self-registration",
        text: "People sign themselves up for a programme and no one has to enter them by hand.",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Tailwind CSS", "Nginx", "Linux"],
    links: [],
    cover: null,
    tone: "signal",
  },
  {
    slug: "sistem-perkongsian-fail-multimedia",
    title: "Sistem Perkongsian Fail Multimedia",
    mark: "SPFM",
    type: "Web and mobile",
    summary: "Organises media by multiple criteria, with role-based access and an approval workflow.",
    body: [
      "A multimedia file sharing system that organises media by multiple criteria and controls who can see and publish it.",
      "Built on Laravel, with a REST API and a React Native mobile client made with Expo.",
    ],
    highlights: [
      {
        title: "Role-based access",
        text: "What a person can view, upload or manage depends on their role.",
      },
      {
        title: "Approval workflow",
        text: "Media goes through approval before it is shared.",
      },
      {
        title: "Mobile client",
        text: "A React Native app built with Expo talks to the system over a REST API.",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Apache", "React Native (Expo)", "REST API"],
    links: [],
    cover: null,
    tone: "paper",
  },
  {
    slug: "applytracker",
    title: "ApplyTracker",
    mark: "APPLY",
    type: "Web app",
    summary: "An AI-powered job application journal.",
    body: [
      "An AI-powered job application journal that keeps applications, interviews and follow-ups in one dashboard.",
    ],
    stack: ["Vue", "Laravel", "MySQL", "Gemini API"],
    links: [{ label: "Live site", href: "https://applytracker.mumtaaz.xyz" }],
    cover: null,
    tone: "ink",
  },
  {
    slug: "dailyjournal",
    title: "DailyJournal",
    mark: "DAILY",
    type: "Mobile app",
    summary: "A free daily journal app for Android, published on Google Play.",
    body: [
      "A daily journal app for capturing thoughts and feelings, free on Google Play.",
    ],
    stack: ["Expo", "Express", "MongoDB", "Cloudinary", "Nginx"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.mumtaaz.xyz.daily.journal",
      },
    ],
    cover: null,
    tone: "signal",
  },
  {
    slug: "anonymous-blog",
    title: "Anonymous Blog",
    mark: "ANON",
    type: "Web app",
    summary: "A blog where anyone can write without revealing who they are.",
    body: [
      "A blog where people write anything meaningful, or just for fun, without revealing their identity.",
    ],
    highlights: [
      {
        title: "Two ways to sign in",
        text: "Local accounts or Google sign-in, both through Passport.",
      },
      {
        title: "Posts with images",
        text: "Writers can attach an image to a post.",
      },
    ],
    stack: ["Node.js", "Express", "EJS", "MongoDB", "Passport"],
    links: [{ label: "Source on GitHub", href: "https://github.com/aremanzh/anonymous-blog" }],
    cover: {
      sm: blog800,
      lg: blog1600,
      alt: "Anonymous Blog landing page with a Write Now button",
    },
    tone: "ink",
  },
  {
    slug: "gobosku",
    title: "Gobosku",
    mark: "GOBO",
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
    slug: "weather-status",
    title: "Weather Status",
    mark: "WX",
    type: "Web app",
    summary: "A small weather lookup on the OpenWeatherMap API.",
    body: [
      "A small weather lookup: search a location and get the current conditions, wind speed, pressure and humidity from the OpenWeatherMap API.",
    ],
    stack: ["Node.js", "Express", "EJS", "OpenWeatherMap API"],
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
