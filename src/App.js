import About from "./components/About_2";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Work from "./components/Work";
import Footer from "./components/Footer";
import AnimatedCursor from "react-animated-cursor";
import Showcase from "./components/Showcase";

function App() {
  return (
    <>
      <AnimatedCursor
        color="177, 173, 208"
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={1.7}
        outerAlpha={0}
        outerStyle={{
          border: "3px solid #B1ADD0",
        }}
      />
      <Navbar />
      <Home />
      <Showcase />
      {/* <About />
      <Skills />
      <Work />
      <Contact />
      <Footer /> */}
    </>
  );
}

export default App;
