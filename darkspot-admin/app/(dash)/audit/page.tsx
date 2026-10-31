"use client";
import { useState } from "react";
import { useApi } from "@/lib/api";
import { Data, PageHead, Table } from "@/components/ui";
export default function Audit() {
  const [q, setQ] = useState(""); const r = useApi<any[]>(`/admin/audit?limit=200&q=${encodeURIComponent(q)}`, 20000);
  return (
    <div><PageHead title="Audit log" sub="Append-only record of admin and officer actions." />
      <input className="input mb-4 max-w-xs" placeholder="Search actions" value={q} onChange={(e) => setQ(e.target.value)} />
      <Data r={r} empty="No activity yet">{(d: any[]) => <Table rows={d} cols={[{ h: "Action", r: (x) => x.text }, { h: "Actor", r: (x) => <span className="text-muted">{x.actor ?? ""}</span> }, { h: "Time", r: (x) => <span className="font-mono text-xs text-muted">{x.created_at ? new Date(x.created_at).toLocaleString() : ""}</span> }]} />}</Data></div>
  );
}
