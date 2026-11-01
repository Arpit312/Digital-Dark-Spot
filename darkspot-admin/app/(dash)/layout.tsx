"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Users, ShieldCheck, FileText, Flag, Globe, Cpu, ScrollText, Sparkles, Settings, Search, Menu, X, LogOut, LifeBuoy, ExternalLink, Smartphone } from "lucide-react";
import Logo from "@/components/Logo";
import Copilot from "@/components/Copilot";
import { useAuth } from "@/lib/auth";
import { WEBSITE_URL, APP_URL } from "@/lib/api";
const nav = [
  ["Overview", "/", LayoutDashboard],
  ["Support & Desk", "/support", LifeBuoy],
  ["Users", "/users", Users],
  ["Verifications", "/verifications", ShieldCheck],
  ["Analyses", "/analyses", FileText],
  ["Flagged", "/flagged", Flag],
  ["Sources", "/sources", Globe],
  ["Agents", "/agents", Cpu],
  ["Audit log", "/audit", ScrollText],
  ["AI Copilot", "/ai", Sparkles],
  ["Settings", "/settings", Settings]
] as const;
export default function DashLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth(); const r = useRouter(), p = usePathname();
  const [open, setOpen] = useState(false), [ai, setAi] = useState(false), [k, setK] = useState(false), [q, setQ] = useState("");
  useEffect(() => { if (ready && !user) r.replace("/login"); }, [ready, user, r]);
  useEffect(() => { setOpen(false); }, [p]);
  useEffect(() => { const f = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setK((v) => !v); } if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") { e.preventDefault(); setAi((v) => !v); } if (e.key === "Escape") { setK(false); setAi(false); } }; addEventListener("keydown", f); return () => removeEventListener("keydown", f); }, []);
  if (!ready || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-fg" /></div>;
  const list = nav.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()));
  const Side = (
    <div className="flex h-full w-60 flex-col border-r border-line bg-black p-4">
      <div className="mb-8 px-2 pt-1"><Logo /></div>
      <nav className="flex-1 space-y-0.5">{nav.map(([l, h, I]) => { const on = h === "/" ? p === "/" : p.startsWith(h); return <Link key={h} href={h} className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${on ? "text-fg" : "text-muted hover:text-fg"}`}>{on && <motion.span layoutId="nav" className="absolute inset-0 rounded-lg bg-white/[0.07]" transition={{ type: "spring", damping: 30, stiffness: 400 }} />}<I size={16} strokeWidth={1.5} className="relative" /><span className="relative">{l}</span></Link>; })}</nav>
      <div className="flex items-center gap-3 border-t border-line px-2 pt-4"><div className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-xs">{(user.name || user.email || "A")[0].toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate text-sm">{user.name || "Admin"}</div><div className="truncate text-xs text-subtle">{user.email}</div></div><button onClick={() => { logout(); r.replace("/login"); }} aria-label="Sign out" className="text-muted hover:text-fg"><LogOut size={16} /></button></div>
    </div>
  );
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:block">{Side}</aside>
      <AnimatePresence>{open && <><motion.div className="fixed inset-0 z-40 bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} /><motion.aside className="fixed inset-y-0 left-0 z-50 lg:hidden" initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>{Side}</motion.aside></>}</AnimatePresence>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-black/70 px-5 backdrop-blur-xl">
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
          <button onClick={() => setK(true)} className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-subtle hover:border-white/30"><Search size={15} strokeWidth={1.5} />Search or jump to...<kbd className="ml-auto hidden rounded border border-line-strong px-1.5 font-mono text-[10px] sm:block">Ctrl K</kbd></button>
          
          <div className="ml-auto flex items-center gap-2">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted hover:text-white hover:border-line-strong transition"
            >
              <Globe size={13} /> Website (:3000) <ExternalLink size={11} />
            </a>

            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 transition font-mono"
            >
              <LifeBuoy size={13} />
              <span className="hidden md:inline">Support Queue</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </Link>

            <button onClick={() => setAi(true)} className="btn-ghost !py-1.5 text-xs flex items-center gap-1.5">
              <Sparkles size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
      <AnimatePresence>{ai && <><motion.div className="fixed inset-0 z-40 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAi(false)} /><motion.aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-surface p-5" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-medium"><Sparkles size={15} />AI Copilot</div><button onClick={() => setAi(false)} aria-label="Close"><X size={18} /></button></div><div className="min-h-0 flex-1"><Copilot /></div></motion.aside></>}</AnimatePresence>
      {k && <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 p-4 pt-[15vh] backdrop-blur-sm" onClick={() => setK(false)}><div className="card w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to..." className="h-12 w-full border-b border-line bg-transparent px-4 text-sm outline-none placeholder:text-subtle" /><ul className="max-h-72 overflow-auto p-2">{list.map(([l, h, I]) => <li key={h}><button onClick={() => { r.push(h); setK(false); setQ(""); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted hover:bg-white/5 hover:text-fg"><I size={15} strokeWidth={1.5} />{l}</button></li>)}<li><button onClick={() => { setK(false); setAi(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted hover:bg-white/5 hover:text-fg"><Sparkles size={15} strokeWidth={1.5} />Ask AI Copilot</button></li></ul></div></div>}
    </div>
  );
}
