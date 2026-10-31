"use client";
import { useRef } from "react";
export default function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const r = useRef<HTMLDivElement>(null);
  return (
    <div ref={r} onMouseMove={(e) => { const b = r.current!.getBoundingClientRect(); r.current!.style.setProperty("--x", `${e.clientX - b.left}px`); r.current!.style.setProperty("--y", `${e.clientY - b.top}px`); }} className={`card group relative overflow-hidden p-6 transition-colors hover:border-line-strong ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(240px circle at var(--x) var(--y), rgba(255,255,255,.07), transparent 70%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
