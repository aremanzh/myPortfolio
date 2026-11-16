import React, { useRef } from "react";
import { useParams } from "react-router";
import { finePointer, reducedMotion, useHydrated } from "../lib/env";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { findProject, projects } from "../data/projects";
import { TLink } from "../components/Transition";
import ProjectCover from "../components/ProjectCover";
import { FadeUp, SplitReveal } from "../components/Reveal";
import { ArrowUpRight } from "../components/Icons";
import NotFound from "./NotFound";
import { pageMeta } from "../lib/meta";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Project facts, laid out like a manifest. It is still a plain definition
 * list underneath; the YAML look is CSS.
 */
function Manifest({ project }) {
  const rows = [
    ["kind", project.type],
    project.year && ["year", project.year],
    project.role && ["role", project.role],
  ].filter(Boolean);

  return (
    <div className="manifest t-mono">
      <p className="manifest__file" aria-hidden="true">
        {project.slug}.yaml
      </p>
      <dl>
        {rows.map(([key, value]) => (
          <div key={key} className="manifest__row">
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        {project.stack.length > 0 && (
          <div className="manifest__row manifest__row--list">
            <dt>stack</dt>
            <dd>
              <ul>
                {project.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {project.links.length > 0 && (
          <div className="manifest__row manifest__row--list">
            <dt>links</dt>
            <dd>
              <ul>
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link link--on inline-flex items-center gap-2"
                    >
                      {link.label} <ArrowUpRight className="h-2.5 w-2.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function Case({ project, index, next }) {
  const root = useRef(null);
  const hydrated = useHydrated();
  useDocumentTitle(project.title);

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.07 })
      .from(".case__fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5)
      .from(".case__cover", { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "power4.inOut" }, 0.35);
  });

  const [lead, ...rest] = project.body;
  const caption = project.cover
    ? project.cover.caption
    : `No public screenshots for this one, so the cover is set in pods. ${
        !hydrated || reducedMotion ? "" : finePointer ? "Point at it." : "Tap it."
      }`;

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

      <figure className="wrap">
        <div
          className="case__cover frame aspect-[16/9]"
          style={{ clipPath: "inset(0)" }}
          data-cursor={project.cover ? undefined : "Kill pods"}
        >
          {/* Shown whole and still: screenshots are UI, so nothing is cropped,
              and a generated cover is a live canvas under the pointer. */}
          <div className="absolute inset-0">
            <ProjectCover project={project} sizes="94vw" eager live />
          </div>
        </div>
        {caption && (
          <figcaption className="case__fade t-mono mt-4 text-[color:var(--muted)]">{caption}</figcaption>
        )}
      </figure>

      <div className="wrap grid gap-12 py-[clamp(4rem,9vw,9rem)] lg:grid-cols-12 lg:gap-10">
        <FadeUp className="lg:col-span-4">
          <Manifest project={project} />
        </FadeUp>

        <div className="grid content-start gap-8 lg:col-span-8">
          <SplitReveal className="t-lead max-w-[24ch]">{lead}</SplitReveal>
          {rest.map((paragraph) => (
            <SplitReveal key={paragraph} className="t-body max-w-[58ch] text-[clamp(1.05rem,1.4vw,1.35rem)]">
              {paragraph}
            </SplitReveal>
          ))}

          {project.highlights && (
            <FadeUp as="ol" className="mt-[clamp(1.5rem,3vw,3rem)]" stagger={0.06}>
              {project.highlights.map((item, i) => (
                <li
                  key={item.title}
                  className="grid gap-x-8 gap-y-2 border-t border-[color:var(--line)] py-6 md:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)]"
                >
                  <span className="t-mono pt-1 text-[color:var(--muted)]">{pad(i + 1)}</span>
                  <h2 className="text-xl font-semibold leading-tight tracking-tight">{item.title}</h2>
                  <p className="t-body">{item.text}</p>
                </li>
              ))}
            </FadeUp>
          )}
        </div>
      </div>

      {project.gallery.length > 0 && (
        <section aria-labelledby="screens-title" className="wrap pb-[clamp(4rem,9vw,9rem)]">
          <h2 id="screens-title" className="t-mono eyebrow">
            Screens
          </h2>
          <FadeUp as="ul" className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2" stagger={0.06}>
            {project.gallery.map((shot) => (
              <li key={shot.sm}>
                <figure>
                  <a
                    href={shot.lg}
                    target="_blank"
                    rel="noreferrer"
                    className="card block"
                    data-cursor="View"
                    aria-label={`Open full size: ${shot.alt}`}
                  >
                    <span className="frame block aspect-[16/9]">
                      <span className="cover">
                        <img
                          src={shot.sm}
                          srcSet={shot.srcSet}
                          sizes="(min-width: 768px) 46vw, 92vw"
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    </span>
                  </a>
                  {shot.caption && (
                    <figcaption className="t-mono mt-4 text-[color:var(--muted)]">{shot.caption}</figcaption>
                  )}
                </figure>
              </li>
            ))}
          </FadeUp>
        </section>
      )}

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

export function meta({ params }) {
  const found = findProject(params.slug);
  if (!found) return pageMeta({ title: "Not found", noindex: true });
  const { project } = found;
  return pageMeta({
    title: project.title,
    description: project.summary || project.body[0],
    path: `/works/${project.slug}`,
    image: project.coverSrc || undefined,
    imageAlt: project.cover ? project.cover.alt : undefined,
  });
}

export default function WorkDetail() {
  const { slug } = useParams();
  const found = findProject(slug);

  if (!found) return <NotFound />;

  // Keyed so intro and scroll animations rebuild when moving between cases.
  return <Case key={found.project.slug} {...found} />;
}
