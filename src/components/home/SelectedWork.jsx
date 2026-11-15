import React from "react";
import { featured, projects } from "../../data/projects";
import { SplitReveal } from "../Reveal";
import WorkList from "../WorkList";
import Magnetic from "../Magnetic";
import { TLink } from "../Transition";
import { ArrowUpRight } from "../Icons";

export default function SelectedWork() {
  return (
    <section className="section theme-ink pt-0">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-mono eyebrow">Selected work</p>
            <SplitReveal as="h2" className="t-display mt-8">
              Things I’ve <span className="serif accent">shipped.</span>
            </SplitReveal>
          </div>
          <p className="t-mono text-[color:var(--muted)]">
            {String(featured.length).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,5rem)]">
          <WorkList projects={featured} />
        </div>

        <div className="mt-12 flex justify-center">
          <Magnetic>
            <TLink to="/works" name="Work" className="btn t-mono">
              All projects <ArrowUpRight />
            </TLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
