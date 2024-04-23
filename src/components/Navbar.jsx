import React, { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import MenuLink from "./MenuLink";
import MenuLinkMobile from "./MenuLinkMobile";
import SocialIcons from "./SocialIcons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);
  return (
    <div className="fixed w-full h-[50px] flex justify-between items-center px-2 text-white z-50">
      <div className="flex w-full h-[50px] items-center justify-between bg-primary px-6 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border-b border-button-dark border-opacity-30">
        <div>
          <Link
            to={`/`}
            className="ml-4 font-semibold text-xl drop-shadow-glow"
          >
            {"<mumtaaz.dev/>"}
          </Link>
        </div>

        {/* menu */}
        <ul className="hidden md:flex h-full items-center">
          <MenuLink to={`/`} menu="Home" />
          <MenuLink to={`/works`} menu="Works" />
          <MenuLink to={`/contacts`} menu="Contact" />
          {/* <MenuLink to="about" menu="About" />
          <MenuLink to="skills" menu="Skills" />
          <MenuLink to="project" menu="Project" />
          <MenuLink to="contact" menu="Contact" /> */}
        </ul>
      </div>

      {/* Hamburger */}
      <div onClick={handleClick} className="md:hidden z-10 mr-4">
        {!nav ? <FaBars /> : <FaTimes />}
      </div>

      {/* Mobile Menu */}
      <ul
        className={
          !nav
            ? "hidden"
            : "absolute top-0 left-0 w-full h-screen bg-primary flex flex-col justify-center items-center"
        }
      >
        <MenuLinkMobile click={handleClick} to="home" menu="Home" />
        <MenuLinkMobile click={handleClick} to="about" menu="About" />
        <MenuLinkMobile click={handleClick} to="skills" menu="Skills" />
        <MenuLinkMobile click={handleClick} to="project" menu="Project" />
        <MenuLinkMobile click={handleClick} to="contact" menu="Contact" />
      </ul>

      {/* Social Icons */}
      <div className="hidden lg:flex fixed flex-col top-[35%] left-8">
        <ul>
          <SocialIcons
            className="bg-primary bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border-t border-r hover:border-b border-button-dark border-opacity-30"
            href="https://www.linkedin.com/in/mumtaz-che-ismail"
            media="Linkedin"
            icon={<FaLinkedin size={30} color="white" />}
          />
          <SocialIcons
            className="bg-primary bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border-t border-r hover:border-b border-button-dark border-opacity-30"
            href="https://github.com/aremanzh"
            media="Github"
            icon={<FaGithub size={30} />}
          />
          <SocialIcons
            className="bg-primary bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border-t border-r hover:border-b border-button-dark border-opacity-30"
            href="mailto:mumtaz.che.ismail@gmail.com"
            media="Email"
            icon={<HiOutlineMail size={30} />}
          />
          <SocialIcons
            className="bg-primary bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border-t border-r border-b border-button-dark border-opacity-30"
            href="/"
            media="Resume"
            icon={<BsFillPersonLinesFill size={30} />}
          />
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
