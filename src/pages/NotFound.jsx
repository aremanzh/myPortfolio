import React, { useRef } from "react";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { TLink } from "../components/Transition";
import PodType from "../components/PodType";
import { ArrowUpRight } from "../components/Icons";
import { pageMeta } from "../lib/meta";

export const meta = () => pageMeta({ title: "Not found", noindex: true });

export default function NotFound() {
  const root = useRef(null);
  useDocumentTitle("Not found");

  useIntro(root, (tl) => {
    tl.from(".nf__type", { opacity: 0, duration: 1.6, ease: "power2.out" })
      .from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.07 }, 0.1)
      .from(".nf__fade", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5);
  });

  return (
    <section
      ref={root}
      className="theme-ink wrap flex min-h-[100svh] flex-col justify-end gap-10 pb-[clamp(3rem,6vw,6rem)] pt-28"
    >
      <div className="nf__type relative min-h-[11rem] flex-1" data-cursor="Kill pods">
        <PodType text="404" tone="ink" live fill={0.92} />
      </div>

      <div>
        <p className="nf__fade t-mono eyebrow">Error 404 / Not scheduled</p>
        <h1 className="t-display mt-6">
          <span className="line">
            <span className="line__in">
              No pod at this <span className="serif accent">address.</span>
            </span>
          </span>
        </h1>
        <div className="nf__fade mt-8 flex flex-wrap items-center gap-6">
          <p className="t-body max-w-[40ch]">
            The page you asked for was never scheduled, or it has been moved. The rest of the
            cluster is fine.
          </p>
          <TLink to="/" name="Home" className="btn btn--solid t-mono">
            Back to home <ArrowUpRight />
          </TLink>
        </div>
      </div>
    </section>
  );
}
