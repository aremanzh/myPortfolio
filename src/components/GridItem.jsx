import React from "react";

function GridItem(props) {
  return (
    <div
      style={{ backgroundImage: `url(${props.img})` }}
      className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center items-center mx-auto content-div"
    >
      {/* Hover Effects */}
      <div className="opacity-0 group-hover:opacity-100 text-center">
        <span className="text-2xl font-bold text-white tracking-wider">
          {props.title}
        </span>
        <p className="text-1xl font-normal text-white">
        {props.descriptions}
        </p>
        <div className="pt-8 text-center">
          <a href={props.url}>
            <button className="text-center rounded-lg px-4 py-3 m-2 bg-button-light text-secondary hover:bg-button-dark hover:text-primary-light font-bold text-lg">
              View Demo
            </button>
          </a>
          <a href={props.code}>
            <button className="text-center rounded-lg px-4 py-3 m-2 border text-white hover:bg-button-dark hover:text-primary-light hover:border-none font-bold text-lg">
              Check Code
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default GridItem;
