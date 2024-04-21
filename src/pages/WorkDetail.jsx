import React, { useRef } from "react";
import { TbArrowDownRight } from "react-icons/tb";
import { Link } from "react-scroll";
import mumtaz from "../assets/mumtaz.jpg";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

export default function WorkDetail() {
  const item = {
    id: 1,
    title: "london royal theater",
    category: "branding",
    cover: mumtaz,
  };
  return (
    <>
      <div name="work-section" className="pt-32 pb-16 w-full bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_60%_60%,#000_20%,transparent_100%)] opacity-20"></div>
        <div
          id="hero"
          className="max-w-[1000px] ml-4 lg:mx-auto px-8 flex flex-col justify-center h-full"
        >
          <div className="hero-wrapper pt-28 ">
            <div className="hero-title flex flex-col">
              <span className="uppercase text-7xl lg:text-9xl font-bold text-white drop-shadow-glow">
                project
              </span>
              <span className="uppercase text-7xl lg:ml-52 lg:text-9xl font-bold text-white drop-shadow-glow">
                name
              </span>
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
                      share project
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          name="main"
          className="content-wrapper max-w-full  lg:mx-auto flex flex-col justify-center h-screen"
        >
          <div id="itemsWrapperLinks" className="z-10">
            <div className="portfolio-wrapper ladder-grid">
              <div className="portfolio lg:justify-between">
                <div className="portfolio-item hover:animate-float h-screen">
                  <div className="item-parallex">
                    <div className="item-appear">
                      <div className="item-content">
                        <img
                          key={item.id}
                          src={item.cover || null}
                          className="w-full max-h-[60rem] object-cover object-top rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
