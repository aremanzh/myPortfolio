import React from "react";
import PodType from "./PodType";

/**
 * A project's cover. Uses the screenshot when there is one. Otherwise the
 * project's mark is set in pods, so work without public screenshots still
 * gets a designed cover and never a placeholder image.
 *
 * `live` turns the generated cover into the interactive simulation; keep it
 * for the one large cover on a case page.
 */
export default function ProjectCover({ project, sizes = "100vw", eager = false, live = false }) {
  const { cover, mark, type, stack, tone } = project;

  if (cover) {
    return (
      <div className="cover">
        <img
          src={cover.sm}
          srcSet={cover.srcSet}
          sizes={sizes}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`cover cover--${tone}`}>
      <PodType text={mark} tone={tone} live={live} />
      <div className="cover__meta t-mono" aria-hidden="true">
        <span>{type}</span>
        <span>{stack.slice(0, 3).join(" / ")}</span>
      </div>
    </div>
  );
}
