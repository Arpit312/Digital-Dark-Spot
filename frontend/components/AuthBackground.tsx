"use client";

import { motion } from "framer-motion";

export default function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 1. Deep Celestial Aura Radial Glow (breathing radial light behind the card) */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.15, 0.24, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, rgba(99, 102, 241, 0.12) 35%, rgba(14, 165, 233, 0.05) 55%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      {/* 2. Secondary Ambient Glow Accent */}
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* 3. Primary Outer Concentric Geometric Radar Ring */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 text-white/[0.05]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="3 6"
        />
        {/* Radar Blips */}
        <circle cx="50" cy="2" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="98" cy="50" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="50" cy="98" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="2" cy="50" r="1.5" fill="rgba(255,255,255,0.4)" />
      </motion.svg>

      {/* 4. Secondary Counter-Rotating Orbital Ring */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-white/[0.06]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="10 10"
        />
        <circle cx="17.4" cy="17.4" r="1.2" fill="rgba(255,255,255,0.5)" />
        <circle cx="82.6" cy="82.6" r="1.2" fill="rgba(255,255,255,0.5)" />
      </motion.svg>

      {/* 5. Inner Precise Geometric Framing & Corner Target Markers */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[460px] border border-white/[0.04] rounded-3xl" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] border border-dashed border-white/[0.03] rounded-full" />

      {/* 6. Floating Micro-Nodes / Particle Coordinates */}
      <div className="absolute left-[15%] top-[20%] font-mono text-[9px] uppercase tracking-widest text-white/20">
        LAT: 28.6139° N // PUBLIC_GOV_NODE
      </div>
      <div className="absolute right-[15%] bottom-[20%] font-mono text-[9px] uppercase tracking-widest text-white/20">
        CRYPTOGRAPHIC INTEGRITY: ED25519_VERIFIED
      </div>
      <div className="absolute left-[20%] bottom-[25%] font-mono text-[9px] uppercase tracking-widest text-white/15">
        ZERO_HALLUCINATION_GATE: ACTIVE
      </div>
      <div className="absolute right-[20%] top-[25%] font-mono text-[9px] uppercase tracking-widest text-white/15">
        SHA-256 PROVENANCE: 0x9F4B...12C0
      </div>

      {/* 7. Subtle Corner Crosshairs */}
      <div className="absolute top-12 left-12 text-white/15 font-mono text-xs">+</div>
      <div className="absolute top-12 right-12 text-white/15 font-mono text-xs">+</div>
      <div className="absolute bottom-12 left-12 text-white/15 font-mono text-xs">+</div>
      <div className="absolute bottom-12 right-12 text-white/15 font-mono text-xs">+</div>
    </div>
  );
}
