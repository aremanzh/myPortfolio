import React from "react";
import { TypeAnimation } from "react-type-animation";

export default function TypeText({ text1, text2, text3, style }) {
  return (
    <TypeAnimation
      sequence={[
        text1, // Types 'One'
        2000, // Waits 1s
        text2, // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        text3, // Types 'Three' without deleting 'Two'
        2000,
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      className={style}
    />
  );
}
