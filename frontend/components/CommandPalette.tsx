"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
const items = [["Analyze", "/analyze"], ["Reports", "/reports"], ["Watchtower", "/watchtower"], ["Accuracy", "/accuracy"], ["How it works", "/how-it-works"], ["Campus mode", "/campus"], ["Settings", "/settings"]];
export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const r = useRouter();
  const [q, setQ] = useState("");
  useEffect(() => { const e = (x: KeyboardEvent) => x.key === "Escape" && onClose(); addEventListener("keydown", e); return () => removeEventListener("keydown", e); }, [onClose]);
  if (!open) return null;
  const list = items.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 p-4 pt-[15vh] backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-4"><Search size={16} strokeWidth={1.5} className="text-muted" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages and actions..." className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-subtle" /></div>
        <ul className="max-h-72 overflow-auto p-2">
          {list.map(([l, h]) => <li key={h}><button onClick={() => { r.push(h); onClose(); }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted hover:bg-white/5 hover:text-fg">{l}</button></li>)}
          {!list.length && <li className="px-3 py-6 text-center text-sm text-subtle">No results</li>}
        </ul>
      </div>
    </div>
  );
}
