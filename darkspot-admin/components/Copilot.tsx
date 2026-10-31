"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
const chips = ["Summarize today's activity", "Which agent has the highest error rate?", "What needs my attention first?", "List flagged findings by reason"];
export default function Copilot({ full }: { full?: boolean }) {
  const [m, setM] = useState<any[]>([]), [q, setQ] = useState(""), [busy, setBusy] = useState(false); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [m, busy]);
  const ask = async (text: string) => {
    if (!text.trim() || busy) return; const next = [...m, { r: "user", t: text }]; setM(next); setQ(""); setBusy(true);
    try { const r = await api("/admin/ai/ask", { body: { message: text, history: next.slice(-10).map((x) => ({ role: x.r, content: x.t })) } }); setM([...next, { r: "ai", t: r.answer, actions: r.actions }]); }
    catch (e: any) { setM([...next, { r: "ai", t: e.message, err: true }]); } finally { setBusy(false); }
  };
  return (
    <div className={`flex flex-col ${full ? "h-[calc(100vh-11rem)]" : "h-full"}`}>
      <div className="flex-1 space-y-4 overflow-auto px-1 pb-4">
        {m.length === 0 && <div className="pt-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong"><Sparkles size={18} strokeWidth={1.5} /></div><div className="mt-4 text-lg font-medium">Ask about your platform</div><p className="mt-1 text-sm text-muted">Answers come from your live data. Always verify before acting.</p><div className="mt-5 flex flex-wrap gap-2">{chips.map((c) => <button key={c} onClick={() => ask(c)} className="badge hover:border-white/40 hover:text-fg">{c}</button>)}</div></div>}
        {m.map((x, i) => <div key={i} className={x.r === "user" ? "flex justify-end" : ""}><div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${x.r === "user" ? "bg-fg text-bg" : x.err ? "border border-line-strong text-muted" : "border border-line bg-card"}`}>{x.t}{x.actions?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{x.actions.map((a: any) => <Link key={a.href} href={a.href} className="btn-ghost !py-1 text-xs">{a.label}</Link>)}</div>}</div></div>)}
        {busy && <div className="flex gap-1 px-2 py-3">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2 border-t border-line pt-4"><input value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Ask anything about users, findings, agents..." /><button className="btn-primary" disabled={busy || !q.trim()} aria-label="Send"><Send size={15} /></button></form>
    </div>
  );
}
