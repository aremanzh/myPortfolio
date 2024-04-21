import React, { useRef } from "react";
import { TbArrowDownRight } from "react-icons/tb";
import { Link } from "react-scroll";
import LadderGrid from "../components/LadderGrid";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

export default function Work() {
  const container = useRef();
  useGSAP(
    () => {
      // gsap code here...
      let tl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
          trigger: ".hero-wrapper",
          start: "0%",
          end: "100%",
          pin: true,
          pinSpacing: false,
        },
      });

      const tlH = gsap.timeline({
        scrollTrigger: {
          trigger: ".content-wrapper",
          markers: { startColor: "pink", endColor: "pink" },
          scrub: true,
          start: "-20%",
          end: "100%",
        },
      });
    },
    { scope: container }
  ); // <-- scope is for selector text (optional)
  return (
    <>
      <div
        ref={container}
        name="work-section"
        className="pt-32 pb-16 w-full bg-primary"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_60%_60%,#000_20%,transparent_100%)] opacity-20"></div>
        {/* Container */}
        <div
          id="hero"
          className="max-w-[1000px] ml-4 lg:mx-auto px-8 flex flex-col justify-center h-full"
        >
          <div className="hero-wrapper py-28 ">
            <div className="hero-title flex flex-col">
              <span className="uppercase text-7xl lg:text-9xl font-bold text-white drop-shadow-glow">
                My
              </span>
              <span className="uppercase text-7xl lg:ml-52 lg:text-9xl font-bold text-white drop-shadow-glow">
                Works
              </span>
            </div>
            <div className="lg:relative lg:-top-28">
              <div className="hero-subtitle-wrapper lg:absolute">
                <h5 className="hero-subtitle lg:max-w-52 lg:mb-8 p-2">
                  <span className="uppercase text-sm lg:text-sm font-light text-white drop-shadow-glow">
                    Just a design and strategy developer with an adaptive
                    approach to problem solving
                  </span>
                </h5>
              </div>
            </div>
            <div className="hero-footer h-20 py-20 flex justify-between">
              <div className="hero-footer-left">
                <div className="button-wrap-scroll hover:animate-flipUpside">
                  <div className="button-text block">
                    <Link
                      to="main"
                      smooth={true}
                      duration={500}
                      className="flex items-center"
                    >
                      <div className="btn-text">
                        <h5 className="uppercase text-sm lg:text-sm font-light text-white drop-shadow-glow">
                          Scroll to explore
                        </h5>
                      </div>
                      <div className="btn-icon ml-4">
                        <TbArrowDownRight size={25} className="text-white" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hero-footer-left">
                <div className="button-text ">
                  <div className="btn-text hover:animate-float">
                    <h5 className="uppercase text-sm lg:text-sm font-light text-white drop-shadow-glow">
                      All projects (03)
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          name="main"
          className="content-wrapper max-w-[1500px] ml-4 lg:mx-auto px-8 flex flex-col justify-center h-full"
        >
          <LadderGrid />
        </div>
      </div>
    </>
  );
}
