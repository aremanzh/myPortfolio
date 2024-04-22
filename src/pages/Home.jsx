import React from "react";
import Main from "../components/Home";
import Showcase from "../components/Showcase";
import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    <>
      <Main />
      <Marquee direction="right" speed={100} className={"mb-2"}>
        <h1 className="text-7xl font-bold uppercase bg-transparent overflow-hidden py-2">
          I can be a React component, multiple React components, or just some
          text.
        </h1>
      </Marquee>
      <Marquee direction="left" speed={100} className={"mb-2"}>
        <h1 className="text-7xl font-bold uppercase bg-transparent overflow-hidden py-2">
          I can be a React component, multiple React components, or just some
          text.
        </h1>
      </Marquee>
      <Showcase />
    </>
  );
}
