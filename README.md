# Mumtaz Che Ismail · Portfolio

Personal site. React 18, React Router, GSAP (ScrollTrigger, SplitText), Lenis
smooth scroll and Tailwind, built with Create React App.

The idea behind the design: **build it, ship it, keep it up.** The hero is a
small cluster simulation. Point at it and the pods die; the controller brings
them back.

## Run it

```bash
npm install
npm start        # dev server on :3000
npm run build    # production bundle in ./build
```

## Edit the content

All copy lives in two files. Components only render it.

| File | What it holds |
| --- | --- |
| `src/data/site.js` | Name, role, location, email, socials, availability badge, form endpoint, about text, pipeline stages, marquee words |
| `src/data/projects.js` | Projects, in display order. The first four show on the home page |

Adding a project: append an object to `projects`. With `cover: null` the site
sets the project's `mark` in pods as its cover; with a screenshot, add 800px
and 1600px wide WebP files (16:9) to `src/assets/work/` and reference them.
`highlights`, `year` and `role` are optional and appear on the case page when
set. Add the new URL to `public/sitemap.xml`.

Project copy is taken from public sources only (the GitHub profile README and
the public repositories' READMEs). Keep it that way for client work.

## Layout

```
src/
  index.js              routes
  App.js                page shell: preloader, cursor, nav, footer, transitions
  data/                 content (see above)
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
```

## Behaviour worth knowing

- **One simulation, three uses.** `lib/podSim.js` runs the hero cluster, the
  generated project covers and the 404 lettering. Only the layout differs.
  Thumbnails draw a single frame (`live={false}`); the hero, the case-page
  cover and the 404 run live and pause off screen.
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
  element. Keep new component classes above it.
- **Contact form** posts to the Getform endpoint in `site.js`. It submits with
  `fetch` and falls back to a plain form POST without JavaScript.

## Deploying

The build is a static SPA, so the server has to return `index.html` for
unknown paths (`/works/...`, `/contact`). Hashed files under `/static/` can be
cached forever; `index.html` should not be.

```nginx
location / {
    try_files $uri /index.html;
    add_header Cache-Control "no-cache";
}
location /static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

Canonical URL, Open Graph tags, `robots.txt` and `sitemap.xml` all assume
`https://mumtaaz.xyz`. Change them together if the domain changes.
