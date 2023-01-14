import React from 'react'
import { Link } from 'react-scroll'

function MenuLinkMobile(props) {
  return (
    <li className="py-6 text-4xl">
          <Link onClick={props.click} to={props.to} smooth={true} duration={500}>
            {props.menu}
          </Link>
        </li>
  )
}

export default MenuLinkMobile