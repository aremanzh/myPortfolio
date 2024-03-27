import React from "react";

import HTML from "../assets/html.png";
import CSS from "../assets/css.png";
import JavaScript from "../assets/javascript.png";
import ReactImg from "../assets/react.png";
import Node from "../assets/node.png";
import GitHub from "../assets/github.png";
import Mongo from "../assets/mongo.png";
import JQuery from "../assets/jquery.png";
import SkillsCard from "./SkillsCard";

function Skills() {
  return (
    <div
      name="skills"
      className="w-full h-screen bg-primary text-primary-light"
    >
      {/* Container */}
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
        <div>
          <p className="text-4xl font-bold inline border-b-4 border-secondary drop-shadow-glow">
            Skills
          </p>
          <p className="py-4 text-secondary">
            These are the technologies I've experience working with
          </p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center py-8">
          <SkillsCard src={HTML} alt="HTML Icon" skills="HTML" />
          <SkillsCard src={CSS} alt="CSS Icon" skills="CSS" />
          <SkillsCard
            src={JavaScript}
            alt="Javascript Icon"
            skills="Javascript"
          />
          <SkillsCard src={JQuery} alt="JQuery Icon" skills="JQuery" />
          <SkillsCard src={ReactImg} alt="React Icon" skills="React" />
          <SkillsCard src={Node} alt="Node Icon" skills="Node JS" />
          <SkillsCard src={Mongo} alt="Mongo Icon" skills="Mongo DB" />
          <SkillsCard src={GitHub} alt="Github Icon" skills="Github" />
        </div>
      </div>
    </div>
  );
}

export default Skills;
