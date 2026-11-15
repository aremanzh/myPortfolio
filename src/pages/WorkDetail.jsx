import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";
import { reducedMotion } from "../lib/env";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { findProject, projects } from "../data/projects";
import { TLink } from "../components/Transition";
import ProjectCover from "../components/ProjectCover";
import { FadeUp, SplitReveal } from "../components/Reveal";
import { ArrowUpRight } from "../components/Icons";
import NotFound from "./NotFound";

const pad = (n) => String(n).padStart(2, "0");

function Meta({ label, children }) {
  return (
    <div className="border-t border-[color:var(--line)] pt-4">
      <dt className="t-mono text-[color:var(--muted)]">{label}</dt>
      <dd className="mt-2 text-lg font-medium leading-snug tracking-tight">{children}</dd>
    </div>
  );
}

function Case({ project, index, next }) {
  const root = useRef(null);
  useDocumentTitle(project.title);

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.1 })
      .from(".case__fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5)
      .from(".case__cover", { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "power4.inOut" }, 0.35);
  });

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".case__cover .frame__in",
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".case__cover", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <article ref={root} className="theme-ink">
      <header className="wrap pb-[clamp(2.5rem,5vw,5rem)] pt-[clamp(8rem,16vw,14rem)]">
        <p className="case__fade t-mono eyebrow">
          <TLink to="/works" name="Work" className="link">
            Work
          </TLink>
          <span>/</span>
          <span>
            {pad(index + 1)} of {pad(projects.length)}
          </span>
        </p>
        <h1 className="t-display mt-8 max-w-[14ch]">
          <span className="line">
            <span className="line__in">{project.title}</span>
          </span>
        </h1>
      </header>

      <div className="wrap">
        <div className="case__cover frame aspect-[16/10] md:aspect-[16/8]" style={{ clipPath: "inset(0)" }}>
          <div className="frame__in">
            <ProjectCover project={project} sizes="94vw" eager />
          </div>
        </div>
      </div>

      <div className="wrap grid gap-12 py-[clamp(4rem,9vw,9rem)] lg:grid-cols-12 lg:gap-10">
        <FadeUp as="dl" className="grid content-start gap-8 lg:col-span-4">
          <Meta label="Type">{project.type}</Meta>
          {project.role && <Meta label="Role">{project.role}</Meta>}
          {project.year && <Meta label="Year">{project.year}</Meta>}
          {project.stack.length > 0 && <Meta label="Stack">{project.stack.join(", ")}</Meta>}
          {project.links.length > 0 && (
            <Meta label="Links">
              <ul className="grid gap-2">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link link--on inline-flex items-center gap-2"
                    >
                      {link.label} <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </Meta>
          )}
        </FadeUp>

        <div className="grid content-start gap-8 lg:col-span-8">
          {project.body.map((paragraph, i) => (
            <SplitReveal key={paragraph} className={i === 0 ? "t-lead max-w-[24ch]" : "t-body max-w-[60ch]"}>
              {paragraph}
            </SplitReveal>
          ))}
        </div>
      </div>

      <TLink
        to={`/works/${next.slug}`}
        name={next.title}
        className="group block border-t border-[color:var(--line)]"
        data-cursor="Next"
      >
        <div className="wrap py-[clamp(3.5rem,8vw,8rem)]">
          <p className="t-mono eyebrow">Next project</p>
          <p className="t-display mt-6 transition-transform duration-700 ease-out group-hover:translate-x-4">
            {next.title}
          </p>
        </div>
      </TLink>
    </article>
  );
}

export default function WorkDetail() {
  const { slug } = useParams();
  const found = findProject(slug);

  if (!found) return <NotFound />;

  // Keyed so intro and scroll animations rebuild when moving between cases.
  return <Case key={found.project.slug} {...found} />;
}
