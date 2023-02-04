import React, { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import Logo from "../assets/2.png";
import MenuLink from "./MenuLink";
import MenuLinkMobile from "./MenuLinkMobile";
import SocialIcons from "./SocialIcons";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);
  return (
    <div className="fixed w-full h-[80px] bg-[#f19226] flex justify-between items-center px-2 text-white z-50">
      <div>
        <img src={Logo} alt="Logo" style={{ width: "128px" }}/>
      </div>

      {/* menu */}
      <ul className="hidden md:flex">
        <MenuLink to="home" menu="Home"/>
        <MenuLink to="about" menu="About"/>
        <MenuLink to="skills" menu="Skills"/>
        <MenuLink to="project" menu="Project"/>
        <MenuLink to="contact" menu="Contact"/>
      </ul>

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
        <MenuLinkMobile click={handleClick} to="home" menu="Home"/>
        <MenuLinkMobile click={handleClick} to="about" menu="About"/>
        <MenuLinkMobile click={handleClick} to="skills" menu="Skills"/>
        <MenuLinkMobile click={handleClick} to="project" menu="Project"/>
        <MenuLinkMobile click={handleClick} to="contact" menu="Contact"/>
      </ul>

      {/* Social Icons */}
      <div className="hidden lg:flex fixed flex-col top-[35%] left-8">
        <ul>
          <SocialIcons className="bg-blue-600" href="https://www.linkedin.com/in/mumtaz-che-ismail
" media="Linkedin" icon={<FaLinkedin size={30}/>} />
          <SocialIcons className="bg-[#333333]" href="https://github.com/aremanzh" media="Github" icon={<FaGithub size={30}/>} />
          <SocialIcons className="bg-[#6fc2b0]" href="mailto:mumtaz.che.ismail@gmail.com" media="Email" icon={<HiOutlineMail size={30}/>} />
          <SocialIcons className="bg-[#565f69]" href="/" media="Resume" icon={<BsFillPersonLinesFill size={30}/>} />
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
