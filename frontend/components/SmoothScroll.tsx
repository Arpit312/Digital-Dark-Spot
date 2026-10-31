"use client";
import { useEffect } from "react";
import Lenis from "lenis";
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.1 });
    let id = 0;
    const raf = (t: number) => { l.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); };
  }, []);
  return <>{children}</>;
}
