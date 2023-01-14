import React from "react";

function About() {
  return (
    <div name="about" className="w-full h-screen bg-primary text-primary-light">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-right pb-8 pl-4">
            <p className="text-4xl font-bold inline border-b-4 border-button-light">
              About Me
            </p>
          </div>
          <div></div>
        </div>
        <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
          <div className="sm:text-right text-4xl font-bold">
            <p className="text-secondary-dark">Hi, I'm <span className="text-primary-light">Mumtaz</span>, nice to meet you. Please take a look around.</p>
          </div>
          <div>
            <p className="text-secondary-dark">
            Highly self-motivated and goal-oriented professional committed to pursuing a long-term career change in computer graphics and web development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
