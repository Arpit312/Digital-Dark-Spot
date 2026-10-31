"use client";
import { motion } from "framer-motion";
import { useApi } from "@/lib/api";
import { Data, PageHead } from "@/components/ui";
export default function Agents() {
  const r = useApi<any[]>("/admin/agents", 20000);
  return (
    <div><PageHead title="Agents" sub="Runs, latency and error rate per agent." />
      <Data r={r} empty="No agent runs yet">{(d: any[]) => <div className="grid gap-4 md:grid-cols-2">{d.map((a, i) => <div key={a.name} className="card p-6"><div className="flex items-center justify-between"><div className="font-medium">{a.name}</div><span className="badge">{a.runs} runs</span></div>
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><div className="text-xs text-muted">Avg latency</div><div className="mt-1 font-mono">{a.avg_ms != null ? `${a.avg_ms} ms` : ""}</div></div><div><div className="text-xs text-muted">Error rate</div><div className="mt-1 font-mono">{a.error_rate != null ? `${(a.error_rate * 100).toFixed(1)}%` : ""}</div></div></div>
        {a.error_rate != null && <div className="mt-4 h-1.5 rounded bg-line"><motion.div className="h-1.5 rounded bg-fg" initial={{ width: 0 }} animate={{ width: `${Math.min(100, a.error_rate * 100 * 5)}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} /></div>}</div>)}</div>}</Data></div>
  );
}
