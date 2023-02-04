import {React, useCallback} from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-scroll";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function Home() {
  
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
}, []);

const particlesLoaded = useCallback(async container => {
    await console.log(container);
}, []);

   return (
    <div name="home" className="w-full h-screen">
      {/* Container */}
      <div id="title" className="max-w-[1000px] sm:ml-20 lg:mx-auto px-8 flex flex-col justify-center h-full">

      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            width="100%"
            height="100vh"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
            options={{
                fullScreen: {
                  enable: false,
                },
                background: {
                    color: {
                        value: "#141414",
                    },
                },
                interactivity: {
                    detectsOn: "window",
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.4,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        enable: true,
                        speed: {min: 0.5, max: 1},
                        directions: "none",
                        random: false,
                        straight: false,
                        outModes: {
                            default: "out",
                        },
                        attract: {
                          enable: false,
                          rotateX: 600,
                          rotateY: 1200,
                        }
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.1,
                        random: true,
                        anim: {
                          enable: false,
                          speed: 1,
                          opacity_min: 0.1,
                          sync: false,
                        }
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                          width: 0,
                          color: "#000000",
                        }, 
                        polygon: {
                          nb_sides: 5,
                        },
                        image: {
                          src: "../assets/header.png",
                          width: 100,
                          height: 100,
                        }
                    },
                    size: {
                        value: { min: 1, max: 3 },
                        random: true,
                        anim: {
                          enable: false,
                          speed: 40,
                          size_min: 0.1,
                          sync: false,
                        }
                    },
                    zIndex: 0,
                },
                detectRetina: true,
            }}
        />
        
        {/* <div ref={pic} className="absolute sm:right-10"><img src={mumtaz} alt="" className="w-96"/></div> */}
        <p className="text-secondary">Hi, my name is</p>
        <h1 className="text-4xl sm:text-7xl font-bold text-primary-light">
          Mumtaz Che Ismail
        </h1>
        <h2 className="text-4xl sm:text-6xl font-bold text-secondary-dark">
          I'm a Web Developer
        </h2>
        <div>
          <button className="text-secondary bg-none border-primary-light group border-2 px-6 py-3 my-2 flex items-center hover:text-primary-light hover:bg-button-dark hover:border-button-dark">
          <Link to="project" smooth={true} duration={500}>
          View Project{" "}
          </Link>
            
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-3" />
            </span>
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
