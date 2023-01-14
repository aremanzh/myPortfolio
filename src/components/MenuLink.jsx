import React from 'react'
import { Link } from 'react-scroll'

function MenuLink(props) {
  return (
    <li className="hover:bg-button-dark hover:text-primary-light"><Link to={props.to} activeClass="active" spy={true} smooth={true} duration={500}>{props.menu}</Link></li>
  )
}

export default MenuLink