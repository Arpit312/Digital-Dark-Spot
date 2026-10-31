"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
export default function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => { if (!inView) return; const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}
