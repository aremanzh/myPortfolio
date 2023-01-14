import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-scroll";

function Home() {
   return (
    <div name="home" className="w-full h-screen bg-primary">
      {/* Container */}
      <div id="title" className="max-w-[1000px] sm:ml-20 lg:mx-auto px-8 flex flex-col justify-center h-full">
        {/* <div ref={pic} className="absolute sm:right-10"><img src={mumtaz} alt="" className="w-96"/></div> */}
        <p className="text-secondary">Hi, my name is</p>
        <h1 className="text-4xl sm:text-7xl font-bold text-primary-light">
          Mumtaz Che Ismail
        </h1>
        <h2 className="text-4xl sm:text-6xl font-bold text-secondary-dark">
          I'm a Web Developer
        </h2>
        <div>
          <button className="text-secondary bg-none border-primary-light group border-2 px-6 py-3 my-2 flex items-center hover:text-primary-light hover:bg-button-dark hover:border-button-dark">
          <Link to="project" smooth={true} duration={500}>
          View Project{" "}
          </Link>
            
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-3" />
            </span>
          </button>
        </div>
      </div>
      {/* <div className="absolute top-0 left-0 w-full h-full bg-secondary circle md:circleMD lg:circleLG"></div> */}
    </div>
  );
}

export default Home;
