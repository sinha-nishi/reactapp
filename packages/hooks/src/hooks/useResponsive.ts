import { useState, useEffect } from "react";

/**
 * breakpoints: sm, md, lg
 *
 * @returns
 */
export function useResponsive() {
  const [small, setSmall] = useState(window.innerWidth <= 768);
  const [medium, setMedium] = useState(
    window.innerWidth > 768 && window.innerWidth < 992
  );
  const [large, setLarge] = useState(window.innerWidth > 992);

  useEffect(() => {
    const smallMql = window.matchMedia("(max-width: 767.98px)");
    const mediumMql = window.matchMedia(
      "(min-width: 768px) and (max-width: 991.98px)"
    );
    const largeMql = window.matchMedia("(min-width: 992px)");

    function smallScreenTest(e: MediaQueryListEvent) {
      if (e.matches) {
        setSmall(true);
        setMedium(false);
        setLarge(false);
      } else {
        setSmall(false);
      }
    }

    function mediumScreenTest(e: MediaQueryListEvent) {
      if (e.matches) {
        setSmall(false);
        setMedium(true);
        setLarge(false);
      } else {
        setMedium(false);
      }
    }

    function largeScreenTest(e: MediaQueryListEvent) {
      if (e.matches) {
        setSmall(false);
        setMedium(false);
        setLarge(true);
      } else {
        setLarge(false);
      }
    }

    smallMql.addEventListener("change", smallScreenTest);
    mediumMql.addEventListener("change", mediumScreenTest);
    largeMql.addEventListener("change", largeScreenTest);
    return () => {
      smallMql.removeEventListener("change", smallScreenTest);
      mediumMql.removeEventListener("change", mediumScreenTest);
      largeMql.removeEventListener("change", largeScreenTest);
    };
  }, []);

  return [small, medium, large];
}
