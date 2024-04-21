import About from "./components/About_2";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Work from "./components/Work";
import Footer from "./components/Footer";
import AnimatedCursor from "react-animated-cursor";
import Showcase from "./components/Showcase";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      {/* <AnimatedCursor
        color="177, 173, 208"
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={1.2}
        outerAlpha={0}
        outerStyle={{
          border: "3px solid #B1ADD0",
        }}
      /> */}
      <AnimatedCursor
        color="1,555,333"
        innerSize={8}
        outerSize={45}
        innerScale={1.3}
        outerScale={1.7}
        outerAlpha={1}
        innerStyle={{ color: "white" }}
        outerStyle={{ mixBlendMode: "exclusion", color: "white" }}
        trailingSpeed={3}
        clickables={[
          "a",
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          "label[for]",
          "select",
          "textarea",
          "button",
          ".link",
        ]}
      />
      <Navbar />
      <Outlet />
      <Footer />
      {/* <Home />
      <Showcase />
      <About />
      <Skills />
      <Work />
      <Contact />
      <Footer /> */}
    </>
  );
}

export default App;
