import React from 'react'

function SocialIcons(props,{className = ''}) {

  return (
    <li className={`w-[168px] h-[60px] flex justify-between items-center ml-[-140px] hover:ml-[-40px] duration-300 bg-button-light`}>
            <a
              className="flex justify-between items-center w-full text-primary"
              href={props.href}
            >
              {props.media} {props.icon}
            </a>
          </li>
  )
}

export default SocialIcons