import React from "react";
import { Link } from "react-router-dom";

export default function ProjectItem({
  id,
  image,
  title,
  linkTitle = "Visit website",
  link,
  description,
  icons,
  className,
}) {
  return (
    <div id={id} className={`my-8 ${className}`}>
      <div className="mb-8">
        <Link to={link}>
          <img
            src={image}
            alt="dashboard"
            className="w-full shadow-lg rounded-lg drop-shadow-glow"
          />
        </Link>
        <h1 className="uppercase text-2xl md:text-4xl font-bold text-secondary-dark pt-6 pb-2 tracking-wide">
          {title}
        </h1>
        <a href={link} className="uppercase underline text-primary-light mb-8">
          {linkTitle}
        </a>
        <p className="uppercase text-secondary font-light leading-relaxed tracking-wide">
          {description}
        </p>
      </div>
      <div className="flex gap-4">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-100 w-fit p-2 drop-shadow-glow"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
