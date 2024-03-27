import React from "react";
import dashboard from "../assets/dashboard.png";
import { FaNodeJs, FaLaravel, FaHtml5 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { FaCss3Alt } from "react-icons/fa6";

export default function Showcase({ image, title, link, description, icon }) {
  const data = new Array(4).fill(undefined);
  console.log(data);
  return (
    <div name="project" className="w-full h-screen bg-primary">
      <div
        id="title"
        className="max-w-[1000px] sm:ml-20 lg:mx-auto px-8 flex flex-col justify-center h-full"
      >
        <div className="mb-8">
          <img
            src={dashboard}
            alt="dashboard"
            className="w-full shadow-lg rounded-lg drop-shadow-glow"
          />
          <h1 className="text-2xl md:text-4xl font-bold text-secondary-dark pt-6 pb-2 tracking-wide">
            Sistem Pengurusan Program
          </h1>
          <a href="/" className="underline text-primary-light mb-8">
            Visit website
          </a>
          <p className="text-secondary font-light leading-relaxed tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
            perferendis error est non illo vero distinctio excepturi, corporis
            dolorem velit delectus. Ipsam eius corporis cupiditate ratione,
            placeat aliquid dignissimos corrupti?
          </p>
        </div>
        <div className="flex gap-4">
          {data.map((_, index) => {
            <div className="rounded-lg bg-gray-100 w-fit p-2 drop-shadow-glow">
              {icon}
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}
