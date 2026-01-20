// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Agar URL me hash hai (e.g. /about#team) toh us element pe scroll karega (agar milta hai)
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Normal case: pura page top par le aao
    const scroller =
      document.scrollingElement || document.documentElement || document.body;
    scroller.scrollTo({ top: 0, left: 0, behavior: "smooth" }); // behavior:'auto' bhi use kar sakte ho
  }, [pathname, hash]);

  return null;
}
