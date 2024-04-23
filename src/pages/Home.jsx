import React, { useRef } from "react";
import Main from "../components/Home";
import Showcase from "../components/Showcase";
import Marquee from "react-fast-marquee";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef();
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          markers: true,
          scrub: 1,
          trigger: "#showcase",
          start: "-20% 20%",
          endTrigger: "#showcase",
          end: "40% 40%",
        },
      });

      const hero = gsap.timeline({
        scrollTrigger: {
          markers: true,
          scrub: 1,
          trigger: "#hero",
          start: "20% start",
          endTrigger: "#hero",
          end: "55% end",
        },
      });
      const marquee = gsap.timeline({
        scrollTrigger: {
          trigger: ".marquee-text",
          markers: true,
          start: "top bottom",
          end: "bottom+=10 top",
          scrub: true,
        },
      });

      hero.to("#title", { opacity: 0 });

      tl.from(".work", { opacity: 0 });

      marquee
        .fromTo("#first-marquee", { x: "20%" }, { x: "0%" }, 0)
        .fromTo("#second-marquee", { x: "-20%" }, { x: "0%" }, 0);
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <Main id="hero" />
      <div className="marquee-text">
        <Marquee
          direction="right"
          speed={100}
          className={"bg-primary text-secondary-dark"}
          play={false}
        >
          <h1
            id="first-marquee"
            className="text-7xl font-bold uppercase bg-transparent overflow-hidden py-2"
          >
            I can be a React component, multiple React components, or just some
            text.
          </h1>
        </Marquee>
        <Marquee
          direction="left"
          speed={100}
          className={"bg-primary text-secondary-dark"}
          play={false}
        >
          <h1
            id="second-marquee"
            className="text-7xl font-bold uppercase bg-transparent overflow-hidden py-2"
          >
            I can be a React component, multiple React components, or just some
            text.
          </h1>
        </Marquee>
      </div>
      <Showcase id="showcase" />
    </div>
  );
}
