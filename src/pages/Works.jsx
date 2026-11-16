import React, { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { archive, projects } from "../data/projects";
import { ArrowUpRight } from "../components/Icons";
import { TLink } from "../components/Transition";
import ProjectCover from "../components/ProjectCover";
import { pageMeta } from "../lib/meta";
import { site } from "../data/site";

const pad = (n) => String(n).padStart(2, "0");

const leadSpans = projects.length % 2 === 1;

/**
 * A project card. The lead card sits beside its text instead of above it, so
 * a full-width row stays about as tall as a normal one.
 */
function Card({ project, index, lead }) {
  const meta = [project.type, project.year].filter(Boolean).join(" · ");

  return (
    <TLink
      to={`/works/${project.slug}`}
      name={project.title}
      className={`card group block ${lead ? "md:grid md:grid-cols-12 md:items-end md:gap-8" : ""}`}
      data-cursor="Open"
    >
      <div className={`frame aspect-[16/10] ${lead ? "md:col-span-8" : ""}`}>
        <ProjectCover
          project={project}
          sizes={lead ? "(min-width: 768px) 62vw, 92vw" : "(min-width: 768px) 46vw, 92vw"}
        />
      </div>
      <div className={`mt-5 flex items-start justify-between gap-6 ${lead ? "md:col-span-4 md:mt-0 md:pb-1" : ""}`}>
        <div>
          {/* Lead styling only applies where the card actually spans two columns. */}
          {lead && <p className="t-mono mb-4 hidden text-[color:var(--muted)] md:block">{meta}</p>}
          <h2
            className={`t-title text-[clamp(1.6rem,3vw,3rem)] ${lead ? "md:text-[clamp(2rem,4.2vw,4.5rem)]" : ""}`}
          >
            {project.title}
          </h2>
          <p className="t-body mt-3 max-w-[38ch]">{project.summary}</p>
        </div>
        <span className="t-mono shrink-0 pt-2 text-[color:var(--muted)]">{pad(index + 1)}</span>
      </div>
    </TLink>
  );
}

export const meta = () =>
  pageMeta({
    title: "Work",
    description: `Case studies by ${site.name}: ${projects.map((p) => p.title).join(", ")}. Laravel products, the pipelines that ship them and the clusters they run on.`,
    path: "/works",
  });

export default function Works() {
  const root = useRef(null);
  useDocumentTitle("Work");

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.07 }).from(
      ".works__fade",
      { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 },
      0.5
    );
  });

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.utils.toArray(".card").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="theme-ink">
      <header className="wrap pb-[clamp(3rem,6vw,6rem)] pt-[clamp(8rem,16vw,14rem)]">
        <p className="works__fade t-mono eyebrow">Work, {pad(projects.length)} case studies</p>
        <h1 className="t-mega mt-8">
          <span className="line">
            <span className="line__in">Built,</span>
          </span>
          <span className="line">
            <span className="line__in">
              shipped, <span className="serif accent">running.</span>
            </span>
          </span>
        </h1>
      </header>

      <ul className="wrap grid gap-x-8 gap-y-16 pb-[clamp(5rem,10vw,10rem)] md:grid-cols-2 md:gap-y-24">
        {projects.map((project, index) => {
          // With an odd count the first project spans both columns, so the
          // rest always pair up and no card is left alone on the last row.
          // Right-hand cards drop down a step so the grid reads as a ladder.
          const isLead = leadSpans && index === 0;
          const column = leadSpans ? (index - 1) % 2 : index % 2;
          return (
            <li key={project.slug} className={isLead ? "md:col-span-2" : column === 1 ? "md:mt-32" : ""}>
              <Card project={project} index={index} lead={isLead} />
            </li>
          );
        })}
      </ul>

      {archive.length > 0 && (
        <section aria-labelledby="archive-title" className="wrap pb-[clamp(5rem,11vw,11rem)]">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="archive-title" className="t-mono eyebrow">
              Archive
            </h2>
            <p className="t-mono text-[color:var(--muted)]">Earlier and smaller work, without a page of its own</p>
          </div>
          <ul className="archive mt-6">
            {archive.map((project) => {
              const link = project.links[0];
              return (
                <li key={project.slug} className="archive__row">
                  <span className="archive__title">{project.title}</span>
                  <span className="t-mono text-[color:var(--muted)]">
                    {[project.type, project.year].filter(Boolean).join(" · ")}
                  </span>
                  <span className="t-mono text-[color:var(--muted)]">{project.stack.slice(0, 3).join(", ")}</span>
                  <span className="archive__link">
                    {link && (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link t-mono inline-flex items-center gap-2"
                        aria-label={`${link.label}: ${project.title}`}
                      >
                        {link.label} <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
