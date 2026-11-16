# Award submission kit

Everything needed to submit the site to an awards gallery (Awwwards, CSS Design
Awards and similar). Text fields are ready to paste. Check each platform's
current form and image requirements before submitting; they change.

Nothing in this folder is deployed. It sits outside `public/`.

## Before you submit

These are not done yet, and juries will notice:

- [ ] **Deploy** to https://mumtaaz.xyz with `npm ci && npm run build`. Juries
      only review a live URL.
- [ ] **Real visuals for Sistem Pengurusan Program and Sistem Perkongsian Fail
      Multimedia** (anonymised screenshots or a short recording). Upload them
      as covers in the CMS. This is the single biggest improvement left.
- [ ] **Test on real phones** (iOS Safari and Android Chrome) and run
      Lighthouse on the live URL. Fix anything that breaks.
- [ ] **Re-capture Ringmaster on Windows.** The current screenshot was taken on
      Linux. Replace `public/uploads/ringmaster.png` and remove the Linux note
      from its cover caption in the CMS.
- [ ] **Regenerate this kit** after the items above, so the screenshots show
      the final content.

## Paste-ready text

**Site name**
Mumtaz Che Ismail

**URL**
https://mumtaaz.xyz

**One line** (about 150 characters)
Portfolio of a Malaysian full-stack Laravel developer and DevOps engineer, built around a Kubernetes cluster you can break and watch heal.

**Description**
The site is built on one line: Build it. Ship it. Keep it up. The hero is a live cluster simulation. Point at it and the pods under your cursor die, then the controller reschedules them, and the counters show what really happened. "Run chaos test" takes out roughly 40% of the cluster at once. Further down, "What I do" is a CI pipeline that runs as you scroll: each stage starts when its card reaches the top, prints its job log, and passes when you move on, and every duration shown is the time you spent on that card. The same pod grid draws the covers of projects that have no public screenshots and the 404 page, and it can be knocked out too. Type is a condensed variable grotesque with a serif italic accent, on ink, paper and signal orange.

**What to try** (for jury notes)
1. Hover the cluster in the hero, then press "Run chaos test".
2. Scroll slowly through "What I do" and watch the pipeline run. Press "Run it again" at the end.
3. Press Cmd+K (or Ctrl+K, or /) for the command palette.
4. Open a project without a screenshot and point at its cover.
5. Visit any missing page for the 404.

**Technologies**
React 18, React Router, GSAP (ScrollTrigger, SplitText), Lenis, Canvas 2D, Tailwind CSS, Sveltia CMS (Git-based), sharp

**Typefaces**
Bricolage Grotesque, Instrument Serif, JetBrains Mono (all self-hosted)

**Colours**
Ink `#0C0B0A` · Paper `#EDE9E0` · Signal `#FF4A1C`

**Suggested tags** (map to the platform's own list)
Portfolio, Developer, Technology, Interaction, Animation, Typography, Canvas, Dark

**Credits**
Yours to fill in: who designed it and who developed it.

## Assets

| File | Shows |
| --- | --- |
| `cover.jpg` | Hero during a chaos test: pods dying and rescheduling, HUD reading "Self-healing" |
| `tour.mp4` | 42-second walkthrough: preloader, hero and chaos test, scroll through the running pipeline, work list, command palette, Ringmaster case study. 1440×900, H.264, no audio |
| `screens/01-hero-self-healing.jpg` | Same moment as the cover |
| `screens/02-about.jpg` | About: portrait, statement, facts |
| `screens/03-pipeline-running.jpg` | Pipeline mid-run: Build passed, Ship running and printing its log |
| `screens/04-selected-work.jpg` | Home work list with the cursor-following cover preview |
| `screens/05-command-palette.jpg` | Command palette open over the hero |
| `screens/06-work-index.jpg` | Work index |
| `screens/07-case-ringmaster.jpg` | Ringmaster case study, top |
| `screens/08-case-ringmaster-details.jpg` | Ringmaster: manifest, description, numbered highlights |
| `screens/09-case-generated-cover.jpg` | A generated pod cover with pods knocked out by the cursor |
| `screens/10-contact.jpg` | Contact page |
| `screens/11-not-found.jpg` | 404, with the pod lettering partly knocked out |
| `screens/m1-hero.jpg` … `m4-menu.jpg` | Phone: hero, pipeline, case study, menu |

Desktop images are 2880×1800 (1440×900 at 2x). Phone images are 780×1688
(390×844 at 2x). Crop or resize to whatever each form asks for.
