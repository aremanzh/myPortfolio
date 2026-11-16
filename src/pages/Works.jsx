import React, { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { archive, projects } from "../data/projects";
import { ArrowUpRight } from "../components/Icons";
import { TLink } from "../components/Transition";
import ProjectCover from "../components/ProjectCover";

const pad = (n) => String(n).padStart(2, "0");

export default function Works() {
  const root = useRef(null);
  useDocumentTitle("Work");

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.1 }).from(
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
        {projects.map((project, index) => (
          // Odd cards drop down a step so the grid reads as a ladder.
          <li key={project.slug} className={index % 2 === 1 ? "md:mt-32" : ""}>
            <TLink
              to={`/works/${project.slug}`}
              name={project.title}
              className="card group block"
              data-cursor="Open"
            >
              <div className="frame aspect-[16/10]">
                <ProjectCover project={project} sizes="(min-width: 768px) 46vw, 92vw" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h2 className="t-title text-[clamp(1.6rem,3vw,3rem)]">{project.title}</h2>
                  <p className="t-body mt-3 max-w-[38ch]">{project.summary}</p>
                </div>
                <span className="t-mono shrink-0 pt-2 text-[color:var(--muted)]">
                  {pad(index + 1)}
                </span>
              </div>
            </TLink>
          </li>
        ))}
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
