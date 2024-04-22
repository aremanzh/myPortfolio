import React, { useRef } from "react";
import mumtaz from "../assets/mumtaz.jpg";
import dash from "../assets/dashboard.png";
import boskue from "../assets/gobosku_ecommerce_mockup.jpg";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
gsap.registerPlugin(useGSAP);

export default function LadderGrid() {
  const container = useRef();
  useGSAP(
    () => {
      // gsap code here...
      let tl = gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
          trigger: ".portfolio-item",
          opacity: 0,
          duration: 1,
          delay: 0.5,
          stagger: {
            each: 0.2,
          },
        },
      });

      // add animations and labels to the timeline
      tl.addLabel("start")
        .from(".portfolio-item", {
          opacity: 0,
          stagger: true,
          y: 20,
        })
        .addLabel("color")
        .to(".portfolio-item", {
          opacity: 100,
          duration: 1,
          y: 0,
          stagger: true,
        })
        .addLabel("end");
    },
    { scope: container }
  ); // <-- scope is for selector text (optional)

  const item = {
    id: 1,
    title: "london royal theater",
    category: "branding",
    cover: mumtaz,
  };

  return (
    <div ref={container} id="itemsWrapperLinks" className="z-10">
      <div className="portfolio-wrapper ladder-grid">
        <div className="portfolio relative lg:justify-between lg:h-[96rem]">
          <div className="portfolio-item lg:absolute hover:animate-float">
            <div className="item-parallex">
              <div className="item-appear">
                <div className="item-content">
                  <Link to={`1`}>
                    <img
                      key={item.id}
                      src={item.cover || null}
                      className="w-[38rem] max-h-[34rem] object-cover object-top rounded-xl"
                    />
                  </Link>
                </div>
                <div className="item-caption py-4">
                  <div className="item-title">
                    <h5 className="uppercase text-sm lg:text-xl font-medium text-white drop-shadow-glow">
                      {item.title ? <>{item.title}</> : <span>No Title</span>}
                    </h5>
                  </div>
                  <div className="item-category">
                    <p className="uppercase text-sm lg:text-lg font-medium text-gray-400 drop-shadow-glow">
                      {item.category ? (
                        <>{item.category}</>
                      ) : (
                        <span>No Category</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="portfolio-item lg:absolute top-[28rem] right-0 hover:animate-float">
            <div className="item-parallex">
              <div className="item-appear">
                <div className="item-content">
                  <a href="#">
                    <img
                      src={dash}
                      className="w-[38rem] max-h-[34rem] object-cover object-top rounded-xl"
                    />
                  </a>
                </div>
                <div className="item-caption py-4">
                  <div className="item-title">
                    <h5 className="uppercase text-sm lg:text-xl font-medium text-white drop-shadow-glow">
                      london royal theater
                    </h5>
                  </div>
                  <div className="item-category">
                    <p className="uppercase text-sm lg:text-lg font-medium text-gray-400 drop-shadow-glow">
                      branding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="portfolio-item lg:absolute top-[46rem] left-32 hover:animate-float">
            <div className="item-parallex">
              <div className="item-appear">
                <div className="item-content">
                  <a href="#">
                    <img
                      src={boskue}
                      className="w-[38rem] max-h-[34rem] object-cover object-top rounded-xl"
                    />
                  </a>
                </div>
                <div className="item-caption py-4">
                  <div className="item-title">
                    <h5 className="uppercase text-sm lg:text-xl font-medium text-white drop-shadow-glow">
                      london royal theater
                    </h5>
                  </div>
                  <div className="item-category">
                    <p className="uppercase text-sm lg:text-lg font-medium text-gray-400 drop-shadow-glow">
                      branding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
