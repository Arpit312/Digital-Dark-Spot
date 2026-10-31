"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Inbox, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
export function Empty({ icon: I = Inbox, title, sub, action }: any) { return <div className="flex flex-col items-center px-6 py-14 text-center"><I size={26} strokeWidth={1.5} className="text-subtle" /><div className="mt-4 text-sm font-medium">{title}</div>{sub && <div className="mt-1 max-w-sm text-sm text-muted">{sub}</div>}{action && <div className="mt-5">{action}</div>}</div>; }
export function Data({ r, children, empty = "Nothing here yet", isEmpty }: any) {
  if (r.loading && !r.data) return <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />)}</div>;
  if (r.error) return <Empty icon={AlertCircle} title={r.error.status === 403 ? "No access" : "Could not load"} sub={r.error.message} action={<button className="btn-ghost" onClick={r.reload}>Retry</button>} />;
  const d = r.data; if (d == null || (Array.isArray(d) && !d.length) || (isEmpty && isEmpty(d))) return <Empty title={empty} />;
  return <>{children(d)}</>;
}
export function PageHead({ title, sub, right }: any) { return <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>{sub && <p className="mt-1 text-sm text-muted">{sub}</p>}</div>{right}</div>; }
export function Table({ cols, rows, onRow }: { cols: { h: string; r: (x: any) => React.ReactNode; w?: string }[]; rows: any[]; onRow?: (x: any) => void }) {
  return <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="border-b border-line text-left text-xs text-subtle">{cols.map((c) => <th key={c.h} className="px-5 py-3 font-medium">{c.h}</th>)}</tr></thead><tbody>{rows.map((x, i) => <tr key={x.id ?? i} onClick={() => onRow?.(x)} className={`border-b border-line last:border-0 ${onRow ? "cursor-pointer hover:bg-white/[0.03]" : ""}`}>{cols.map((c) => <td key={c.h} className="px-5 py-3.5 align-middle">{c.r(x)}</td>)}</tr>)}</tbody></table></div>;
}
export function Seg({ value, onChange, options, id = "seg" }: any) { return <div className="inline-flex rounded-lg border border-line-strong bg-surface p-1">{options.map((o: string) => <button key={o} onClick={() => onChange(o)} className={`relative rounded-md px-3 py-1.5 text-sm ${value === o ? "text-bg" : "text-muted hover:text-fg"}`}>{value === o && <motion.span layoutId={id} className="absolute inset-0 rounded-md bg-fg" transition={{ type: "spring", damping: 30, stiffness: 400 }} />}<span className="relative">{o}</span></button>)}</div>; }
export function Toggle({ on, onChange, label }: any) { return <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full border transition-colors ${on ? "border-fg bg-fg" : "border-line-strong bg-surface"}`}><motion.span animate={{ x: on ? 22 : 2 }} transition={{ type: "spring", damping: 25, stiffness: 400 }} className={`absolute top-0.5 h-4 w-4 rounded-full ${on ? "bg-bg" : "bg-muted"}`} /></button>; }
export const Sev = ({ s }: { s?: string }) => <span className={`badge ${s === "high" ? "!border-fg !bg-fg !text-bg" : s === "medium" ? "!border-white/60 !text-fg" : ""}`}>{s ?? "info"}</span>;
export function AIReview({ kind, id }: { kind: string; id: string }) {
  const [r, setR] = useState<any>(null), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const go = async () => { setBusy(true); setErr(""); try { setR(await api("/admin/ai/review", { body: { kind, id } })); } catch (e: any) { setErr(e.message); } finally { setBusy(false); } };
  return <div className="mt-3"><button onClick={go} disabled={busy} className="btn-ghost !py-1.5 text-xs">{busy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}AI review</button>
    {err && <div className="mt-2 text-xs text-muted">{err}</div>}
    {r && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-line-strong bg-surface p-4 text-sm"><div className="whitespace-pre-wrap text-muted">{r.summary}</div>{r.recommendation && <div className="mt-3 font-medium">Suggested: {r.recommendation}</div>}{r.risk != null && <div className="mt-1 text-xs text-subtle">Risk score {r.risk}</div>}<div className="mt-3 text-[11px] text-subtle">AI suggestion. Review before acting.</div></motion.div>}</div>;
}
