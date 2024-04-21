import React from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-scroll";

function MenuLink(props) {
  return (
    <li className="hover:bg-button-light hover:text-secondary hover:drop-shadow-glow inline-flex duration-300">
      <Link to={props.to}>{props.menu}</Link>
    </li>
  );
}

export default MenuLink;
