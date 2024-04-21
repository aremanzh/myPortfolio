import { React, useRef } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-scroll";
import TypeText from "./TypeText";

function Home() {
  return (
    <div name="home" className="w-full h-screen bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_60%_60%,#000_20%,transparent_100%)] opacity-20"></div>
      {/* Container */}
      <div
        id="title"
        className="max-w-[1000px] sm:ml-20 lg:mx-auto px-8 flex flex-col justify-center h-full"
      >
        <p className="text-secondary uppercase">Hi, my name is</p>
        <h1 className="nama uppercase text-4xl sm:text-7xl font-bold text-white drop-shadow-glow">
          Mumtaz Che Ismail
        </h1>
        <div className="flex">
          <h2 className="uppercase mr-4 text-4xl sm:text-6xl font-bold text-gray-400">
            I am
          </h2>
          <TypeText
            text1="FULLSTACK DEV"
            text2="A WEB DEVELOPER"
            text3="AN APP DEVELOPER"
            style={"inline-block text-4xl sm:text-6xl font-bold text-gray-400"}
          />
        </div>
        <div>
          <button className="text-secondary drop-shadow-glow bg-none border-primary-light group border px-6 py-3 my-2 flex items-center hover:text-button-light hover:bg-button-dark hover:border-button-dark">
            <Link
              to="project"
              smooth={true}
              duration={500}
              className="items-center flex uppercase"
            >
              View Project{" "}
              <span className="group-hover:rotate-90 duration-300">
                <HiArrowNarrowRight className="ml-3" />
              </span>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
