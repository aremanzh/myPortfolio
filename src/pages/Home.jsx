import React from "react";
import { useDocumentTitle } from "../lib/hooks";
import { marquee } from "../data/site";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Pipeline from "../components/home/Pipeline";
import SelectedWork from "../components/home/SelectedWork";
import VelocityMarquee from "../components/VelocityMarquee";

export default function Home() {
  useDocumentTitle("");

  return (
    <>
      <Hero />
      <About />
      <div className="theme-ink t-display grid gap-2 pt-[clamp(4rem,8vw,8rem)]">
        <VelocityMarquee items={marquee} direction={-1} />
        <VelocityMarquee items={[...marquee].reverse()} direction={1} outline />
      </div>
      <Pipeline />
      <SelectedWork />
    </>
  );
}
