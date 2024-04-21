import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <div
      name="footer"
      className="w-full h-40 py-4 bg-secondary flex justify-center items-center p-4"
    >
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-16">
        <div className="text-base font-light">
          <p className="text-primary p-2">
            {" "}
            <span className="font-bold">Mumtaz Che Ismail,</span>
            <br></br>Presint 17, Wilayah Persekutuan Putrajaya
          </p>
          <p className="text-primary p-2 underline">Tel: +6010-911 3087</p>
        </div>
        <div className="text-base font-light grid grid-cols-3 m-2 content-end">
          <a href="https://www.linkedin.com/in/mumtaz-che-ismail/">
            <FaLinkedin className="text-4xl hover:text-button-light transition-transform transform hover:animate-flipUpside" />
          </a>
          <a href="https://github.com/aremanzh">
            <FaGithub className="text-4xl hover:text-button-light transition-transform transform hover:animate-float" />
          </a>
          <a href="https://www.instagram.com/ismi_mumtaz/">
            <FaInstagram className="text-4xl hover:text-button-light hover:animate-float" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
