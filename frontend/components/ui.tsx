"use client";
import { motion } from "framer-motion";
export function Seg({ value, onChange, options, id, className = "", optionClassName = "" }: { value: string; onChange: (v: string) => void; options: string[]; id: string; className?: string; optionClassName?: string }) {
  return (
    <div className={`inline-flex rounded-lg border border-line-strong bg-surface p-1 ${className}`}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${optionClassName} ${value === o ? "text-bg" : "text-muted hover:text-fg"}`}>
          {value === o && <motion.span layoutId={id} className="absolute inset-0 rounded-md bg-fg" transition={{ type: "spring", damping: 30, stiffness: 400 }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full border transition-colors ${on ? "border-fg bg-fg" : "border-line-strong bg-surface"}`}>
      <motion.span animate={{ x: on ? 22 : 2 }} transition={{ type: "spring", damping: 25, stiffness: 400 }} className={`absolute top-0.5 h-4 w-4 rounded-full ${on ? "bg-bg" : "bg-muted"}`} />
    </button>
  );
}
