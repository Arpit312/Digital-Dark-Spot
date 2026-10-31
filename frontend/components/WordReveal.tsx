"use client";
import { motion } from "framer-motion";
export default function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <h1 className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </h1>
  );
}
