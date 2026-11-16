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
 * wipes to the next one as you move down the list. On touch, and for anyone
 * who prefers reduced motion, the cover sits in the row instead.
 *
 * Which of the two shows is decided in CSS (a pointer media query), not in
 * render, so the prerendered HTML is the same for every device and nothing
 * jumps when the page hydrates.
 */
export default function WorkList({ projects }) {
  const preview = useRef(null);
  const [active, setActive] = useState(-1);
  const [previous, setPrevious] = useState(-1);

  useEffect(() => {
    if (!finePointer || reducedMotion) return undefined;

    const el = preview.current;
    // Appear from just under full size; nothing grows from far smaller.
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.92 });
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
  }, []);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    gsap.to(preview.current, {
      opacity: active === -1 ? 0 : 1,
      scale: active === -1 ? 0.92 : 1,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [active]);

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
              className="work-row"
              data-cursor="Open"
              onMouseEnter={() => show(index)}
            >
              <span className="t-mono hidden text-[color:var(--muted)] lg:block">{pad(index + 1)}</span>
              <span className="work-row__thumb frame aspect-[16/10]">
                <ProjectCover project={project} sizes="(min-width: 1024px) 14rem, 100vw" />
              </span>
              <span className="work-row__text">
                <span className="work-row__title t-title block">{project.title}</span>
                <Meta project={project} className="work-row__meta" />
              </span>
              <ArrowUpRight className="work-row__arrow hidden lg:block" />
            </TLink>
          </li>
        ))}
      </ul>

      <div ref={preview} className="preview" aria-hidden="true">
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className={`preview__slide ${index === active ? "is-active" : ""} ${
              index === previous ? "is-prev" : ""
            }`}
          >
            <ProjectCover project={project} sizes="30vw" />
          </div>
        ))}
      </div>
    </>
  );
}
