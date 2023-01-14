import React from "react";
import mumtaz from '../assets/mumtaz.jpg';

function About() {

  return (
    <div name='about' className='w-full h-screen bg-primary flex justify-center items-center p-4'>
      <div className='max-w-[1000px] mx-auto p-4 flex flex-col sm:flex-row justify-center w-full h-full'>
        <div className="p-4 relative sm:h-[40.8rem] sm:ml-[6rem] sm:mr-6 sm:w-[73.8rem] h-[20rem] w-full mb-4">
          <img className="h-full left-0 absolute sm:top-20 w-full object-cover object-top" src={mumtaz} alt="mumtaz" />
        </div>
        <div className="mx-auto p-4 flex flex-col justify-center">
          <div className='pb-4'>
            <p className='text-4xl font-bold inline border-b-4 border-secondary text-primary-light'>About Me</p>
            <p className='text-gray-400 py-4'>Highly self-motivated and goal-oriented professional committed to pursuing a long-term career change in computer graphics and web development.</p>
          </div>

          <div className='pb-8'>
            <p className='text-gray-400 text-sm py-2'><b>Jabatan Komunikasi Komuniti - 2022</b> <br/>Graphic Designer MySTEP<br/>|</p>
            <p className='text-gray-400 text-sm py-2'><b>Lembaga Peperiksaan - 2021</b> <br/> Personel MySTEP<br/>|</p>
            <p className='text-gray-400 text-sm py-2'><b>Universiti Sains Malaysia - 2020</b> <br/>Bachelor Degree of Fine Arts<br/> (New Media Design & Technology)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
