import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { normalizePath, reducedMotion } from "../lib/env";
import { scrollToTarget } from "../lib/scroll";

// useLayoutEffect warns when the page is prerendered; it only matters in the browser.
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const TransitionContext = createContext({ go: () => {} });

// Read by page intros so they start as the curtain lifts, not behind it.
let covering = false;
export const introDelay = () => (covering ? 0.45 : 0.05);

function splitTarget(to) {
  const [path, hash] = to.split("#");
  return { path: path || "/", hash: hash ? `#${hash}` : "" };
}

/**
 * Route changes go through a curtain: cover, swap the route underneath,
 * reveal. Back/forward and reduced-motion visitors skip the curtain and just
 * get the new page at the top.
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlay = useRef(null);
  const label = useRef(null);
  const busy = useRef(false);

  const go = useCallback(
    (to, name = "") => {
      const { path, hash } = splitTarget(to);

      if (normalizePath(path) === normalizePath(location.pathname)) {
        scrollToTarget(hash || 0);
        return;
      }
      if (busy.current) return;

      if (reducedMotion) {
        navigate(to);
        return;
      }

      busy.current = true;
      label.current.textContent = name;
      gsap
        .timeline()
        .set(overlay.current, { display: "grid", yPercent: 100 })
        .fromTo(label.current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.2)
        .to(overlay.current, { yPercent: 0, duration: 0.7, ease: "power4.inOut" }, 0)
        .add(() => {
          covering = true;
          navigate(to);
        });
    },
    [location.pathname, navigate]
  );

  useBrowserLayoutEffect(() => {
    const target = location.hash && document.querySelector(location.hash);
    scrollToTarget(target || 0, { immediate: true });

    // Layout of the new page is in place; let ScrollTrigger measure it.
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    if (covering) {
      gsap.to(overlay.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.15,
        onStart: () => {
          covering = false;
        },
        onComplete: () => {
          gsap.set(overlay.current, { display: "none" });
          busy.current = false;
        },
      });
    }

    return () => cancelAnimationFrame(refresh);
  }, [location.pathname, location.hash]);

  const value = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={overlay} className="curtain" aria-hidden="true">
        <span ref={label} className="curtain__label serif" />
      </div>
    </TransitionContext.Provider>
  );
}

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Drop-in for router <Link>. Modified clicks (new tab, etc.) keep their
 * native behaviour.
 */
export function TLink({ to, name, onClick, children, ...rest }) {
  const { go } = usePageTransition();

  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    go(to, name);
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
