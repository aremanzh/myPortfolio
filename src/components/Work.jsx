import React from 'react';
// import WorkImg from '../assets/workImg.jpeg';
import wordpressImg from '../assets/gobosku_ecommerce_mockup.jpg';
import blogImg from '../assets/anonymous_blog_mockup.jpg';
import weatherImg from '../assets/weather_visualisation_mockup.jpg';
import comingSoon from '../assets/coming_soon.jpg';
import GridItem from './GridItem';

const Work = () => {
  return (
    <div name='project' className='w-full md:h-screen text-primary-light bg-primary'>
      <div className='max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full'>
        <div className='pb-8'>
          <p className='text-4xl font-bold inline border-b-4 border-secondary'>
            Project
          </p>
          <p className='py-6 text-secondary'>Check out some of my personal project</p>
        </div>

{/* Container */}
        <div className='grid sm:grid-cols-2 md:grid-cols-2 gap-4'>
            {/* Grid Item */}
          <GridItem img={wordpressImg} title="Woocommerce" descriptions="An Ecommerce website using wordpress" url="https://gobosku.mumtaz.ml" code="#"/>
          <GridItem img={blogImg} title="Anonymous Blog" descriptions="A concept blog web app for everyone!" url="https://blog.mumtaaz.xyz" code="https://github.com/aremanzh/anonymous-blog"/>
          <GridItem img={comingSoon} title="Landing Page" descriptions="A concept website for email newsletter" url="/" code="https://github.com/"/>
          <GridItem img={weatherImg} title="Weather App" descriptions="A simple Weather API visualization" url="https://weather.mumtaaz.xyz" code="https://github.com/aremanzh/SimpleWeatherStatus"/>
        </div>
      </div>
    </div>
  );
};

export default Work;