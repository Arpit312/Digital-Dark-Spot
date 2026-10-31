"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Seg } from "@/components/ui";
const mods: Record<string, string[][]> = {
  "Consistency Auditor": [["Deadline", "Portal: 15 Nov", "FAQ: 30 Nov", "Conflict"], ["Documents", "Circular 12", "Circular 9 (superseded)", "Stale FAQ"]],
  "Confusion Intelligence": [["Step 3: upload documents", "District A", "k >= 10", "Spike"], ["Step 1: eligibility", "District B", "k >= 10", "Normal"]],
  "Source Registry": [["Scheme X deadline", "30 Nov 2026", "2 of 2 signatures", "Active"], ["Scheme X link", "official URL", "1 of 2 signatures", "Pending"]],
};
export default function Officer() {
  const [m, setM] = useState("Consistency Auditor");
  return (
    <div>
      <PageHeader eyebrow="OFFICER CONSOLE" title="Officer console"><div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line-strong px-3 py-2 text-xs text-muted"><Lock size={13} />Verified officers only. Demo uses admin invite and passkey.</div></PageHeader>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Seg id="mod" value={m} onChange={setM} options={Object.keys(mods)} />
        <div className="card mt-6 overflow-hidden"><div className="flex items-center justify-between border-b border-line px-6 py-4 text-sm font-medium">{m}<span className="badge">Sample data</span></div>
          {mods[m].map((r) => <div key={r[0]} className="grid grid-cols-4 gap-4 border-b border-line px-6 py-4 text-sm last:border-0"><span>{r[0]}</span><span className="text-muted">{r[1]}</span><span className="text-muted">{r[2]}</span><span className="badge w-fit">{r[3]}</span></div>)}</div>
        <p className="mt-4 text-xs text-subtle">Confusion Intelligence shows aggregated, anonymised data only. Groups smaller than k are hidden.</p>
      </div>
    </div>
  );
}
