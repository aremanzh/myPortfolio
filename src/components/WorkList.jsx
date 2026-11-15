import React, { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { finePointer, reducedMotion } from "../lib/env";
import { TLink } from "./Transition";
import ProjectCover from "./ProjectCover";
import { ArrowUpRight } from "./Icons";

const pad = (n) => String(n).padStart(2, "0");

function Meta({ project, className = "" }) {
  return (
    <span className={`t-mono flex flex-wrap gap-x-4 gap-y-1 text-[color:var(--muted)] ${className}`}>
      <span>{project.type}</span>
      {project.stack.length > 0 && <span>{project.stack.slice(0, 3).join(", ")}</span>}
    </span>
  );
}

/**
 * Project index. On a mouse, each row's cover floats beside the cursor and
 * wipes to the next one as you move down the list. On touch (and for anyone
 * without hover) the cover sits inline above the title.
 */
export default function WorkList({ projects }) {
  const preview = useRef(null);
  const [active, setActive] = useState(-1);
  const [previous, setPrevious] = useState(-1);
  const floating = finePointer && !reducedMotion;

  useEffect(() => {
    if (!floating) return undefined;

    const el = preview.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6 });
    const moveX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (event) => {
      // Hold a lane on the right, clear of the titles, and only lean toward
      // the cursor horizontally. Vertically it tracks the cursor.
      const vw = window.innerWidth;
      moveX(vw * 0.68 + (event.clientX - vw / 2) * 0.12);
      moveY(event.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [floating]);

  useEffect(() => {
    if (!floating) return;
    gsap.to(preview.current, {
      opacity: active === -1 ? 0 : 1,
      scale: active === -1 ? 0.6 : 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [active, floating]);

  const show = (index) => {
    setPrevious(active);
    setActive(index);
  };

  return (
    <>
      <ul className="work-list" onMouseLeave={() => show(-1)}>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <TLink
              to={`/works/${project.slug}`}
              name={project.title}
              className={`work-row ${floating ? "" : "work-row--inline"}`}
              data-cursor={floating ? "Open" : undefined}
              onMouseEnter={() => show(index)}
            >
              <span className="t-mono hidden text-[color:var(--muted)] lg:block">
                {pad(index + 1)}
              </span>

              {floating ? (
                <>
                  <span className="work-row__title t-title block">{project.title}</span>
                  <Meta project={project} className="lg:flex-col" />
                </>
              ) : (
                <>
                  <span className="frame block aspect-[16/10]">
                    <ProjectCover project={project} sizes="(min-width: 1024px) 14rem, 100vw" />
                  </span>
                  <span className="grid gap-3">
                    <span className="work-row__title t-title block">{project.title}</span>
                    <Meta project={project} />
                  </span>
                </>
              )}

              <ArrowUpRight className="work-row__arrow hidden lg:block" />
            </TLink>
          </li>
        ))}
      </ul>

      {floating && (
        <div ref={preview} className="preview" aria-hidden="true">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={`preview__slide ${index === active ? "is-active" : ""} ${
                index === previous ? "is-prev" : ""
              }`}
            >
              <ProjectCover project={project} sizes="30vw" eager />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
