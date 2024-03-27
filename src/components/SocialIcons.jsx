import React from "react";

function SocialIcons(props) {
  return (
    <li
      className={`w-[168px] h-[60px] flex justify-between items-center ml-[-140px] hover:ml-[-40px] duration-300 ${props.className}`}
    >
      <a
        className={`flex justify-between items-center w-full ${props.color}`}
        href={props.href}
      >
        {props.media} {props.icon}
      </a>
    </li>
  );
}

export default SocialIcons;
