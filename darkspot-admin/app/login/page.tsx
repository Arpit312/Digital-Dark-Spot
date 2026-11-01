"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
export default function Login() {
  const { user, ready, login } = useAuth(); const r = useRouter();
  const [e, setE] = useState("admin@darkspotatlas.org"), [p, setP] = useState("admin123"), [show, setShow] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  useEffect(() => { if (ready && user) r.replace("/"); }, [ready, user, r]);
  const go = async (ev: React.FormEvent) => { ev.preventDefault(); setBusy(true); setErr(""); try { await login(e, p); r.replace("/"); } catch (x: any) { setErr(x.message); } finally { setBusy(false); } };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-12 lg:flex">
        <div className="dot-grid absolute inset-0" />
        <motion.svg className="pointer-events-none absolute -right-32 top-1/3 opacity-[0.08]" width="640" height="640" viewBox="0 0 48 48" fill="none" animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}><circle cx="24" cy="24" r="16" stroke="#fff" strokeWidth="0.6" strokeDasharray="78 22.5" transform="rotate(-55 24 24)" /><circle cx="24" cy="24" r="1.2" fill="#fff" /></motion.svg>
        <div className="relative"><Logo /></div>
        <div className="relative max-w-md"><h1 className="text-4xl font-semibold tracking-tight">Run DarkSpot with clarity.</h1><p className="mt-4 text-muted">Verify officers, review flagged findings, watch your agents, and ask the AI copilot what needs attention.</p></div>
        <div className="relative text-xs text-subtle">Admin access only. Every action is logged.</div>
      </div>
      <div className="flex items-center justify-center px-6">
        <motion.form onSubmit={go} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <h2 className="text-2xl font-semibold tracking-tight">Admin sign in</h2><p className="mt-1 text-sm text-muted">Use your admin account.</p>
          <div className="mt-8 space-y-3">
            <input className="input h-11" type="email" placeholder="Email" value={e} onChange={(x) => setE(x.target.value)} autoComplete="username" required />
            <div className="relative"><input className="input h-11 pr-10" type={show ? "text" : "password"} placeholder="Password" value={p} onChange={(x) => setP(x.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-muted" aria-label="Toggle password">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {err && <div className="rounded-lg border border-line-strong px-3 py-2 text-sm text-muted">{err}</div>}
            <button className="btn-primary h-11 w-full" disabled={busy}>{busy ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}</button>
            <div className="relative flex py-1 items-center justify-center text-xs text-subtle">
              <span className="px-2 text-muted text-[11px]">OR DEMO DESK</span>
            </div>
            <button
              type="button"
              onClick={async () => {
                setBusy(true);
                setErr("");
                try {
                  await login("admin@darkspotatlas.org", "admin123");
                  r.replace("/");
                } catch (x: any) {
                  setErr(x.message);
                } finally {
                  setBusy(false);
                }
              }}
              className="btn-ghost h-10 w-full text-xs border border-line-strong hover:bg-surface-2 flex items-center justify-center gap-1.5 transition-colors"
            >
              ⚡ 1-Tap Demo Officer Sign In
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
