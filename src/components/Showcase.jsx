import React, { useRef } from "react";
import ProjectItem from "./ProjectItem";
import dashboard from "../assets/dashboard.png";

import { FaNodeJs, FaLaravel, FaHtml5 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { FaCss3Alt } from "react-icons/fa6";
import { FaReact } from "react-icons/fa";

// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";
// gsap.registerPlugin(useGSAP);

export default function Showcase({ id }) {
  const container = useRef();
  // useGSAP(
  //   () => {
  //     // gsap code here...
  //     gsap.from(".work", {
  //       marker: true,
  //       markerStart: "bottom start",
  //       markerEnd: "100%",
  //       opacity: 0,
  //       duration: 1,
  //       delay: 0.5,
  //       stagger: {
  //         each: 0.2,
  //       },
  //     }); // <-- automatically reverted
  //   },
  //   { scope: container }
  // ); // <-- scope is for selector text (optional)
  return (
    <div
      ref={container}
      name="project"
      id={id}
      className="project w-full h-full bg-primary py-16"
    >
      <div
        id="sss"
        className="lg:max-w-[1000px] mx-20 lg:mx-auto lg:px-8 flex flex-col justify-center h-full"
      >
        <ProjectItem
          id="project-item"
          image={dashboard}
          title="Sistem Pengurusan Program"
          linkTitle="Learn more"
          description="A concept blog web app for everyone!"
          icons={[
            <FaLaravel key="laravel" size={24} color="red" />,
            <SiTailwindcss key="tailwind" size={24} color="cyan" />,
            <FaHtml5 key="html5" size={24} color="orange" />,
          ]}
          link="/sistem-pengurusan-program"
          className="work"
        />
        <ProjectItem
          id="project-item"
          image={dashboard}
          title="Sistem Perkongsian Fail Multimedia"
          linkTitle="Learn more"
          description="A concept blog web app for everyone!"
          icons={[
            <FaLaravel key="laravel" size={24} color="red" />,
            <FaReact key="tailwind" size={24} color="cyan" />,
            <FaHtml5 key="html5" size={24} color="orange" />,
          ]}
          link="/sistem-pengurusan-program"
          className="work"
        />
      </div>
    </div>
  );
}
