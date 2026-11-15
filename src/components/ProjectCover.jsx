import React from "react";

/**
 * A project's cover. Uses the screenshot when there is one; otherwise draws a
 * typographic cover from the project's mark, so a project without public
 * screenshots still gets a designed tile and never a placeholder image.
 */
export default function ProjectCover({ project, sizes = "100vw", eager = false }) {
  const { cover, mark, type, stack, tone } = project;

  if (cover) {
    return (
      <div className="cover">
        <img
          src={cover.sm}
          srcSet={`${cover.sm} 800w, ${cover.lg} 1600w`}
          sizes={sizes}
          alt={cover.alt}
          width="1600"
          height="895"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`cover cover--${tone}`} aria-hidden="true">
      <div className="cover__pods" />
      <div className="cover__meta t-mono">
        <span>{type}</span>
        <span>{stack.join(" / ")}</span>
      </div>
      <span className="cover__mark">{mark}</span>
    </div>
  );
}
