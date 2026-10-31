"use client";

import { useEffect, useRef } from "react";

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth lerp interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 280,
    };

    // Parallax grid offset
    const gridOffset = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Subtle parallax shift
      const centerX = width / 2;
      const centerY = height / 2;
      gridOffset.targetX = ((e.clientX - centerX) / centerX) * 24;
      gridOffset.targetY = ((e.clientY - centerY) / centerY) * 24;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;
    const gridSize = 48; // Crisp 48px grid units

    const render = () => {
      time += 0.008;

      // Smooth lerp easing
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;
      gridOffset.x += (gridOffset.targetX - gridOffset.x) * 0.05;
      gridOffset.y += (gridOffset.targetY - gridOffset.y) * 0.05;

      // Gentle ambient wave breathing
      const ambientX = Math.sin(time) * 6;
      const ambientY = Math.cos(time * 0.8) * 6;

      ctx.clearRect(0, 0, width, height);

      const totalOffsetX = (gridOffset.x + ambientX) % gridSize;
      const totalOffsetY = (gridOffset.y + ambientY) % gridSize;

      // 1. Draw subtle base vertical lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.beginPath();
      for (let x = totalOffsetX; x <= width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Draw subtle base horizontal lines
      for (let y = totalOffsetY; y <= height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw illuminated grid lines & intersection crosshairs near cursor
      const startX = Math.floor((mouse.x - mouse.radius) / gridSize) * gridSize + totalOffsetX;
      const endX = Math.ceil((mouse.x + mouse.radius) / gridSize) * gridSize + totalOffsetX;
      const startY = Math.floor((mouse.y - mouse.radius) / gridSize) * gridSize + totalOffsetY;
      const endY = Math.ceil((mouse.y + mouse.radius) / gridSize) * gridSize + totalOffsetY;

      for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Normalized intensity based on cursor proximity
            const intensity = Math.pow(1 - dist / mouse.radius, 1.8);

            // Draw glowing node point at intersection
            ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.55})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI * 2);
            ctx.fill();

            // Draw crisp intersection crosshair mark (+)
            ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 4, y);
            ctx.lineTo(x + 4, y);
            ctx.moveTo(x, y - 4);
            ctx.lineTo(x, y + 4);
            ctx.stroke();
          }
        }
      }

      // 3. Subtle ambient radial spotlight beam centered on mouse
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 1.3
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.035)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.012)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black select-none"
      aria-hidden="true"
    >
      {/* Dynamic Hardware-Accelerated 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full opacity-90 transition-opacity duration-1000"
      />

      {/* Subtle Radial Vignette to gently fade edges into dark graphite background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0.95) 100%)",
        }}
      />
    </div>
  );
}
