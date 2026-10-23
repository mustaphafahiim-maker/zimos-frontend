"use client";

import { useEffect } from "react";

/**
 * Reveal on scroll for the landing: every `.lz-r` fades up the first time it
 * enters the screen; bento cards stagger by column. The hiding rules only
 * apply under `html.lz-on`, which is set here — so without the script, or
 * with reduced motion, everything is simply there.
 */
export function LandingMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("lz-on");
    document.querySelectorAll<HTMLElement>(".lz-bento .lz-r").forEach((el, i) => {
      el.style.setProperty("--d", String(i % 4));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".lz-r").forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      html.classList.remove("lz-on");
    };
  }, []);

  return null;
}
