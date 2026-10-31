"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Logo from "./Logo";
import CommandPalette from "./CommandPalette";
import { getAuthUser, authLogout, type AuthUser } from "@/lib/api";
const links = [["Analyze", "/analyze"], ["Reports", "/reports"], ["Watchtower", "/watchtower"], ["Accuracy", "/accuracy"], ["How it works", "/how-it-works"]];
export default function Navbar() {
  const p = usePathname();
  const [s, setS] = useState(false), [o, setO] = useState(false), [k, setK] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getAuthUser());
    const f = () => setS(scrollY > 8); f();
    const kd = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setK((v) => !v); } };
    addEventListener("scroll", f, { passive: true }); addEventListener("keydown", kd);
    return () => { removeEventListener("scroll", f); removeEventListener("keydown", kd); };
  }, [p]);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${s ? "h-14 border-line bg-black/70 backdrop-blur-xl" : "h-16 border-transparent"}`}>
        <div className="mx-auto flex h-full max-w-6xl items-center gap-8 px-5">
          <Link href="/" aria-label="Home"><Logo /></Link>
          <nav className="hidden gap-6 md:flex">
            {links.map(([l, h]) => <Link key={h} href={h} className={`relative py-1 text-sm transition-colors ${p.startsWith(h) ? "text-fg" : "text-muted hover:text-fg"}`}>{l}{p.startsWith(h) && <span className="absolute inset-x-0 -bottom-[17px] h-px bg-fg" />}</Link>)}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setK(true)} className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-subtle transition hover:border-white/30 md:flex"><Search size={15} strokeWidth={1.5} />Search<kbd className="ml-auto rounded border border-line-strong px-1.5 font-mono text-[10px]">Ctrl K</kbd></button>
            {user ? (
              <button onClick={authLogout} className="hidden text-sm text-muted hover:text-fg md:block" title={`Signed in as ${user.email}`}>Sign out</button>
            ) : (
              <Link href="/login" className="hidden text-sm text-muted hover:text-fg md:block">Sign in</Link>
            )}
            <Link href="/analyze" className="btn-primary hidden md:inline-flex">Analyze</Link>
            <button className="md:hidden" onClick={() => setO(!o)} aria-label="Menu">{o ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {o && <div className="border-t border-line bg-black px-5 py-4 md:hidden">{links.map(([l, h]) => <Link key={h} href={h} onClick={() => setO(false)} className="block py-3 text-sm text-muted">{l}</Link>)}</div>}
      </header>
      <CommandPalette open={k} onClose={() => setK(false)} />
    </>
  );
}
