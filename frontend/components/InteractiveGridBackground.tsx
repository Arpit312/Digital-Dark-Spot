"use client";

import { useEffect, useState, useRef } from "react";

export default function InteractiveGridBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // Use ref for smooth animation loop
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!hasMoved) setHasMoved(true);

      // Calculate parallax movement offset relative to screen center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Movable grid delta (smooth subtle shift following cursor movement)
      targetOffset.current = {
        x: (e.clientX - centerX) * 0.03,
        y: (e.clientY - centerY) * 0.03,
      };
    };

    // Smooth Lerp loop for fluid physics
    const loop = () => {
      const ease = 0.08;
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * ease;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * ease;

      setOffset({
        x: currentOffset.current.x,
        y: currentOffset.current.y,
      });

      animFrameId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [hasMoved]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* 1. Base Subtle Ambient Grid (always visible across all pages) */}
      <div
        className="absolute inset-[-60px] opacity-[0.04]"
        style={{
          transform: `translate3d(${offset.x * 0.5}px, ${offset.y * 0.5}px, 0)`,
          willChange: "transform",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* 2. Dynamic Cursor-Responsive Grid Layer (shifts and illuminates with cursor) */}
      <div
        className="absolute inset-[-60px] transition-opacity duration-700"
        style={{
          transform: `translate3d(${offset.x * 1.2}px, ${offset.y * 1.2}px, 0)`,
          willChange: "transform",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          opacity: hasMoved ? 0.14 : 0,
        }}
      />

      {/* 3. Soft Ambient Spotlight Glow tracking cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.035), transparent 75%)`,
          opacity: hasMoved ? 1 : 0,
        }}
      />

      {/* 4. Elegant vignette edge fade so grid blends seamlessly into borders */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />
    </div>
  );
}
