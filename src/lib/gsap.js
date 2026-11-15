import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Route changes always land at the top (the page transition handles it), so
// the browser must not restore old scroll positions on back/forward. This has
// to go through ScrollTrigger: it owns history.scrollRestoration and re-applies
// its own value after every refresh, so setting the property directly is undone.
ScrollTrigger.clearScrollMemory("manual");

export { gsap, ScrollTrigger, SplitText, useGSAP };
