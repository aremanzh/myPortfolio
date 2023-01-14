import React from 'react'

function Contact() {
  return (
    <div name='contact' className='w-full h-[90vh] bg-primary flex justify-center items-center p-4'>
        <form method='POST' action="https://getform.io/f/0ba479c0-db9e-4462-b74c-c445d2652a3b" className='flex flex-col max-w-[600px] w-full'>
            <div className='pb-8'>
                <p className='text-4xl font-bold inline border-b-4 border-secondary text-primary-light'>Contact</p>
                <p className='text-secondary py-4'>Submit the form below or shoot me an email</p>
            </div>
            <input className='bg-[#ccd6f6] p-2' type="text" placeholder='Name' name='name' required/>
            <input className='my-4 p-2 bg-[#ccd6f6]' type="email" placeholder='Email' name='email' required/>
            <textarea className='bg-[#ccd6f6] p-2' name="message" rows="10" placeholder='Message' required></textarea>
            <button className='text-secondary bg-button-light border-button-light border-2 hover:text-primary-light hover:bg-button-dark hover:border-button-dark px-4 py-3 my-8 mx-auto flex items-center'>Let's Collaborate</button>
        </form>
    </div>
  )
}

export default Contact