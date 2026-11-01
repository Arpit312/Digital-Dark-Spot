"use client";
import { useState } from "react";
import { motion } from "framer-motion";
export default function Chart({ points }: { points: { t: string; v: number }[] }) {
  const [h, setH] = useState<number | null>(null);
  const W = 600, H = 180, P = 8, max = Math.max(...points.map((p) => p.v), 1);
  const xy = points.map((p, i) => [P + (i * (W - 2 * P)) / Math.max(points.length - 1, 1), H - P - (p.v / max) * (H - 2 * P)]);
  const line = xy.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${xy[xy.length - 1][0]},${H} L${xy[0][0]},${H} Z`;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" onMouseLeave={() => setH(null)} onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setH(Math.max(0, Math.min(points.length - 1, Math.round(((e.clientX - b.left) / b.width) * (points.length - 1))))); }}>
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#1F1F1F" strokeDasharray="3 5" />)}
        <path d={area} fill="url(#ag)" className="transition-all duration-300" />
        <path d={line} fill="none" stroke="#fff" strokeWidth="2" className="transition-all duration-300" />
        {h != null && <><line x1={xy[h][0]} x2={xy[h][0]} y1="0" y2={H} stroke="#2E2E2E" /><circle cx={xy[h][0]} cy={xy[h][1]} r="4" fill="#fff" /></>}
      </svg>
      {h != null && <div className="pointer-events-none absolute right-0 top-0 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-xs"><span className="text-muted">{points[h].t}</span> <span className="font-mono">{points[h].v}</span></div>}
    </div>
  );
}
