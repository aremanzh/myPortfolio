import React from 'react'

function SkillsCard(props) {
  return (
    <div className='shadow-md shadow-[#040c16] hover:scale-110 duration-500'>
                <img className='w-20 mx-auto my-auto' src={props.src} alt={props.alt} />
                <p className='my-4'>{props.skills}</p>
            </div>
  )
}

export default SkillsCard