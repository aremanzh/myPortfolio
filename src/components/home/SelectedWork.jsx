import React from "react";
import { useProjects } from "../../data/projects";
import { useT } from "../../i18n";
import { SplitReveal } from "../Reveal";
import WorkList from "../WorkList";
import Magnetic from "../Magnetic";
import { TLink } from "../Transition";
import { ArrowUpRight } from "../Icons";

export default function SelectedWork() {
  const t = useT();
  const { featured, projects } = useProjects();
  return (
    <section className="section theme-ink pt-0">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-mono eyebrow">{t("work.eyebrow")}</p>
            <SplitReveal as="h2" className="t-display mt-8">
              {t("work.titlePre")}
              <span className="serif accent">{t("work.titleAccent")}</span>
            </SplitReveal>
          </div>
          <p className="t-mono text-[color:var(--muted)]">
            {t("work.count", {
              shown: String(featured.length).padStart(2, "0"),
              total: String(projects.length).padStart(2, "0"),
            })}
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,5rem)]">
          <WorkList projects={featured} />
        </div>

        <div className="mt-12 flex justify-center">
          <Magnetic>
            <TLink to="/works" name={t("nav.work")} className="btn t-mono">
              {t("work.all")} <ArrowUpRight />
            </TLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
