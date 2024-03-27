import React from "react";
import { Link } from "react-scroll";

function MenuLink(props) {
  return (
    <li className="hover:bg-button-light hover:text-secondary hover:drop-shadow-glow inline-flex duration-300">
      <Link
        to={props.to}
        activeClass="active"
        spy={true}
        smooth={true}
        duration={500}
      >
        {props.menu}
      </Link>
    </li>
  );
}

export default MenuLink;
