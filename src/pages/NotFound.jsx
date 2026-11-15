import React, { useRef } from "react";
import { useDocumentTitle, useIntro } from "../lib/hooks";
import { TLink } from "../components/Transition";
import { ArrowUpRight } from "../components/Icons";

export default function NotFound() {
  const root = useRef(null);
  useDocumentTitle("Not found");

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.1 }).from(
      ".nf__fade",
      { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 },
      0.5
    );
  });

  return (
    <section ref={root} className="theme-ink wrap flex min-h-[100svh] flex-col justify-end pb-[clamp(3rem,6vw,6rem)] pt-32">
      <p className="nf__fade t-mono eyebrow">Error 404 / Not scheduled</p>
      <h1 className="t-mega mt-8">
        <span className="line">
          <span className="line__in">No pod</span>
        </span>
        <span className="line">
          <span className="line__in">
            at this <span className="serif accent">address.</span>
          </span>
        </span>
      </h1>
      <div className="nf__fade mt-10 flex flex-wrap items-center gap-6">
        <p className="t-body max-w-[40ch]">
          The page you asked for was never scheduled, or it has been moved. The rest of the
          cluster is fine.
        </p>
        <TLink to="/" name="Home" className="btn btn--solid t-mono">
          Back to home <ArrowUpRight />
        </TLink>
      </div>
    </section>
  );
}
