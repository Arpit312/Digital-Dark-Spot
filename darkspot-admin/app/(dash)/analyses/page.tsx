"use client";
import { useState } from "react";
import { useApi } from "@/lib/api";
import { Data, PageHead, Table, Seg } from "@/components/ui";
export default function Analyses() {
  const [q, setQ] = useState(""), [st, setSt] = useState("All");
  const r = useApi<any[]>(`/admin/analyses?q=${encodeURIComponent(q)}&status=${st === "All" ? "" : st.toLowerCase()}`, 20000);
  return (
    <div><PageHead title="Analyses" sub="Every analysis run on the app and website." />
      <div className="mb-4 flex flex-wrap gap-3"><input className="input max-w-xs" placeholder="Search question or user" value={q} onChange={(e) => setQ(e.target.value)} /><Seg id="ast" value={st} onChange={setSt} options={["All", "Running", "Done", "Failed"]} /></div>
      <Data r={r} empty="No analyses found">{(d: any[]) => <Table rows={d} cols={[
        { h: "Question", r: (x) => <span className="line-clamp-1 max-w-sm">{x.question}</span> },
        { h: "User", r: (x) => <span className="text-muted">{x.user ?? ""}</span> },
        { h: "Source", r: (x) => <span className="badge">{x.channel ?? "web"}</span> },
        { h: "Status", r: (x) => <span className="badge">{x.status}</span> },
        { h: "Latency", r: (x) => <span className="font-mono text-xs text-muted">{x.latency_ms != null ? `${(x.latency_ms / 1000).toFixed(1)} s` : ""}</span> },
        { h: "Date", r: (x) => <span className="text-muted">{x.created_at ? new Date(x.created_at).toLocaleString() : ""}</span> },
      ]} />}</Data></div>
  );
}
