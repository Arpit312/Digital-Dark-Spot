"use client";
import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Seg } from "@/components/ui";
const tracked = [["scholarships.gov.in/guidelines", "Daily", "2 h ago"], ["state-portal.gov.in/notice", "Weekly", "1 d ago"]];
const alerts = [["Deadline changed", "scholarships.gov.in/guidelines", "15 Nov 2026", "30 Nov 2026", "Today"], ["Document list updated", "state-portal.gov.in/notice", "Income certificate", "Income certificate or affidavit", "Yesterday"]];
export default function Watchtower() {
  const [f, setF] = useState("Daily"), [u, setU] = useState("");
  return (
    <div>
      <PageHeader eyebrow="WATCHTOWER" title="Know when a source changes." sub="Track pages. Get an alert with the before and after when something meaningful changes." />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-2">
        <div className="card p-6"><div className="mb-4 text-sm font-medium">Tracked sources</div>
          <div className="flex gap-2"><input value={u} onChange={(e) => setU(e.target.value)} className="input" placeholder="https://..." /><button className="btn-ghost"><Plus size={15} />Track</button></div>
          <div className="my-4"><Seg id="freq" value={f} onChange={setF} options={["Hourly", "Daily", "Weekly"]} /></div>
          {tracked.map(([n, fr, t]) => <div key={n} className="flex items-center justify-between border-t border-line py-3 text-sm"><span className="truncate">{n}</span><span className="ml-4 shrink-0 text-xs text-muted">{fr} · {t}</span></div>)}</div>
        <div className="card p-6"><div className="mb-4 flex items-center gap-2 text-sm font-medium"><Bell size={15} strokeWidth={1.5} />Alerts</div>
          {alerts.map(([t, s, b, a, d]) => <div key={t} className="border-t border-line py-4"><div className="flex justify-between text-sm"><span className="font-medium">{t}</span><span className="text-xs text-subtle">{d}</span></div><div className="mt-1 text-xs text-muted">{s}</div><div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs"><div className="rounded-lg border border-line p-3 text-subtle line-through">{b}</div><div className="rounded-lg border border-white/30 p-3">{a}</div></div></div>)}</div>
      </div>
    </div>
  );
}
