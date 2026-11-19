# Mumtaz Che Ismail · Portfolio

Personal site. React 19, React Router 8 (framework mode, prerendered to static
HTML), Vite, GSAP (ScrollTrigger, SplitText), Lenis smooth scroll and Tailwind.

The idea behind the design: **build it, ship it, keep it up.** The hero is a
small cluster simulation. Point at it and the pods die; the controller brings
them back.

## Run it

Needs Node 20.19 or newer.

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # static site in ./build/client
```

`npm run build` prerenders `/`, `/works`, `/contact` and every published case
study to its own HTML file, with that page's title, description, canonical URL
and Open Graph tags (a case study uses its cover image as the link preview).
Any other path gets `build/client/__spa-fallback.html`, which boots the app
and routes on the client: redirects, and the 404 page. There is no server at
runtime; `build/client` is the whole site.

Routes are in `src/routes.js`, the HTML document in `src/root.jsx` and the
build settings in `react-router.config.js`. Adding a case study needs no
route change: the prerender list is read from `src/content/projects`.

### Preview build

`npm run build:preview` makes a copy in `./build-preview` that runs from any
folder or inside a sandboxed frame: one script, relative asset paths, routing
in memory (mirrored to a plain `#works` / `#work-<slug>` hash) and a contact
form that never sends. Use it to review the site without deploying it. Its
entry is `src/preview.jsx`.

## Edit the content

Content is managed through a CMS at **`/admin`**. It is [Sveltia CMS](https://sveltiacms.app),
a Git-based CMS that runs in the browser: there is no server and no database.
Saving an entry commits a JSON file to this repository, and the normal deploy
pipeline rebuilds the site.

| In the CMS | File | What it holds |
| --- | --- | --- |
| Projects | `src/content/projects/*.json` | One file per project: text, highlights, stack, links, cover image, order, and the featured, archive-only and published switches |
| Site → Settings | `src/content/site.json` | Name, role, location, email, socials, availability badge, form endpoint |
| Site → About | `src/content/about.json` | Statement, portrait, facts, experience, certifications (with optional ID and verify link) |
| Site → What I do | `src/content/capabilities.json` | The three pipeline stages (summary, tools, job log) and the marquee words |
| Media | `public/uploads/` | Uploaded images |

Design, layout, headlines and motion are not in the CMS on purpose. They stay
in code.

### Signing in

- **On the live site:** open `/admin`, choose "Sign In Using Access Token" and
  paste a GitHub fine-grained token limited to this repository with
  *Contents: Read and write*. The token is kept in that browser only. Anyone
  can open `/admin`; only a token with write access to the repo can change
  anything.
- **Locally:** run `npm run dev`, open `http://localhost:5173/admin/index.html`
  in a Chromium browser and choose "Work with Local Repository". Edits are
  written to your working tree and you commit them yourself.

The CMS commits to the branch named in `public/admin/config.yml` (`main`).

### What happens to an edit

`scripts/content.mjs` runs before every `npm run dev` and `npm run build`:

1. **Validates** the content. A missing title, a cover that points to no file,
   an image without alt text, an invalid link or a bad file name stops the
   build with a list of what to fix. A bad edit fails CI; it does not reach the
   live site. `npm run content:check` runs this step alone.
2. **Resizes** every image in `public/uploads` to 800px and 1600px WebP, so
   upload the largest clean original you have.
3. **Writes** `public/sitemap.xml` from the published projects.

The resized images, the image manifest and the sitemap are generated, so they
are in `.gitignore`. The build host needs to run `npm ci && npm run build`
(not a bare `react-router build`).

### Notes on projects

- The file name is the URL: `ringmaster.json` is `/works/ringmaster`. Renaming
  a title never changes the URL.
- With no cover image, the project's **mark** (up to 6 characters) is drawn in
  pods as its cover.
- **More screens** adds a gallery under the case study, two to a row. Each
  screen needs alt text; an even number fills the rows.
- **Order** sorts the lists, lowest first. The home page shows the first four
  projects marked **Featured**.
- **Archive only** lists a project as one line at the bottom of `/works`, with
  no page of its own and no place in the sitemap. Keep the case studies to the
  four or five strongest; everything else goes here.
- **Published** off removes a project from the site and the sitemap without
  deleting it.
- Project copy is taken from public sources only (the GitHub profile README
  and the public repositories' READMEs). Keep it that way for client work.

## Layout

```
src/
  index.js              routes
  App.js                page shell: preloader, cursor, nav, footer, transitions
  content/              JSON the CMS edits (see above)
  data/                 loaders that hand the content to components
  lib/
    gsap.js             plugin registration, scroll-restoration policy
    podSim.js           the pod simulation and its layouts (cluster, lettering)
    scroll.js           Lenis instance + scroll helpers
    ready.js            "preloader finished" signal
    hooks.js            useIntro, useDocumentTitle, useLocalTime
    env.js              reduced-motion and pointer checks
  components/
    PodCluster.jsx      hero cluster (podSim + node layout)
    PodType.jsx         a word set in pods: generated covers, 404
    CommandPalette.jsx  Cmd/Ctrl+K launcher
    Transition.jsx      route curtain + <TLink>
    Reveal.jsx          SplitReveal, ScrubWords, FadeUp
    WorkList.jsx        project index with cursor-following preview
    home/               hero, about, pipeline, selected work
  pages/                Home, Works, WorkDetail, Contact, NotFound
  styles/index.css      tokens, type scale, component classes
scripts/content.mjs     validate content, resize images, write the sitemap
public/admin/           the CMS page and its config.yml
public/uploads/         images uploaded through the CMS
submission/             award submission kit: text, screenshots, video (not deployed)
```

## Behaviour worth knowing

- **One simulation, three uses.** `lib/podSim.js` runs the hero cluster, the
  generated project covers and the 404 lettering. Only the layout differs.
  Thumbnails draw a single frame (`live={false}`); the hero, the case-page
  cover and the 404 run live and pause off screen.
- **The pipeline runs as you scroll.** In "What I do", each stage goes
  queued, running, passed as its card reaches the top, prints its job log, and
  passes when the visitor moves on. Stages run in order and every duration is
  the real time spent on that card. The log lines come from the CMS.
- **Command palette.** Cmd/Ctrl+K or `/` opens it. It lists pages, projects
  and a few actions; nothing in it is exclusive to the keyboard.

- **Reduced motion.** With `prefers-reduced-motion: reduce` there is no
  preloader, smooth scroll, custom cursor or text animation, and route changes
  are instant. The cluster renders one static frame.
- **Scroll restoration** is set to manual through
  `ScrollTrigger.clearScrollMemory("manual")` in `lib/gsap.js`. ScrollTrigger
  owns `history.scrollRestoration` and re-applies its value after each refresh,
  so assigning the property directly gets undone.
- **CSS order.** `@tailwind utilities` sits at the bottom of
  `styles/index.css` so a utility always beats a component class on the same
  element. Keep new component classes above it, and don't put a display
  utility (`block`, `hidden`) on an element whose display a component class
  switches in a media query: the utility wins.
- **Prerendering and hydration.** Pages are rendered to HTML at build time,
  where there is no `window`, and React then hydrates that HTML in the
  browser. Render output must not depend on the device: `reducedMotion`,
  `finePointer`, the platform, the clock. Effects can read those freely; for
  markup, check `useHydrated()` from `lib/env.js` first (false on the server
  and during hydration), or let CSS decide, as the work list does with a
  pointer media query. Compare paths with `normalizePath()`: a prerendered
  page is a folder, so `/contact/` and `/contact` are the same page.
- **Contact form** posts to the Getform endpoint in `site.js`. It submits with
  `fetch` and falls back to a plain form POST without JavaScript.

## Deploying

Production is a Docker image: Node builds and prerenders the site, and
unprivileged nginx serves `build/client`. GitHub Actions builds the image,
pushes it to GHCR and deploys it over SSM to the shared EC2 host behind its
nginx, with a health check and automatic rollback. Setup, prerequisites and
rollback are in [`deploy/README.md`](deploy/README.md).

```bash
docker compose up --build                  # the production image on :8080
docker build -t portfolio:test . && scripts/smoke-image.sh portfolio:test
```

What the container's nginx (`docker/nginx.conf`) does:

- Prerendered pages are served from `<path>/index.html`.
- Any other path gets a **real 404 status**. The body is
  `__spa-fallback.html`, which boots the app and shows its 404 page.
- `/contacts` returns 301 to `/contact`, and `/admin` returns 301 to `/admin/`
  (the CMS resolves `config.yml` relative to its own URL).
- Hashed files (`/assets/`, `/uploads/_r/`) are cached for a year as
  immutable. HTML is `no-cache`.
- Text assets are gzip-compressed at build time and served with `gzip_static`.
- Security headers are added: nosniff, referrer policy, frame options and a
  permissions policy. HSTS belongs to Cloudflare and the host nginx.

To host it without Docker, serve `build/client` with the same rules. The
essential one is:

```nginx
try_files $uri $uri/index.html =404;
error_page 404 /__spa-fallback.html;
```

Canonical URLs, Open Graph tags, JSON-LD and the sitemap use the Site URL
from the CMS (`src/content/site.json`). `robots.txt` and the CMS config
(`public/admin/config.yml`) hard-code `https://mumtaaz.xyz`. Change them
together if the domain changes.
